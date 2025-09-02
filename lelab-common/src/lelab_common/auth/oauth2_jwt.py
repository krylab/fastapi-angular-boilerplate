from typing import Annotated, Any, Callable

import httpx
import jwt
from cachetools import TTLCache, cached
from fastapi import Depends, Request
from fastapi.security import OAuth2AuthorizationCodeBearer

from ..configuration import Settings
from ..exceptions import UnauthorizedException
from .dependencies import PayloadMapperDep
from .models import CurrentUser, OAuth2Config
from .settings import OAuth2JwtSettings


def _get_oauth2_config(settings: Settings) -> OAuth2Config:
    if not isinstance(settings, OAuth2JwtSettings):
        raise NotImplementedError("The application settings is not inherited from OAuth2JwtSettings")

    return OAuth2Config(
        authority=settings.authority,
        audience=settings.audience,
        authorization_url=settings.authorization_url,
        token_url=settings.token_url,
        well_known_url=settings.well_known_url,
        jwks_url=settings.jwks_url,
    )


_OAuth2ConfigDep = Annotated[OAuth2Config, Depends(_get_oauth2_config)]


def get_oauth2_scheme(config: _OAuth2ConfigDep) -> OAuth2AuthorizationCodeBearer:
    return OAuth2AuthorizationCodeBearer(
        authorizationUrl=config.authorization_url,
        tokenUrl=config.token_url,
        auto_error=False,
    )


OAuth2Scheme = Annotated[OAuth2AuthorizationCodeBearer, Depends(get_oauth2_scheme)]


async def get_oauth2_current_user(
    request: Request,
    config: _OAuth2ConfigDep,
    oauth2_scheme: OAuth2Scheme,
    payload_mapper: PayloadMapperDep,
) -> CurrentUser:
    jwt_token = await oauth2_scheme(request)
    if not jwt_token:
        raise UnauthorizedException(message="oauth2 jwt token is not provided")
    return verify_oauth2_jwt_token(config, jwt_token, payload_mapper)


def verify_oauth2_jwt_token(
    config: OAuth2Config, jwt_token: str, payload_mapper: Callable[[dict[str, Any]], CurrentUser]
) -> CurrentUser:
    try:
        jwk_client = _get_jwk_client(config)
        jwk = jwk_client.get_signing_key_from_jwt(jwt_token)
        payload = jwt.decode(
            jwt_token,
            jwk.key,
            algorithms=[jwk.algorithm_name],
            audience=config.audience,
            issuer=config.authority,
        )
        return payload_mapper(payload)
    except jwt.InvalidTokenError as error:
        raise UnauthorizedException(message="oauth2 jwt token is invalid") from error


@cached(cache=TTLCache[OAuth2Config, jwt.PyJWKClient](maxsize=32, ttl=86400))
def _get_jwk_client(config: OAuth2Config) -> jwt.PyJWKClient:
    # Use JWKS URL if provided
    if config.jwks_url:
        return jwt.PyJWKClient(config.jwks_url)

    # Fallback to well-known URL
    well_known_url = config.well_known_url or f"{config.authority.rstrip('/')}/.well-known/openid-configuration"
    oid_conf_response = httpx.get(well_known_url, timeout=2)
    oid_conf_response.raise_for_status()
    oid_conf = oid_conf_response.json()
    return jwt.PyJWKClient(oid_conf["jwks_uri"])
