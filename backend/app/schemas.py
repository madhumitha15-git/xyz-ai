from pydantic import BaseModel
from datetime import date


class UserCreate(BaseModel):
    name: str
    email: str
    role: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True

class AttendanceCreate(BaseModel):
    student_id: int
    attendance_date: date
    status: str


class AttendanceResponse(BaseModel):
    id: int
    student_id: int
    attendance_date: date
    status: str

    class Config:
        from_attributes = True