"""DevLense — Truth Lens Backend (FastAPI)."""

import logging
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db, close_db
from app.seed import seed_all
from app.routers import truth_lens, productivity_hub, debt_radar, dev_profiles, trust_engine, leadership, knowledge_vault, toolchain_radar, org_cascade, auth

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: create tables & seed data. Shutdown: dispose engine."""
    await init_db()
    await seed_all()
    yield
    await close_db()


app = FastAPI(
    title="DevLense API",
    description="Backend for DevLense Developer Intelligence Platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(truth_lens.router)
app.include_router(productivity_hub.router)
app.include_router(debt_radar.router)
app.include_router(dev_profiles.router)
app.include_router(trust_engine.router)
app.include_router(leadership.router)
app.include_router(knowledge_vault.router)
app.include_router(toolchain_radar.router)
app.include_router(org_cascade.router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "devlense-truth-lens"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=settings.SERVER_PORT, reload=True)
