from datetime import UTC, datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_serializer, field_validator


def sanitize_path(path: str) -> str:
    return path.strip("/").replace("/", "_")


class TimestampSchema(BaseModel):
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC).replace(tzinfo=None))
    updated_at: datetime | None = Field(default=None)

    @field_serializer("created_at")
    def serialize_dt(self, created_at: datetime | None, _info: Any) -> str | None:
        if created_at is not None:
            return created_at.isoformat()
        return None

    @field_serializer("updated_at")
    def serialize_updated_at(self, updated_at: datetime | None, _info: Any) -> str | None:
        if updated_at is not None:
            return updated_at.isoformat()
        return None


# Tier schemas
class TierBase(BaseModel):
    name: str = Field(examples=["free"])


class TierRead(TierBase):
    id: int
    created_at: datetime


class TierCreate(TierBase):
    pass


class TierCreateInternal(TierCreate):
    pass


class TierUpdate(BaseModel):
    name: str | None = None


class TierUpdateInternal(TierUpdate):
    updated_at: datetime


class TierDelete(BaseModel):
    pass


# TierTarget schemas
class TierTargetBase(BaseModel):
    target_type: str = Field(..., examples=["U", "A", "T"], description="U=User, A=App, T=Tenant")
    target_id: str = Field(..., examples=["user123", "app456", "tenant789"])
    name: str | None = Field(default=None, examples=["Premium User", "Enterprise App", "Corporate Tenant"])
    is_active: bool = Field(default=True)

    @field_validator("target_type")
    def validate_target_type(cls, v: str) -> str:
        valid_types = ["U", "A", "T", "G", "S"]  # User, App, Tenant, Group, Service
        if v not in valid_types:
            raise ValueError(f"target_type must be one of {valid_types}")
        return v


class TierTargetRead(TierTargetBase):
    id: int
    tier_id: int
    created_at: datetime


class TierTargetCreate(TierTargetBase):
    model_config = ConfigDict(extra="forbid")


class TierTargetCreateInternal(TierTargetCreate):
    tier_id: int


class TierTargetUpdate(BaseModel):
    target_type: str | None = None
    target_id: str | None = None
    name: str | None = None
    is_active: bool | None = None

    @field_validator("target_type")
    def validate_target_type(cls, v: str | None) -> str | None:
        if v is not None:
            valid_types = ["U", "A", "T", "G", "S"]
            if v not in valid_types:
                raise ValueError(f"target_type must be one of {valid_types}")
        return v


class TierTargetUpdateInternal(TierTargetUpdate):
    updated_at: datetime


class TierTargetDelete(BaseModel):
    pass


# RateLimit schemas
class RateLimitBase(BaseModel):
    path: str = Field(examples=["users"])
    limit: int = Field(examples=[5])
    period: int = Field(examples=[60])

    @field_validator("path")
    def validate_and_sanitize_path(cls, v: str) -> str:
        return sanitize_path(v)


class RateLimitRead(RateLimitBase):
    id: int
    tier_target_id: int
    name: str


class RateLimitCreate(RateLimitBase):
    model_config = ConfigDict(extra="forbid")
    name: str | None = Field(default=None, examples=["api_v1_users:5:60"])


class RateLimitCreateInternal(RateLimitCreate):
    tier_target_id: int


class RateLimitUpdate(BaseModel):
    path: str | None = Field(default=None)
    limit: int | None = None
    period: int | None = None
    name: str | None = None

    @field_validator("path")
    def validate_and_sanitize_path(cls, v: str | None) -> str | None:
        return sanitize_path(v) if v is not None else None


class RateLimitUpdateInternal(RateLimitUpdate):
    updated_at: datetime


class RateLimitDelete(BaseModel):
    pass
