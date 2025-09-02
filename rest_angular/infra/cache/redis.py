from typing import Annotated, AsyncGenerator

from fastapi import Depends
from lelab_common import Settings
from redis.asyncio import ConnectionPool, Redis

from .exceptions import RedisConnectionException
from .settings import RedisSettings


async def get_redis_context(settings: Settings) -> AsyncGenerator[Redis, None]:
    """Get redis connection with safe memory management."""
    if not isinstance(settings, RedisSettings):
        raise NotImplementedError("The application settings is not inherited from RedisSettings")

    try:
        pool = ConnectionPool.from_url(settings.redis_url)
        redis_client = Redis(connection_pool=pool)

        try:
            yield redis_client
        finally:
            await redis_client.aclose()
            await pool.disconnect()
    except Exception as e:
        raise RedisConnectionException(f"Failed to get redis connection: {e}")


RedisContext = Annotated[Redis, Depends(get_redis_context)]


async def get_redis(settings: Settings) -> Redis:
    """Get redis connection with manual memory management."""
    if not isinstance(settings, RedisSettings):
        raise NotImplementedError("The application settings is not inherited from RedisSettings")

    try:
        pool = ConnectionPool.from_url(settings.redis_url)
        redis_client = Redis(connection_pool=pool)
        return redis_client
    except Exception as e:
        raise RedisConnectionException(f"Failed to get redis connection: {e}")


RedisClient = Annotated[Redis, Depends(get_redis)]
