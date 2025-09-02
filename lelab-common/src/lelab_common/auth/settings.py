from pydantic import Field
from pydantic_settings import BaseSettings


class OAuth2JwtSettings(BaseSettings):
    """OAuth2 JWT validation settings."""

    authority: str = Field(
        "your-authority", description="The authority used to validate which authority issues the token"
    )
    audience: str = Field(
        "your-audience", description="The audience used to validate which audience the token is intended for"
    )
    authorization_url: str = Field(
        "your-authorization-url", description="The authorization URL provided to fastapi security oauth2 bearer"
    )
    token_url: str = Field("your-token-url", description="The token URL provided to fastapi security oauth2 bearer")
    well_known_url: str | None = Field(None, description="The well-known URL of the OAuth2 provider to get the JWKS")
    jwks_url: str | None = Field(None, description="The JWKS URL of the OAuth2 provider to get the JWKS")


class BearerJwtSettings(BaseSettings):
    """Bearer JWT validation settings."""

    secret_key: str = Field("your-secret-key", description="The secret key used to sign and verify JWT tokens")
    algorithm: str = Field("HS256", description="The algorithm used to sign JWT tokens")
