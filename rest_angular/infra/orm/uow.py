import asyncio
from types import TracebackType
from typing import Annotated, Any, AsyncGenerator, Coroutine, TypeVar

from fastapi import Depends, Request
from lelab_common import CancellationContext, CancellationContextDep
from sqlalchemy.ext.asyncio import AsyncSession

from .sa import AsyncSessionFactory

T = TypeVar("T")


class UnitOfWork:
    def __init__(self, session_factory: AsyncSessionFactory, cancellation_context: CancellationContextDep) -> None:
        self._session_factory: AsyncSessionFactory = session_factory
        self._context: CancellationContext = cancellation_context
        self.session: AsyncSession | None = None

    async def __aenter__(self) -> "UnitOfWork":
        self.session = self._session_factory()
        return self

    async def __aexit__(
        self, exc_type: type[BaseException] | None, exc: BaseException | None, tb: TracebackType | None
    ) -> None:
        if not self.session:
            return
        if exc:
            await self.session.rollback()
        else:
            await self.session.commit()
        await self.session.close()

    async def check_cancelled(self) -> None:
        await self._context.throw_if_cancelled()

    async def wait_for(self, coro: Coroutine[Any, Any, T], timeout: float | None = None) -> T:
        return await self._context.wait_for(coro, timeout)


async def get_unit_of_work(
    request: Request, session_factory: AsyncSessionFactory, cancellation_context: CancellationContextDep
) -> AsyncGenerator[UnitOfWork, None]:
    """Get unit of work for specific request with request disconnect monitoring"""
    uow: UnitOfWork | None = None
    if hasattr(request.state, "unit_of_work"):
        uow = request.state.unit_of_work

    uow = UnitOfWork(session_factory, cancellation_context)
    request.state.unit_of_work = uow

    async with uow:
        yield uow


UnitOfWorkDep = Annotated[UnitOfWork, Depends(get_unit_of_work)]
