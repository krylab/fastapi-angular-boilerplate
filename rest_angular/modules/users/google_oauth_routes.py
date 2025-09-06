import json
from typing import Annotated, Any

import jwt
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi_users import models
from fastapi_users.authentication import AuthenticationBackend
from fastapi_users.jwt import decode_jwt
from fastapi_users.router.common import ErrorCode
from fastapi_users.router.oauth import OAuth2AuthorizeResponse, generate_state_token
from httpx_oauth.clients.google import GoogleOAuth2
from httpx_oauth.integrations.fastapi import OAuth2AuthorizeCallback
from lelab_common import Settings

from .settings import UserSettings
from .user_manager import get_user_manager


class CustomGoogleOAuth2(GoogleOAuth2):
    """
    Custom Google OAuth2 client that prefers id_token over access_token
    for getting user information when available.
    """

    async def get_id_email_from_token(self, token: dict[str, Any]) -> tuple[str, str | None]:
        """
        Get user ID and email from Google OAuth token, preferring id_token if available.

        Args:
            token: OAuth token dictionary containing access_token and optionally id_token

        Returns:
            Tuple of (user_id, email)
        """
        if "id_token" in token:
            try:
                id_token_payload = jwt.decode(token["id_token"], options={"verify_signature": False})

                user_id = id_token_payload.get("sub")
                email = id_token_payload.get("email")

                if user_id and email:
                    return user_id, email

            except (jwt.DecodeError, KeyError, TypeError) as e:
                print(f"Failed to decode id_token: {e}")
                pass

        return await super().get_id_email(token["access_token"])


_google_oauth_client: CustomGoogleOAuth2 | None = None


def get_google_oauth_client(settings: Settings) -> CustomGoogleOAuth2:
    """Get Google OAuth client with settings from dependency injection."""
    if not isinstance(settings, UserSettings):
        raise NotImplementedError("The application settings is not inherited from UserSettings")
    global _google_oauth_client
    if _google_oauth_client is None:
        _google_oauth_client = CustomGoogleOAuth2(
            settings.google_oauth_client_id,
            settings.google_oauth_client_secret,
        )
    return _google_oauth_client


GoogleOAuth2Client = Annotated[CustomGoogleOAuth2, Depends(get_google_oauth_client)]

router = APIRouter()


def get_google_oauth_routes(
    auth_jwt: AuthenticationBackend[models.UP, models.ID],
) -> APIRouter:
    @router.get(
        "/authorize",
        name="oauth:google.jwt.authorize",
        response_model=OAuth2AuthorizeResponse,
    )
    async def google_authorize(
        request: Request, google_oauth_client: GoogleOAuth2Client, settings: Settings
    ) -> OAuth2AuthorizeResponse:
        """Custom Google OAuth authorize endpoint that uses scopes from config."""
        if not isinstance(settings, UserSettings):
            raise NotImplementedError("The application settings is not inherited from UserSettings")

        callback_route_name = "oauth:google.jwt.callback"
        authorize_redirect_url = str(request.url_for(callback_route_name))

        state_data: dict[str, str] = {}
        state = generate_state_token(state_data, settings.google_oauth_client_state_secret)

        authorization_url = await google_oauth_client.get_authorization_url(
            authorize_redirect_url,
            state,
            settings.google_oauth_scopes,
        )

        return OAuth2AuthorizeResponse(authorization_url=authorization_url)

    STATE_TOKEN_AUDIENCE = "fastapi-users:oauth-state"

    @router.get(
        "/callback",
        name="oauth:google.jwt.callback",
        description="Custom Google OAuth callback that handles id_token",
    )
    async def google_callback(
        request: Request,
        google_oauth_client: GoogleOAuth2Client,
        settings: Settings,
        user_manager=Depends(get_user_manager),
        strategy=Depends(auth_jwt.get_strategy),
        code: str | None = None,
        code_verifier: str | None = None,
        state: str | None = None,
        error: str | None = None,
    ):
        """Custom callback that handles id_token when available."""
        if not isinstance(settings, UserSettings):
            raise NotImplementedError("The application settings is not inherited from UserSettings")

        oauth2_authorize_callback = OAuth2AuthorizeCallback(
            google_oauth_client,
            route_name="oauth:google.jwt.callback",
        )

        token, state = await oauth2_authorize_callback(request, code, code_verifier, state, error)

        account_id, account_email = await google_oauth_client.get_id_email_from_token(token)

        if account_email is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ErrorCode.OAUTH_NOT_AVAILABLE_EMAIL,
            )

        if state is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

        try:
            decode_jwt(state, settings.google_oauth_client_state_secret, [STATE_TOKEN_AUDIENCE])
        except jwt.DecodeError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

        try:
            user = await user_manager.oauth_callback(
                google_oauth_client.name,
                token["access_token"],
                account_id,
                account_email,
                token.get("expires_at"),
                token.get("refresh_token"),
                request,
                associate_by_email=False,
                is_verified_by_default=False,
            )
        except Exception as e:
            if "already exists" in str(e).lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=ErrorCode.OAUTH_USER_ALREADY_EXISTS,
                )
            raise e

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ErrorCode.LOGIN_BAD_CREDENTIALS,
            )

        response = await auth_jwt.login(strategy, user)
        await user_manager.on_after_login(user, request, response)
        return response

    return router
