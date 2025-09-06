from typing import Annotated

from fastapi import Depends
from pydantic import Field
from pydantic_settings import BaseSettings


def get_configuration() -> BaseSettings:
    """Get configuration instance for dependency injection."""
    raise NotImplementedError("Please override get_configuration dependency when initializing the app")


Settings = Annotated[BaseSettings, Depends(get_configuration)]


class AppSettings(BaseSettings):
    """
    General application settings.

    These parameters can be configured
    with environment variables.
    """

    environment: str = "dev"
    log_level: str = Field(default="INFO", description="Logging level")
    host: str = Field(default="localhost", description="FastAPI host")
    port: int = Field(default=8000, ge=1, le=65535, description="FastAPI port")
    reload: bool = Field(default=False, description="Enable uvicorn reloading")
