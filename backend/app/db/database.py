from app.core.container import container

async_engine = container.async_engine()
AsyncSessionLocal = container.async_session_factory()
