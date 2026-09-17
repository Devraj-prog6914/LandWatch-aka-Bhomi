from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import UserRole


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole
    email: str
    full_name: str
    state: Optional[str] = None
    district: Optional[str] = None


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[UserRole] = None


class UserLogin(BaseModel):
    email: str
    password: str


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole = UserRole.VIEWER
    state: Optional[str] = None
    district: Optional[str] = None
    designation: Optional[str] = None


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: UserRole
    state: Optional[str] = None
    district: Optional[str] = None
    designation: Optional[str] = None

    class Config:
        from_attributes = True
