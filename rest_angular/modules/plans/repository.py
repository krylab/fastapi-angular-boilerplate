from typing import Annotated

from fastapi import Depends
from sqlalchemy import select

from ...infra.orm.repository import BaseRepository
from ...infra.orm.uow import UnitOfWorkDep
from .models import RateLimit, Tier, TierTarget


class TierRepository(BaseRepository[Tier, int]):
    def __init__(self, uow: UnitOfWorkDep):
        super().__init__(Tier, uow)

    async def get_by_name(self, name: str, eager_load: list[str] | None = None) -> Tier | None:
        await self._uow.check_cancelled()
        stmt = select(self._model_class).where(self._model_class.name == name)

        stmt = self._apply_eager_loading(stmt, eager_load)

        result = await self._execute(stmt)
        await self._uow.check_cancelled()

        return result.scalar_one_or_none()

    async def get_with_targets(self, tier_id: int) -> Tier | None:
        """Get tier with tier_targets eagerly loaded."""
        return await self.get_by_id(tier_id, eager_load=["tier_targets"])

    async def get_all_with_targets(self) -> list[Tier]:
        """Get all tiers with tier_targets eagerly loaded."""
        return await self.get_all(eager_load=["tier_targets"])


TierRepositoryDep = Annotated[TierRepository, Depends()]


class TierTargetRepository(BaseRepository[TierTarget, int]):
    def __init__(self, uow: UnitOfWorkDep):
        super().__init__(TierTarget, uow)

    async def get_by_target(
        self, target_type: str, target_id: str, eager_load: list[str] | None = None
    ) -> TierTarget | None:
        await self._uow.check_cancelled()
        stmt = select(self._model_class).where(
            self._model_class.target_type == target_type,
            self._model_class.target_id == target_id,
            self._model_class.is_active == True,
        )

        stmt = self._apply_eager_loading(stmt, eager_load)

        result = await self._execute(stmt)
        await self._uow.check_cancelled()
        return result.scalar_one_or_none()

    async def get_by_tier(self, tier_id: int, eager_load: list[str] | None = None) -> list[TierTarget]:
        await self._uow.check_cancelled()
        stmt = select(self._model_class).where(
            self._model_class.tier_id == tier_id, self._model_class.is_active == True
        )

        stmt = self._apply_eager_loading(stmt, eager_load)

        result = await self._execute(stmt)
        await self._uow.check_cancelled()
        return list(result.scalars().all())

    async def get_by_target_type(self, target_type: str, eager_load: list[str] | None = None) -> list[TierTarget]:
        await self._uow.check_cancelled()
        stmt = select(self._model_class).where(
            self._model_class.target_type == target_type, self._model_class.is_active == True
        )

        stmt = self._apply_eager_loading(stmt, eager_load)

        result = await self._execute(stmt)
        await self._uow.check_cancelled()
        return list(result.scalars().all())

    async def get_with_rate_limits(self, tier_target_id: int) -> TierTarget | None:
        """Get tier target with rate limits eagerly loaded."""
        return await self.get_by_id(tier_target_id, eager_load=["rate_limits"])

    async def get_by_tier_with_rate_limits(self, tier_id: int) -> list[TierTarget]:
        """Get tier targets by tier with rate limits eagerly loaded."""
        return await self.get_by_tier(tier_id, eager_load=["rate_limits"])


TierTargetRepositoryDep = Annotated[TierTargetRepository, Depends()]


class RateLimitRepository(BaseRepository[RateLimit, int]):
    def __init__(self, uow: UnitOfWorkDep):
        super().__init__(RateLimit, uow)

    async def get_by_tier_target_and_path(
        self, tier_target_id: int, path: str, eager_load: list[str] | None = None
    ) -> RateLimit | None:
        await self._uow.check_cancelled()
        stmt = select(self._model_class).where(
            self._model_class.tier_target_id == tier_target_id, self._model_class.path == path
        )

        stmt = self._apply_eager_loading(stmt, eager_load)

        result = await self._execute(stmt)
        await self._uow.check_cancelled()
        return result.scalar_one_or_none()

    async def get_by_tier_target(self, tier_target_id: int, eager_load: list[str] | None = None) -> list[RateLimit]:
        await self._uow.check_cancelled()
        stmt = select(self._model_class).where(self._model_class.tier_target_id == tier_target_id)

        stmt = self._apply_eager_loading(stmt, eager_load)

        result = await self._execute(stmt)
        await self._uow.check_cancelled()
        return list(result.scalars().all())

    async def get_by_tier_and_path(self, tier_id: int, path: str) -> RateLimit | None:
        await self._uow.check_cancelled()
        stmt = (
            select(self._model_class)
            .join(TierTarget)
            .where(TierTarget.tier_id == tier_id, self._model_class.path == path)
        )
        result = await self._execute(stmt)
        await self._uow.check_cancelled()
        return result.scalar_one_or_none()


RateLimitRepositoryDep = Annotated[RateLimitRepository, Depends()]
