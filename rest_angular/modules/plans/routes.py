from datetime import UTC, datetime

from fastapi import APIRouter, status

from .exceptions import (
    RateLimitAlreadyExistsException,
    RateLimitNotFoundException,
    TierAlreadyExistsException,
    TierNotFoundException,
    TierTargetAlreadyExistsException,
    TierTargetNotFoundException,
)
from .models import RateLimit, Tier, TierTarget
from .repository import RateLimitRepositoryDep, TierRepositoryDep, TierTargetRepositoryDep
from .schemas import (
    RateLimitCreate,
    RateLimitRead,
    RateLimitUpdate,
    TierCreate,
    TierRead,
    TierTargetCreate,
    TierTargetRead,
    TierTargetUpdate,
    TierUpdate,
)

router = APIRouter(prefix="/plans", tags=["plans"])


# Tier routes
@router.get("/tiers", response_model=list[TierRead], name="get_tiers")
async def get_tiers(repo: TierRepositoryDep):
    tiers = await repo.get_all()
    return [TierRead(id=tier.id, name=tier.name, created_at=tier.created_at) for tier in tiers]


@router.get("/tiers/{tier_id}", response_model=TierRead, name="get_tier")
async def get_tier(
    tier_id: int,
    repo: TierRepositoryDep,
):
    tier = await repo.get_by_id(tier_id)
    if not tier:
        raise TierNotFoundException(tier_id=tier_id)
    return TierRead(id=tier.id, name=tier.name, created_at=tier.created_at)


@router.post("/tiers", response_model=TierRead, status_code=status.HTTP_201_CREATED, name="create_tier")
async def create_tier(
    tier_data: TierCreate,
    repo: TierRepositoryDep,
):
    existing_tier = await repo.get_by_name(tier_data.name)
    if existing_tier:
        raise TierAlreadyExistsException(tier_data.name)

    new_tier = Tier(name=tier_data.name)
    new_tier = await repo.add(new_tier, flush=True)

    return TierRead(id=new_tier.id, name=new_tier.name, created_at=new_tier.created_at)


@router.put("/tiers/{tier_id}", response_model=TierRead, name="update_tier")
async def update_tier(
    tier_id: int,
    tier_data: TierUpdate,
    repo: TierRepositoryDep,
):
    tier = await repo.get_by_id(tier_id)
    if not tier:
        raise TierNotFoundException(tier_id=tier_id)

    if tier_data.name is not None:
        existing_tier = await repo.get_by_name(tier_data.name)
        if existing_tier and existing_tier.id != tier_id:
            raise TierAlreadyExistsException(tier_data.name)
        tier.name = tier_data.name

    tier.updated_at = datetime.now(UTC)
    await repo.update(tier, flush=True)

    return TierRead(id=tier.id, name=tier.name, created_at=tier.created_at)


@router.delete("/tiers/{tier_id}", status_code=status.HTTP_204_NO_CONTENT, name="delete_tier")
async def delete_tier(
    tier_id: int,
    repo: TierRepositoryDep,
):
    tier = await repo.get_by_id(tier_id)
    if not tier:
        raise TierNotFoundException(tier_id=tier_id)
    await repo.delete(tier)


# Tier Target routes
@router.get("/tier-targets", response_model=list[TierTargetRead], name="get_tier_targets")
async def get_tier_targets(
    repo: TierTargetRepositoryDep,
):
    tier_targets = await repo.get_all()
    return [
        TierTargetRead(
            id=tt.id,
            tier_id=tt.tier_id,
            target_type=tt.target_type,
            target_id=tt.target_id,
            name=tt.name,
            is_active=tt.is_active,
            created_at=tt.created_at,
        )
        for tt in tier_targets
    ]


@router.get("/tier-targets/{tier_target_id}", response_model=TierTargetRead, name="get_tier_target")
async def get_tier_target(
    tier_target_id: int,
    repo: TierTargetRepositoryDep,
):
    tier_target = await repo.get_by_id(tier_target_id)
    if not tier_target:
        raise TierTargetNotFoundException()
    return TierTargetRead(
        id=tier_target.id,
        tier_id=tier_target.tier_id,
        target_type=tier_target.target_type,
        target_id=tier_target.target_id,
        name=tier_target.name,
        is_active=tier_target.is_active,
        created_at=tier_target.created_at,
    )


@router.post(
    "/tier-targets", response_model=TierTargetRead, status_code=status.HTTP_201_CREATED, name="create_tier_target"
)
async def create_tier_target(
    tier_target_data: TierTargetCreate,
    tier_id: int,
    repo: TierTargetRepositoryDep,
):
    # Check if tier target already exists
    existing_tier_target = await repo.get_by_target(tier_target_data.target_type, tier_target_data.target_id)
    if existing_tier_target:
        raise TierTargetAlreadyExistsException(tier_target_data.target_type, tier_target_data.target_id)

    new_tier_target = TierTarget(**tier_target_data.model_dump(), tier_id=tier_id)
    new_tier_target = await repo.add(new_tier_target, flush=True)

    return TierTargetRead(
        id=new_tier_target.id,
        tier_id=new_tier_target.tier_id,
        target_type=new_tier_target.target_type,
        target_id=new_tier_target.target_id,
        name=new_tier_target.name,
        is_active=new_tier_target.is_active,
        created_at=new_tier_target.created_at,
    )


@router.put("/tier-targets/{tier_target_id}", response_model=TierTargetRead, name="update_tier_target")
async def update_tier_target(
    tier_target_id: int,
    tier_target_data: TierTargetUpdate,
    repo: TierTargetRepositoryDep,
):
    tier_target = await repo.get_by_id(tier_target_id)
    if not tier_target:
        raise TierTargetNotFoundException()

    # Check for duplicate target_type/target_id combination
    if tier_target_data.target_type is not None or tier_target_data.target_id is not None:
        check_target_type = tier_target_data.target_type or tier_target.target_type
        check_target_id = tier_target_data.target_id or tier_target.target_id
        existing_tier_target = await repo.get_by_target(check_target_type, check_target_id)
        if existing_tier_target and existing_tier_target.id != tier_target_id:
            raise TierTargetAlreadyExistsException(check_target_type, check_target_id)

    if tier_target_data.target_type is not None:
        tier_target.target_type = tier_target_data.target_type

    if tier_target_data.target_id is not None:
        tier_target.target_id = tier_target_data.target_id

    if tier_target_data.name is not None:
        tier_target.name = tier_target_data.name

    if tier_target_data.is_active is not None:
        tier_target.is_active = tier_target_data.is_active

    tier_target.updated_at = datetime.now(UTC)
    await repo.update(tier_target, flush=True)

    return TierTargetRead(
        id=tier_target.id,
        tier_id=tier_target.tier_id,
        target_type=tier_target.target_type,
        target_id=tier_target.target_id,
        name=tier_target.name,
        is_active=tier_target.is_active,
        created_at=tier_target.created_at,
    )


@router.delete("/tier-targets/{tier_target_id}", status_code=status.HTTP_204_NO_CONTENT, name="delete_tier_target")
async def delete_tier_target(
    tier_target_id: int,
    repo: TierTargetRepositoryDep,
):
    tier_target = await repo.get_by_id(tier_target_id)
    if not tier_target:
        raise TierTargetNotFoundException()
    await repo.delete(tier_target)


# Rate Limit routes
@router.get("/rate-limits", response_model=list[RateLimitRead], name="get_rate_limits")
async def get_rate_limits(
    repo: RateLimitRepositoryDep,
):
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


@router.get("/rate-limits/{rate_limit_id}", response_model=RateLimitRead, name="get_rate_limit")
async def get_rate_limit(
    rate_limit_id: int,
    repo: RateLimitRepositoryDep,
):
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


@router.post(
    "/rate-limits", response_model=RateLimitRead, status_code=status.HTTP_201_CREATED, name="create_rate_limit"
)
async def create_rate_limit(
    rate_limit_data: RateLimitCreate,
    tier_target_id: int,
    repo: RateLimitRepositoryDep,
):
    existing_rate_limit = await repo.get_by_tier_target_and_path(tier_target_id, rate_limit_data.path)
    if existing_rate_limit:
        raise RateLimitAlreadyExistsException(tier_target_id, rate_limit_data.path)

    new_rate_limit = RateLimit(**rate_limit_data.model_dump(), tier_target_id=tier_target_id)
    new_rate_limit = await repo.add(new_rate_limit, flush=True)

    return RateLimitRead(
        id=new_rate_limit.id,
        tier_target_id=new_rate_limit.tier_target_id,
        name=new_rate_limit.name,
        path=new_rate_limit.path,
        limit=new_rate_limit.limit,
        period=new_rate_limit.period,
    )


@router.put("/rate-limits/{rate_limit_id}", response_model=RateLimitRead, name="update_rate_limit")
async def update_rate_limit(
    rate_limit_id: int,
    rate_limit_data: RateLimitUpdate,
    repo: RateLimitRepositoryDep,
):
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
    await repo.update(rate_limit, flush=True)

    return RateLimitRead(
        id=rate_limit.id,
        tier_target_id=rate_limit.tier_target_id,
        name=rate_limit.name,
        path=rate_limit.path,
        limit=rate_limit.limit,
        period=rate_limit.period,
    )


@router.delete("/rate-limits/{rate_limit_id}", status_code=status.HTTP_204_NO_CONTENT, name="delete_rate_limit")
async def delete_rate_limit(
    rate_limit_id: int,
    repo: RateLimitRepositoryDep,
):
    rate_limit = await repo.get_by_id(rate_limit_id)
    if not rate_limit:
        raise RateLimitNotFoundException()
    await repo.delete(rate_limit)
