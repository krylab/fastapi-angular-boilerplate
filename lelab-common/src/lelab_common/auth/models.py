from pydantic import BaseModel, ConfigDict


class CurrentUser(BaseModel):
    user_id: str
    app_id: str | None = None
    roles: list[str] | None = None
    scopes: list[str] | None = None

    model_config = ConfigDict(extra="allow")


class OAuth2Config(BaseModel):
    authority: str
    audience: str
    authorization_url: str
    token_url: str
    well_known_url: str | None = None
    jwks_url: str | None = None

    model_config = ConfigDict(frozen=True)
