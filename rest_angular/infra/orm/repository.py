from abc import ABC, abstractmethod
from typing import Any, Generic, Optional, Protocol, Type, TypeVar

from sqlalchemy import Executable, Result, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from .uow import UnitOfWork

TEntity = TypeVar("TEntity")


class AbstractRepository(ABC, Generic[TEntity]):
    @abstractmethod
    async def add(self, entity: TEntity) -> TEntity: ...

    @abstractmethod
    async def update(self, entity: TEntity) -> None: ...

    @abstractmethod
    async def delete(self, entity: TEntity) -> None: ...

    @abstractmethod
    async def get_by_id(self, entity_id: int, eager_load: Optional[list[str]] = None) -> TEntity | None: ...

    @abstractmethod
    async def get_all(self, eager_load: Optional[list[str]] = None) -> list[TEntity]: ...


IDType = TypeVar("IDType", bound=int | str)


class HasId(Protocol[IDType]):
    id: IDType


THasIdEntity = TypeVar("THasIdEntity", bound=HasId[Any])


class BaseRepository(AbstractRepository[THasIdEntity], Generic[THasIdEntity, IDType]):
    def __init__(self, model_class: Type[THasIdEntity], uow: UnitOfWork) -> None:
        self._model_class = model_class
        self._uow = uow

    @property
    def session(self) -> AsyncSession:
        if not self._uow.session:
            raise RuntimeError("Session is not initialized")
        return self._uow.session

    async def _execute(self, stmt: Executable) -> Result[Any]:
        return await self._uow.wait_for(self.session.execute(stmt))

    def _apply_eager_loading(self, stmt: Executable, eager_load: Optional[list[str]] = None) -> Executable:
        """Apply eager loading options to the select statement."""
        if not eager_load:
            return stmt

        for rel_name in eager_load:
            if hasattr(self._model_class, rel_name):
                stmt = stmt.options(selectinload(getattr(self._model_class, rel_name)))

        return stmt

    async def add(self, entity: THasIdEntity) -> THasIdEntity:
        await self._uow.check_cancelled()
        self.session.add(entity)
        await self.session.flush()
        await self.session.refresh(entity)
        return entity

    async def update(self, entity: THasIdEntity) -> None:
        await self._uow.check_cancelled()
        await self.session.merge(entity)
        await self.session.flush()

    async def delete(self, entity: THasIdEntity) -> None:
        await self._uow.check_cancelled()
        await self.session.delete(entity)

    async def get_by_id(self, entity_id: IDType, eager_load: Optional[list[str]] = None) -> THasIdEntity | None:
        await self._uow.check_cancelled()
        stmt = select(self._model_class).where(self._model_class.id == entity_id)
        stmt = self._apply_eager_loading(stmt, eager_load)
        result = await self._execute(stmt)
        await self._uow.check_cancelled()
        return result.scalar_one_or_none()

    async def get_all(self, eager_load: Optional[list[str]] = None) -> list[THasIdEntity]:
        await self._uow.check_cancelled()
        stmt = select(self._model_class)
        stmt = self._apply_eager_loading(stmt, eager_load)
        result = await self._execute(stmt)
        await self._uow.check_cancelled()
        return list(result.scalars().all())
