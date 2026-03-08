"""Data access helpers for reading / writing module data in PostgreSQL."""

from __future__ import annotations

from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db_models import ModuleData


async def get_dashboard(db: AsyncSession, module: str) -> dict:
    """Return the full dashboard dict for a given module."""
    result = await db.execute(
        select(ModuleData.data).where(ModuleData.module == module)
    )
    row = result.scalar_one_or_none()
    return row if row else {}


async def get_data_key(db: AsyncSession, module: str, key: str) -> Any:
    """Return a single top-level key from a module's dashboard JSONB."""
    data = await get_dashboard(db, module)
    return data.get(key)


async def update_data_key(
    db: AsyncSession, module: str, key: str, value: Any
) -> bool:
    """Update a single top-level key inside the module's dashboard JSONB."""
    result = await db.execute(
        select(ModuleData).where(ModuleData.module == module)
    )
    row = result.scalar_one_or_none()
    if not row:
        return False
    row.data = {**row.data, key: value}
    await db.commit()
    return True


async def upsert_module(db: AsyncSession, module: str, data: dict) -> None:
    """Insert or update the full dashboard payload for a module."""
    row = await db.get(ModuleData, module)
    if row:
        row.data = data
    else:
        db.add(ModuleData(module=module, data=data))
    await db.commit()
