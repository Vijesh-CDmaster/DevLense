"""Auth router — register, login, and current-user endpoints for Developer."""

from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.db_models import DeveloperUser
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


# ── Request / Response schemas ──────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    token: str
    user: dict


class UserOut(BaseModel):
    id: str
    name: str
    email: str


# ── Endpoints ───────────────────────────────────────────────────────

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Check if email already taken
    existing = await db.execute(select(DeveloperUser).where(DeveloperUser.email == body.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = DeveloperUser(
        name=body.name,
        email=body.email,
        password_hash=hash_password(body.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token(str(user.id), user.email)
    return {"token": token, "user": {"id": str(user.id), "name": user.name, "email": user.email}}


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DeveloperUser).where(DeveloperUser.email == body.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(str(user.id), user.email)
    return {"token": token, "user": {"id": str(user.id), "name": user.name, "email": user.email}}


@router.get("/me", response_model=UserOut)
async def me(current_user: DeveloperUser = Depends(get_current_user)):
    return {"id": str(current_user.id), "name": current_user.name, "email": current_user.email}
