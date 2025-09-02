from functools import cached_property

from pydantic import Field
from pydantic_settings import BaseSettings
from yarl import URL


class DatabaseSettings(BaseSettings):
    """Database connection settings."""

    db_host: str = Field(default="localhost", description="Database host")
    db_port: int = Field(default=5432, description="Database port")
    db_user: str = Field(default="sa", description="Database username")
    db_password: str = Field(default="", description="Database password")
    db_name: str = Field(default="postgres", description="Database name")
    db_engine_scheme: str = Field(default="postgresql+asyncpg", description="Database engine scheme")

    @cached_property
    def db_url(self) -> str:
        """
        Assemble database URL from settings.

        Returns:
            database connection string.
        """
        return str(
            URL.build(
                scheme=self.db_engine_scheme,
                host=self.db_host,
                port=self.db_port,
                user=self.db_user,
                password=self.db_password,
                path=f"/{self.db_name}",
            )
        )
