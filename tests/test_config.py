import pytest
from rest_angular.config import settings


def test_test_environment_configuration() -> None:
    """
    Test that the configuration is properly loaded with test values.
    """
    # Check that we're in test environment
    assert hasattr(settings, "environment"), "Settings should have environment attribute"

    # Check database configuration
    assert hasattr(settings, "db_name"), "Settings should have db_name attribute"
    assert hasattr(settings, "db_host"), "Settings should have db_host attribute"
    assert hasattr(settings, "db_port"), "Settings should have db_port attribute"

    # Print current configuration for debugging
    print(f"Environment: {getattr(settings, 'environment', 'Not set')}")
    print(f"Database URL: {settings.db_url}")
    print(f"Database Name: {settings.db_name}")
    print(f"Database Host: {settings.db_host}")
    print(f"Database Port: {settings.db_port}")


def test_kafka_configuration() -> None:
    """
    Test that Kafka configuration is properly loaded.
    """
    assert hasattr(settings, "kafka_bootstrap_servers"), "Settings should have kafka_bootstrap_servers attribute"
    print(f"Kafka Bootstrap Servers: {settings.kafka_bootstrap_servers}")


def test_redis_configuration() -> None:
    """
    Test that Redis configuration is properly loaded.
    """
    assert hasattr(settings, "redis_url"), "Settings should have redis_url attribute"
    print(f"Redis URL: {settings.redis_url}")
