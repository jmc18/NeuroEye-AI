"""Dev server entry point — sets Windows event loop policy before uvicorn starts."""

from __future__ import annotations

import argparse
import asyncio
import sys


def _configure_async_runtime() -> None:
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())


def main() -> None:
    _configure_async_runtime()

    parser = argparse.ArgumentParser(description="NeuroEyeAI API server")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--reload", action="store_true")
    args = parser.parse_args()

    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=args.host,
        port=args.port,
        reload=args.reload,
    )


if __name__ == "__main__":
    main()
