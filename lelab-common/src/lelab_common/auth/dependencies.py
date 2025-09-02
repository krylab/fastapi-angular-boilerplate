from typing import Annotated, Any, Callable

from fastapi import Depends

from .models import CurrentUser


def get_current_user() -> CurrentUser:
    """Abstract dependency for getting the current user"""
    raise NotImplementedError("Please override get_current_user dependency when initializing the app")


def map_payload_to_current_user(payload: dict[str, Any]) -> CurrentUser:
    """Abstract dependency for mapping JWT payload to CurrentUser"""
    raise NotImplementedError("Please override map_payload_to_current_user dependency when initializing the app")


def get_jwt_decode_options() -> dict[str, Any] | None:
    """Optional dependency for getting JWT decode parameters (key, algorithms, audience, issuer, etc.)"""
    return None


CurrentUserDep = Annotated[CurrentUser, Depends(get_current_user)]
PayloadMapperDep = Annotated[Callable[[dict[str, Any]], CurrentUser], Depends(map_payload_to_current_user)]
JwtDecodeOptionsDep = Annotated[dict[str, Any] | None, Depends(get_jwt_decode_options)]
