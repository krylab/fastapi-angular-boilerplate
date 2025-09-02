from datetime import UTC, datetime
from typing import Any

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ...infra.orm.base_model import Base


class Tier(Base):
    __tablename__ = "tiers"

    id: Mapped[int] = mapped_column(autoincrement=True, nullable=False, unique=True, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), default=None)

    def __init__(self, **kwargs: Any):
        if "created_at" not in kwargs:
            kwargs["created_at"] = datetime.now(UTC)
        super().__init__(**kwargs)

    # Relationships
    tier_targets: Mapped[list["TierTarget"]] = relationship("TierTarget", lazy="select", back_populates="tier")


class TierTarget(Base):
    __tablename__ = "tier_targets"

    id: Mapped[int] = mapped_column(autoincrement=True, nullable=False, unique=True, primary_key=True)
    tier_id: Mapped[int] = mapped_column(ForeignKey("tiers.id"), index=True)
    target_type: Mapped[str] = mapped_column(String(1), nullable=False)  # U=User, A=App, T=Tenant, etc.
    target_id: Mapped[str] = mapped_column(String, nullable=False)  # UUID or string identifier for the target
    name: Mapped[str | None] = mapped_column(String, nullable=True)  # Optional descriptive name
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), default=None)

    def __init__(self, **kwargs: Any):
        if "created_at" not in kwargs:
            kwargs["created_at"] = datetime.now(UTC)
        super().__init__(**kwargs)

    # Relationships
    tier: Mapped[Tier] = relationship("Tier", back_populates="tier_targets")
    rate_limits: Mapped[list["RateLimit"]] = relationship("RateLimit", back_populates="tier_target")

    class Meta:
        indexes = [
            ("target_type", "target_id"),  # Composite index for efficient lookups
            ("tier_id", "target_type"),  # Index for tier-based queries
        ]


class RateLimit(Base):
    __tablename__ = "rate_limits"

    id: Mapped[int] = mapped_column(autoincrement=True, nullable=False, unique=True, primary_key=True)
    tier_target_id: Mapped[int] = mapped_column(ForeignKey("tier_targets.id"), index=True)
    name: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    path: Mapped[str] = mapped_column(String, nullable=False)
    limit: Mapped[int] = mapped_column(Integer, nullable=False)
    period: Mapped[int] = mapped_column(Integer, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), default=None)

    def __init__(self, **kwargs: Any):
        if "created_at" not in kwargs:
            kwargs["created_at"] = datetime.now(UTC)
        super().__init__(**kwargs)

    # Relationships
    tier_target: Mapped[TierTarget] = relationship("TierTarget", back_populates="rate_limits")

    class Meta:
        indexes = [
            ("tier_target_id", "path"),
        ]
