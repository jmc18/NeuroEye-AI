import asyncio
import sys
from collections.abc import Coroutine
from typing import Any


def run_async(coro: Coroutine[Any, Any, Any]) -> Any:
    if sys.platform == "win32":
        return asyncio.run(coro, loop_factory=asyncio.SelectorEventLoop)
    return asyncio.run(coro)


def configure_async_runtime() -> None:
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
