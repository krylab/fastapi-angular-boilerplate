import asyncio
import os
import subprocess
import sys
from typing import Any, AsyncGenerator

import pytest
from fakeredis import FakeServer
from fakeredis.aioredis import FakeConnection
from fastapi import Depends, FastAPI
from httpx import ASGITransport, AsyncClient
from pydantic import BaseModel
from rest_angular.app import create_app
from rest_angular.config import settings
from rest_angular.infra.bus.kafka import KafkaProducer
from rest_angular.infra.cache.redis import RedisContext
from sqlalchemy import text
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    create_async_engine,
)


# Test models for the test endpoints
class RedisModel(BaseModel):
    key: str
    value: str


class KafkaMessage(BaseModel):
    topic: str
    message: str


@pytest.fixture(scope="session")
def anyio_backend() -> str:
    """
    Backend for anyio pytest plugin.

    :return: backend name.
    """
    return "asyncio"


async def run_alembic_migrations():
    """
    Run Alembic migrations to create all tables in the test database.
    """
    # Set environment variable for test database
    env = os.environ.copy()
    env["DB_NAME"] = "rest_angular_test"

    # Run alembic upgrade head
    try:
        result = subprocess.run(
            [sys.executable, "-m", "alembic", "upgrade", "head"],
            cwd=os.getcwd(),
            env=env,
            capture_output=True,
            text=True,
            check=True,
        )
        print(f"Alembic migrations completed successfully: {result.stdout}")
    except subprocess.CalledProcessError as e:
        print(f"Alembic migration failed: {e.stderr}")
        raise RuntimeError(f"Failed to run Alembic migrations: {e.stderr}")


async def ensure_test_database_exists():
    """
    Ensure the test database exists, create it if it doesn't.
    """
    # Connect to default postgres database to create test database
    default_db_url = settings.db_url.replace(f"/{settings.db_name}", "/postgres")
    default_engine = create_async_engine(default_db_url, echo=False, isolation_level="AUTOCOMMIT")

    try:
        async with default_engine.connect() as conn:
            # Check if test database exists
            result = await conn.execute(
                text("SELECT 1 FROM pg_database WHERE datname = :db_name"), {"db_name": "rest_angular_test"}
            )

            if not result.fetchone():
                # Create test database
                await conn.execute(text('CREATE DATABASE "rest_angular_test"'))
                print("Test database 'rest_angular_test' created successfully")
            else:
                print("Test database 'rest_angular_test' already exists")
    finally:
        await default_engine.dispose()


@pytest.fixture(scope="session")
async def engine() -> AsyncGenerator[AsyncEngine, None]:
    """
    Create engine and test database for testing.

    This fixture sets up a test database with the name "rest_angular_test",
    runs Alembic migrations to create all tables, and cleans up after all tests.
    It runs once per test session.

    :yield: new engine connected to test database.
    """
    # Override database name for testing
    settings.db_name = "rest_angular_test"

    # Create test database URL
    test_db_url = settings.db_url

    # First ensure test database exists using default postgres connection
    await ensure_test_database_exists()  # Use default postgres connection

    # Create engine for testing
    engine = create_async_engine(test_db_url, echo=False)

    try:
        # Test connection to ensure database exists
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))

        # Run Alembic migrations to create all tables
        await run_alembic_migrations()

        yield engine

    finally:
        # Cleanup: Drop all tables and dispose engine
        try:
            async with engine.begin() as conn:
                # Drop all tables
                await conn.execute(text("DROP SCHEMA public CASCADE"))
                await conn.execute(text("CREATE SCHEMA public"))
                await conn.execute(text("GRANT ALL ON SCHEMA public TO public"))
        except Exception:
            pass  # Ignore cleanup errors

        await engine.dispose()


@pytest.fixture
async def fastapi_app(engine: AsyncEngine) -> AsyncGenerator[FastAPI, None]:
    """
    Fixture for creating FastAPI app with test database engine.

    Uses the real create_app() function with the test database engine.
    The database is already set up by the engine fixture.

    :param engine: Test database engine
    :yield: fastapi app with test endpoints and test database.
    """
    app = create_app()

    # Add test endpoints directly to the app for testing purposes
    @app.put("/test/redis/set", name="test_set_redis_value")
    async def test_set_redis_value(
        data: RedisModel,
        redis: RedisContext,
    ) -> dict[str, str]:
        """
        Test set value in Redis.
        """
        await redis.set(data.key, data.value)
        return {"message": "Value set successfully"}

    @app.get("/test/redis/get", name="test_get_redis_value")
    async def test_get_redis_value(
        key: str,
        redis: RedisContext,
    ) -> dict[str, Any]:
        """
        Test get value from Redis.
        """
        value = await redis.get(key)
        return {
            "key": key,
            "value": value.decode() if value else None,
        }

    @app.post("/test/kafka/send", name="test_send_kafka_message")
    async def test_send_kafka_message(
        data: KafkaMessage,
        producer: KafkaProducer,
    ) -> dict[str, str]:
        """
        Test send message to Kafka.
        """
        # Send message to Kafka
        await producer.send(data.topic, data.message.encode())
        await producer.flush()  # Ensure message is sent

        return {
            "message": "Message sent successfully",
        }

    try:
        yield app
    finally:
        pass


@pytest.fixture
async def client(
    fastapi_app: FastAPI,
    anyio_backend: Any,
) -> AsyncGenerator[AsyncClient, None]:
    """
    Fixture that creates client for requesting server.

    :param fastapi_app: the application.
    :yield: client for the app.
    """
    transport = ASGITransport(app=fastapi_app)
    async with AsyncClient(transport=transport, base_url="http://test", timeout=30.0) as ac:
        yield ac


@pytest.fixture(scope="session", autouse=True)
async def cleanup_test_database():
    """
    Final cleanup fixture that drops the test database completely.
    This runs automatically after all tests are finished.
    """
    yield  # Run all tests first

    # Drop the test database completely
    try:
        # Connect to default postgres database to drop test database
        settings.db_name = "postgres"
        default_db_url = settings.db_url

        default_engine = create_async_engine(default_db_url, echo=False, isolation_level="AUTOCOMMIT")

        async with default_engine.connect() as conn:
            # Terminate all connections to test database
            await conn.execute(
                text("SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = :db_name"),
                {"db_name": "rest_angular_test"},
            )

            # Drop test database
            await conn.execute(text('DROP DATABASE IF EXISTS "rest_angular_test"'))
            print("Test database 'rest_angular_test' dropped successfully")

        await default_engine.dispose()

    except Exception as e:
        print(f"Warning: Failed to drop test database: {e}")
        # Don't fail the tests if cleanup fails
