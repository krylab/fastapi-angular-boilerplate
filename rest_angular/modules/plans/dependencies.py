import logging
from typing import Any

from fastapi import Depends, Request
from lelab_common import Settings

from .exceptions import RateLimitException
from .service import PlansServiceDep, RateLimiterDep
from .settings import PlansSettings

logger = logging.getLogger(__name__)


async def get_optional_user() -> dict[str, Any] | None:
    """Mock dependency for getting optional user - replace with actual implementation"""
    return None


async def rate_limiter_dependency(
    request: Request,
    rate_limiter: RateLimiterDep,
    settings: Settings,
    service: PlansServiceDep,
    user: dict[str, Any] | None = Depends(get_optional_user),
) -> None:
    if not isinstance(settings, PlansSettings):
        settings = PlansSettings()
    path = request.url.path

    if user:
        user_id = user.get("id")
        tier_id = user.get("tier_id")
        if tier_id:
            tier = await service.get_tier(tier_id)
            if tier:
                rate_limit = await service.get_rate_limit(tier.id, path)
                if rate_limit:
                    limit, period = rate_limit.limit, rate_limit.period
                else:
                    logger.warning(
                        f"User {user_id} with tier '{tier.name}' has no specific rate limit for path '{path}'. "
                        f"Applying default rate limit."
                    )
                    limit, period = get_default_rate_limit(settings)
            else:
                logger.warning(f"User {user_id} has no assigned tier. Applying default rate limit.")
                limit, period = get_default_rate_limit(settings)
        else:
            logger.warning(f"User {user_id} has no tier_id. Applying default rate limit.")
            limit, period = get_default_rate_limit(settings)
    else:
        user_id = request.client.host if request.client else "unknown"
        limit, period = get_default_rate_limit(settings)

    if user_id is None:
        user_id = "unknown"

    is_limited = await rate_limiter.is_rate_limited(user_id=user_id, path=path, limit=limit, period=period)
    if is_limited:
        raise RateLimitException("Rate limit exceeded.")


async def rate_limiter_by_target_dependency(
    request: Request,
    target_type: str,
    target_id: str,
    rate_limiter: RateLimiterDep,
    service: PlansServiceDep,
    settings: Settings,
) -> None:
    """Rate limiter dependency that works with any target type (User, App, Tenant, etc.)"""
    if not isinstance(settings, PlansSettings):
        settings = PlansSettings()
    path = request.url.path

    tier_target = await service.get_tier_target(target_type, target_id)
    if tier_target:
        rate_limit = await service.get_rate_limit_by_target(target_type, target_id, path)
        if rate_limit:
            limit, period = rate_limit.limit, rate_limit.period
        else:
            logger.warning(
                f"Target {target_type}:{target_id} has no specific rate limit for path '{path}'. "
                f"Applying default rate limit."
            )
            limit, period = get_default_rate_limit(settings)
    else:
        logger.warning(f"Target {target_type}:{target_id} has no assigned tier. Applying default rate limit.")
        limit, period = get_default_rate_limit(settings)

    is_limited = await rate_limiter.is_rate_limited(
        user_id=f"{target_type}:{target_id}", path=path, limit=limit, period=period
    )
    if is_limited:
        raise RateLimitException("Rate limit exceeded.")


def get_default_rate_limit(settings: PlansSettings) -> tuple[int, int]:
    """Get default rate limit values from settings."""
    return settings.default_rate_limit, settings.default_rate_period
