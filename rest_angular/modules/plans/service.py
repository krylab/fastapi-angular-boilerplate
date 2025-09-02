from datetime import UTC, datetime
from typing import Annotated

from fastapi import Depends

from ...infra.cache.redis import RedisClient
from .models import RateLimit, Tier, TierTarget
from .repository import (
    RateLimitRepositoryDep,
    TierRepositoryDep,
    TierTargetRepositoryDep,
)
from .schemas import sanitize_path


class RateLimiter:
    def __init__(self, redis_client: RedisClient):
        self.client = redis_client

    async def is_rate_limited(self, user_id: str | int, path: str, limit: int, period: int) -> bool:
        current_timestamp = int(datetime.now(UTC).timestamp())
        window_start = current_timestamp - (current_timestamp % period)

        sanitized_path = sanitize_path(path)
        key = f"ratelimit:{user_id}:{sanitized_path}:{window_start}"

        try:
            current_count = await self.client.incr(key)
            if current_count == 1:
                await self.client.expire(key, period)

            if current_count > limit:
                return True

        except Exception as e:
            raise e

        return False


class PlansService:
    def __init__(
        self,
        tier_repo: TierRepositoryDep,
        rate_limit_repo: RateLimitRepositoryDep,
        tier_target_repo: TierTargetRepositoryDep,
    ):
        self.tier_repo = tier_repo
        self.rate_limit_repo = rate_limit_repo
        self.tier_target_repo = tier_target_repo

    async def get_tier(self, tier_id: int) -> Tier | None:
        return await self.tier_repo.get_by_id(tier_id)

    async def get_tier_target(self, target_type: str, target_id: str) -> TierTarget | None:
        return await self.tier_target_repo.get_by_target(target_type, target_id)

    async def get_rate_limit_by_target(self, target_type: str, target_id: str, path: str) -> RateLimit | None:
        tier_target = await self.tier_target_repo.get_by_target(target_type, target_id)
        if not tier_target:
            return None
        return await self.rate_limit_repo.get_by_tier_target_and_path(tier_target.id, path)

    async def get_rate_limit(self, tier_id: int, path: str) -> RateLimit | None:
        return await self.rate_limit_repo.get_by_tier_and_path(tier_id, path)


RateLimiterDep = Annotated[RateLimiter, Depends()]
PlansServiceDep = Annotated[PlansService, Depends()]
