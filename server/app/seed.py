"""Seed PostgreSQL with mock data from existing data files."""

from __future__ import annotations

import asyncio
import logging

from app.database import async_session_factory, init_db
from app.repository import upsert_module

logger = logging.getLogger(__name__)


def _serialize(obj: object) -> object:
    """Recursively convert Pydantic models and other objects to JSON-safe dicts."""
    if hasattr(obj, "model_dump"):
        return obj.model_dump()
    if isinstance(obj, dict):
        return {k: _serialize(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [_serialize(item) for item in obj]
    return obj


async def seed_all() -> None:
    """Load mock data from all 9 modules into PostgreSQL."""
    # Lazy imports to avoid circular dependencies at module level
    from app.data.truth_lens_data import get_full_dashboard as tl_dash
    from app.data.productivity_hub_data import get_full_dashboard as ph_dash
    from app.data.debt_radar_data import get_full_dashboard as dr_dash
    from app.data.dev_profiles_data import get_full_dashboard as dp_dash
    from app.data.trust_engine_data import get_full_dashboard as te_dash
    from app.data.leadership_data import get_full_dashboard as ld_dash
    from app.data.knowledge_vault_data import get_full_dashboard as kv_dash
    from app.data.toolchain_radar_data import get_full_dashboard as tr_dash
    from app.data.org_cascade_data import get_full_dashboard as oc_dash

    modules: dict[str, object] = {
        "truth_lens": tl_dash(),
        "productivity_hub": ph_dash(),
        "debt_radar": dr_dash(),
        "dev_profiles": dp_dash(),
        "trust_engine": te_dash(),
        "leadership": ld_dash(),
        "knowledge_vault": kv_dash(),
        "toolchain_radar": tr_dash(),
        "org_cascade": oc_dash(),
    }

    await init_db()

    async with async_session_factory() as db:
        for module_name, raw_data in modules.items():
            data = _serialize(raw_data)
            if not isinstance(data, dict):
                logger.warning("Module %s returned non-dict, wrapping.", module_name)
                data = {"_root": data}
            await upsert_module(db, module_name, data)
            logger.info("Seeded module: %s", module_name)

    logger.info("All %d modules seeded.", len(modules))


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(seed_all())
