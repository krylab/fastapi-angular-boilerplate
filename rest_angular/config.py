from functools import cached_property

from lelab_common import AppSettings
from pydantic import Field
from pydantic_settings import SettingsConfigDict
from yarl import URL

from .infra.bus.settings import KafkaSettings
from .infra.cache.settings import RedisSettings
from .infra.monitor.settings import MonitorSettings
from .infra.orm.settings import DatabaseSettings
from .modules.plans.settings import PlansSettings
from .modules.users.settings import UserSettings

__all__ = ["settings"]


class RestAngularAppSettings(AppSettings):
    """
    Specific application settings.

    These parameters can be configured
    with environment variables.
    """

    openapi_enabled: bool = Field(default=True, description="Enable OpenAPI")
    openapi_oauth2_client_id: str = Field(default="oauth2-client-id", description="OpenAPI OAuth2 client ID")
    openapi_oauth2_client_secret: str | None = Field(default=None, description="OpenAPI OAuth2 client secret")
    openapi_oauth2_scopes: str = Field(default="oauth2-scopes", description="OpenAPI OAuth2 scopes")


class _Settings(
    RestAngularAppSettings, DatabaseSettings, RedisSettings, MonitorSettings, KafkaSettings, UserSettings, PlansSettings
):
    """Main settings class that combines all domain settings."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = _Settings()
