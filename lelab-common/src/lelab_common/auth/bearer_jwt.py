from typing import Any

import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from ..configuration import Settings
from ..exceptions import UnauthorizedException
from .dependencies import JwtDecodeOptionsDep, PayloadMapperDep
from .models import CurrentUser
from .settings import BearerJwtSettings

bearer_scheme = HTTPBearer(auto_error=False)


async def get_bearer_current_user(
    settings: Settings,
    decode_options: JwtDecodeOptionsDep,
    payload_mapper: PayloadMapperDep,
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> CurrentUser:
    """Get current user from bearer JWT token"""
    if not isinstance(settings, BearerJwtSettings):
        raise NotImplementedError("The application settings is not inherited from BearerJwtSettings")
    if not credentials or not credentials.credentials:
        raise UnauthorizedException(message="bearer jwt token is not provided")
    payload = verify_bearer_jwt_token(credentials.credentials, settings, decode_options)
    return payload_mapper(payload)


def verify_bearer_jwt_token(
    jwt_token: str,
    config: BearerJwtSettings,
    decode_options: dict[str, Any] | None,
) -> dict[str, Any]:
    """Verify bearer JWT token and return current user"""
    try:
        decode_kwargs: dict[str, Any] = {
            "key": config.secret_key,
            "algorithms": [config.algorithm],
        }
        if decode_options:
            decode_kwargs.update(decode_options)
        payload = jwt.decode(jwt_token, **decode_kwargs)
        return payload
    except jwt.InvalidTokenError as error:
        raise UnauthorizedException(message="bearer jwt token is invalid") from error
