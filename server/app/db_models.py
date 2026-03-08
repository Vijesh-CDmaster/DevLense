"""SQLAlchemy ORM table definitions."""

import uuid
from datetime import datetime

from sqlalchemy import String, DateTime, JSON, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ModuleData(Base):
    """Stores each module's full dashboard payload as JSON.

    One row per module (9 total). The ``data`` column holds the entire
    dashboard dict so individual router endpoints can extract specific
    keys via Python dict access (fast reads, single query per request).
    """

    __tablename__ = "module_data"

    module: Mapped[str] = mapped_column(String(50), primary_key=True)
    data: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    def __repr__(self) -> str:
        return f"<ModuleData(module={self.module!r})>"


class DeveloperUser(Base):
    """Developer user accounts for authentication."""

    __tablename__ = "developer_users"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    def __repr__(self) -> str:
        return f"<DeveloperUser(email={self.email!r})>"
