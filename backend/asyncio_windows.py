"""Applied via PYTHONSTARTUP before any asyncio loop is created (Windows + psycopg async)."""

import asyncio
import sys

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
