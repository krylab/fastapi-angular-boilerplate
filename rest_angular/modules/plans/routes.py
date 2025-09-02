from datetime import UTC, datetime

from fastapi import APIRouter, HTTPException, status

from ...infra.orm.uow import UnitOfWorkDep
from ...modules.plans.repository import RateLimitRepository, TierRepository
from ...modules.plans.schemas import (
    RateLimitCreate,
    RateLimitRead,
    RateLimitUpdate,
    TierCreate,
    TierRead,
    TierUpdate,
)
from .exceptions import (
    RateLimitAlreadyExistsException,
    RateLimitNotFoundException,
    TierAlreadyExistsException,
    TierNotFoundException,
)
from .models import RateLimit, Tier

router = APIRouter()


# Tier routes
@router.get("/tiers", response_model=list[TierRead])
async def get_tiers(uow: UnitOfWorkDep):
    repo = TierRepository(uow)
    tiers = await repo.get_all()
    return [TierRead(id=tier.id, name=tier.name, created_at=tier.created_at) for tier in tiers]


@router.get("/tiers/{tier_id}", response_model=TierRead)
async def get_tier(
    tier_id: int,
    uow: UnitOfWorkDep,
):
    repo = TierRepository(uow)
    tier = await repo.get_by_id(tier_id)
    if not tier:
        raise TierNotFoundException(tier_id=tier_id)
    return TierRead(id=tier.id, name=tier.name, created_at=tier.created_at)


@router.post("/tiers", response_model=TierRead, status_code=status.HTTP_201_CREATED)
async def create_tier(
    tier_data: TierCreate,
    uow: UnitOfWorkDep,
):
    repo = TierRepository(uow)

    existing_tier = await repo.get_by_name(tier_data.name)
    if existing_tier:
        raise TierAlreadyExistsException(tier_data.name)

    new_tier = Tier(name=tier_data.name)
    new_tier = await repo.add(new_tier)

    return TierRead(id=new_tier.id, name=new_tier.name, created_at=new_tier.created_at)


@router.put("/tiers/{tier_id}", response_model=TierRead)
async def update_tier(
    tier_id: int,
    tier_data: TierUpdate,
    uow: UnitOfWorkDep,
):
    repo = TierRepository(uow)
    tier = await repo.get_by_id(tier_id)
    if not tier:
        raise TierNotFoundException(tier_id=tier_id)

    if tier_data.name is not None:
        existing_tier = await repo.get_by_name(tier_data.name)
        if existing_tier and existing_tier.id != tier_id:
            raise TierAlreadyExistsException(tier_data.name)
        tier.name = tier_data.name

    tier.updated_at = datetime.now(UTC)
    await repo.update(tier)

    return TierRead(id=tier.id, name=tier.name, created_at=tier.created_at)


@router.delete("/tiers/{tier_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tier(
    tier_id: int,
    uow: UnitOfWorkDep,
):
    repo = TierRepository(uow)
    tier = await repo.get_by_id(tier_id)
    if not tier:
        raise TierNotFoundException(tier_id=tier_id)
    await repo.delete(tier)


# Rate Limit routes
@router.get("/rate-limits", response_model=list[RateLimitRead])
async def get_rate_limits(
    uow: UnitOfWorkDep,
):
    repo = RateLimitRepository(uow)
    rate_limits = await repo.get_all()
    return [
        RateLimitRead(
            id=rl.id,
            tier_target_id=rl.tier_target_id,
            name=rl.name,
            path=rl.path,
            limit=rl.limit,
            period=rl.period,
        )
        for rl in rate_limits
    ]


@router.get("/rate-limits/{rate_limit_id}", response_model=RateLimitRead)
async def get_rate_limit(
    rate_limit_id: int,
    uow: UnitOfWorkDep,
):
    repo = RateLimitRepository(uow)
    rate_limit = await repo.get_by_id(rate_limit_id)
    if not rate_limit:
        raise RateLimitNotFoundException()
    return RateLimitRead(
        id=rate_limit.id,
        tier_target_id=rate_limit.tier_target_id,
        name=rate_limit.name,
        path=rate_limit.path,
        limit=rate_limit.limit,
        period=rate_limit.period,
    )


@router.post("/rate-limits", response_model=RateLimitRead, status_code=status.HTTP_201_CREATED)
async def create_rate_limit(
    rate_limit_data: RateLimitCreate,
    tier_target_id: int,
    uow: UnitOfWorkDep,
):
    repo = RateLimitRepository(uow)
    existing_rate_limit = await repo.get_by_tier_target_and_path(tier_target_id, rate_limit_data.path)
    if existing_rate_limit:
        raise RateLimitAlreadyExistsException(tier_target_id, rate_limit_data.path)

    new_rate_limit = RateLimit(**rate_limit_data.model_dump(), tier_target_id=tier_target_id)
    new_rate_limit = await repo.add(new_rate_limit)

    return RateLimitRead(
        id=new_rate_limit.id,
        tier_target_id=new_rate_limit.tier_target_id,
        name=new_rate_limit.name,
        path=new_rate_limit.path,
        limit=new_rate_limit.limit,
        period=new_rate_limit.period,
    )


@router.put("/rate-limits/{rate_limit_id}", response_model=RateLimitRead)
async def update_rate_limit(
    rate_limit_id: int,
    rate_limit_data: RateLimitUpdate,
    uow: UnitOfWorkDep,
):
    repo = RateLimitRepository(uow)
    rate_limit = await repo.get_by_id(rate_limit_id)
    if not rate_limit:
        raise RateLimitNotFoundException()

    if rate_limit_data.path is not None:
        existing_rate_limit = await repo.get_by_tier_target_and_path(rate_limit.tier_target_id, rate_limit_data.path)
        if existing_rate_limit and existing_rate_limit.id != rate_limit_id:
            raise RateLimitAlreadyExistsException(rate_limit.tier_target_id, rate_limit_data.path)
        rate_limit.path = rate_limit_data.path

    if rate_limit_data.limit is not None:
        rate_limit.limit = rate_limit_data.limit

    if rate_limit_data.period is not None:
        rate_limit.period = rate_limit_data.period

    if rate_limit_data.name is not None:
        rate_limit.name = rate_limit_data.name

    rate_limit.updated_at = datetime.now(UTC)
    await repo.update(rate_limit)

    return RateLimitRead(
        id=rate_limit.id,
        tier_target_id=rate_limit.tier_target_id,
        name=rate_limit.name,
        path=rate_limit.path,
        limit=rate_limit.limit,
        period=rate_limit.period,
    )


@router.delete("/rate-limits/{rate_limit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_rate_limit(
    rate_limit_id: int,
    uow: UnitOfWorkDep,
):
    repo = RateLimitRepository(uow)
    rate_limit = await repo.get_by_id(rate_limit_id)
    if not rate_limit:
        raise RateLimitNotFoundException()
    await repo.delete(rate_limit)
