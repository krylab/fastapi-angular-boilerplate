from pydantic import Field
from pydantic_settings import BaseSettings


class UserSettings(BaseSettings):
    """Authentication and authorization settings."""

    # Fastapi users authentication settings
    jwt_strategy_secret: str = Field(default="your-secret-key", description="Users secret key for JWT tokens")
    reset_password_token_secret: str = Field(
        default="reset_password_token_secret", description="Users secret key for reset password tokens"
    )
    verification_token_secret: str = Field(
        default="verification_token_secret", description="Users secret key for verification tokens"
    )

    # Google oauth settings
    google_oauth_client_id: str = Field(default="", description="Google OAuth client ID")
    google_oauth_client_secret: str = Field(default="", description="Google OAuth client secret")
    google_oauth_client_state_secret: str = Field(
        default="your-oauth-state-secret", description="Google OAuth state secret"
    )
    google_oauth_scopes: list[str] = Field(
        default=["openid", "email", "profile"], description="Google OAuth scopes to request"
    )
