from pydantic_settings import BaseSettings


class PlansSettings(BaseSettings):
    """Settings for the plans module."""

    # Default rate limit values
    default_rate_limit: int = 100
    default_rate_period: int = 3600  # 1 hour in seconds
