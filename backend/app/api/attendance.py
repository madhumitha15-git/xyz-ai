
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Attendance, User, StudentParent
from app.schemas import AttendanceCreate, AttendanceResponse
from app.security.auth import get_current_user


router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)


@router.post("/", response_model=AttendanceResponse)
def mark_attendance(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db)
):
    student = db.query(User).filter(
        User.id == attendance.student_id,
        User.role == "student"
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    record = Attendance(
        student_id=attendance.student_id,
        attendance_date=attendance.attendance_date,
        status=attendance.status
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


@router.get("/student/{student_id}")
def get_student_attendance(
    student_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user)
):
    # Student can only view their own attendance
    if current_user_id != student_id:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to view this student's attendance"
        )

    student = db.query(User).filter(
        User.id == student_id,
        User.role == "student"
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    records = db.query(Attendance).filter(
        Attendance.student_id == student_id
    ).all()

    if not records:
        return {
            "student_id": student_id,
            "attendance_percentage": 0,
            "total_days": 0,
            "present_days": 0
        }

    total_days = len(records)

    present_days = sum(
        1
        for record in records
        if record.status.lower() == "present"
    )

    percentage = (present_days / total_days) * 100

    return {
        "student_id": student_id,
        "attendance_percentage": round(percentage, 2),
        "total_days": total_days,
        "present_days": present_days
    }


@router.get("/parent/{parent_id}/child/{student_id}")
def get_child_attendance(
    parent_id: int,
    student_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user)
):
    # ---------------------------------
    # Verify logged-in user is the parent
    # ---------------------------------

    if current_user_id != parent_id:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to access this parent's data"
        )

    # ---------------------------------
    # Verify parent exists
    # ---------------------------------

    parent = db.query(User).filter(
        User.id == parent_id,
        User.role == "parent"
    ).first()

    if not parent:
        raise HTTPException(
            status_code=404,
            detail="Parent not found"
        )

    # ---------------------------------
    # Verify parent-child relationship
    # ---------------------------------

    relationship = db.query(StudentParent).filter(
        StudentParent.parent_id == parent_id,
        StudentParent.student_id == student_id
    ).first()

    if not relationship:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to view this student's attendance"
        )

    # ---------------------------------
    # Get attendance
    # ---------------------------------

    records = db.query(Attendance).filter(
        Attendance.student_id == student_id
    ).all()

    if not records:
        return {
            "student_id": student_id,
            "attendance_percentage": 0,
            "total_days": 0,
            "present_days": 0
        }

    total_days = len(records)

    present_days = sum(
        1
        for record in records
        if record.status.lower() == "present"
    )

    percentage = (
        present_days / total_days
    ) * 100

    return {
        "student_id": student_id,
        "attendance_percentage": round(percentage, 2),
        "total_days": total_days,
        "present_days": present_days
    }