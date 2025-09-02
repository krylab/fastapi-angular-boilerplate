import asyncio
from typing import Annotated, Any, Coroutine, TypeVar

from fastapi import Depends, Request

T = TypeVar("T")


class CancellationContext:
    def __init__(self) -> None:
        self._cancel_event: asyncio.Event = asyncio.Event()

    def cancel(self) -> None:
        self._cancel_event.set()

    async def throw_if_cancelled(self) -> None:
        if self._cancel_event.is_set():
            raise asyncio.CancelledError()

    async def wait_for(self, coro: Coroutine[Any, Any, T], timeout: float | None = None) -> T:
        task: asyncio.Task[T] = asyncio.create_task(coro)
        cancel_task: asyncio.Task[bool] = asyncio.create_task(self._cancel_event.wait())

        done: set[asyncio.Task[Any]]
        pending: set[asyncio.Task[Any]]

        done, pending = await asyncio.wait({task, cancel_task}, return_when=asyncio.FIRST_COMPLETED, timeout=timeout)

        if cancel_task in done:
            task.cancel()
            raise asyncio.CancelledError()

        if task in done:
            return task.result()

        for t in pending:
            t.cancel()
        raise asyncio.TimeoutError("Operation timed out")


async def get_cancellation_context(request: Request) -> CancellationContext:
    """Creates or retrieves CancellationContext for specific request with request disconnect monitoring"""
    if hasattr(request.state, "cancellation_context"):
        return request.state.cancellation_context

    context = CancellationContext()

    request.state.cancellation_context = context

    async def monitor_disconnect() -> None:
        while not await request.is_disconnected():
            await asyncio.sleep(0.1)
        context.cancel()

    asyncio.create_task(monitor_disconnect())

    return context


CancellationContextDep = Annotated[CancellationContext, Depends(get_cancellation_context)]
