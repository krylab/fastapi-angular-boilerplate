from pydantic import Field
from pydantic_settings import BaseSettings


class MonitorSettings(BaseSettings):
    """Monitoring and observability settings."""

    opentelemetry_endpoint: str | None = Field(default=None, description="OpenTelemetry Grpc endpoint")
