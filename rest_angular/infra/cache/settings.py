from functools import cached_property

from pydantic import Field
from pydantic_settings import BaseSettings
from yarl import URL


class RedisSettings(BaseSettings):
    """Redis connection settings."""

    redis_host: str = Field(default="localhost", description="Redis host")
    redis_port: int = Field(default=6379, description="Redis port")
    redis_user: str | None = Field(default=None, description="Redis username")
    redis_password: str | None = Field(default=None, description="Redis password")
    redis_db: int | None = Field(default=None, description="Redis database number")

    @cached_property
    def redis_url(self) -> str:
        """
        Assemble REDIS URL from settings.

        Returns:
            redis connection string.
        """
        path = ""
        if self.redis_db is not None:
            path = f"/{self.redis_db}"
        return str(
            URL.build(
                scheme="redis",
                host=self.redis_host,
                port=self.redis_port,
                user=self.redis_user,
                password=self.redis_password,
                path=path,
            )
        )
