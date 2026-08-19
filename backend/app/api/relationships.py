from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, StudentParent
from app.security.auth import get_current_user


router = APIRouter(
    prefix="/relationships",
    tags=["Relationships"]
)


@router.post("/parent/{parent_id}/student/{student_id}")
def link_parent_to_student(
    parent_id: int,
    student_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user)
):
    if current_user_id != parent_id:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized"
        )

    parent = db.query(User).filter(
        User.id == parent_id,
        User.role == "parent"
    ).first()

    if not parent:
        raise HTTPException(
            status_code=404,
            detail="Parent not found"
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

    existing = db.query(StudentParent).filter(
        StudentParent.parent_id == parent_id,
        StudentParent.student_id == student_id
    ).first()

    if existing:
        return {
            "message": "Relationship already exists"
        }

    relationship = StudentParent(
        parent_id=parent_id,
        student_id=student_id
    )

    db.add(relationship)
    db.commit()
    db.refresh(relationship)

    return {
        "message": "Parent linked to student successfully",
        "parent_id": parent_id,
        "student_id": student_id
    }


@router.get("/my-children")
def get_my_children(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user)
):
    parent = db.query(User).filter(
        User.id == current_user_id,
        User.role == "parent"
    ).first()

    if not parent:
        raise HTTPException(
            status_code=403,
            detail="Only parents can access this endpoint"
        )

    relationships = db.query(StudentParent).filter(
        StudentParent.parent_id == current_user_id
    ).all()

    children = []

    for relationship in relationships:
        student = db.query(User).filter(
            User.id == relationship.student_id,
            User.role == "student"
        ).first()

        if student:
            children.append({
                "id": student.id,
                "name": student.name,
                "email": student.email
            })

    return {
        "children": children
    }