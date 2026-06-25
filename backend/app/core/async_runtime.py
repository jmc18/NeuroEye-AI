import asyncio
import sys
from collections.abc import Coroutine
from typing import Any


def configure_async_runtime() -> None:
    """Use SelectorEventLoop on Windows — required by psycopg async."""
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())


def run_async(coro: Coroutine[Any, Any, Any]) -> Any:
    if sys.platform == "win32":
        return asyncio.run(coro, loop_factory=asyncio.SelectorEventLoop)
    return asyncio.run(coro)


# Must run before uvicorn (or any asyncio.run) creates the default Proactor loop.
configure_async_runtime()
