```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Attendance
from app.security.auth import get_current_user


router = APIRouter(
    prefix="/ai",
    tags=["AI Assistant"]
)


@router.post("/ask")
def ask_ai(
    message: str,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user)
):

    # ---------------------------------
    # Get logged-in user
    # ---------------------------------

    user = db.query(User).filter(
        User.id == current_user_id
    ).first()

    if not user:
        return {
            "response": "User account not found."
        }

    message_lower = message.lower().strip()


    # ---------------------------------
    # Student attendance
    # ---------------------------------

    if "attendance" in message_lower:

        # Attendance is currently available
        # only for students
        if user.role != "student":
            return {
                "response": (
                    "Attendance information is "
                    "currently available for students."
                )
            }

        # Get student's attendance records
        records = db.query(Attendance).filter(
            Attendance.student_id == current_user_id
        ).all()

        # No attendance records
        if not records:
            return {
                "response": (
                    "You currently have no attendance "
                    "records."
                )
            }

        # Calculate attendance
        total_days = len(records)

        present_days = sum(
            1
            for record in records
            if record.status.lower() == "present"
        )

        absent_days = total_days - present_days

        percentage = (
            present_days / total_days
        ) * 100


        # ---------------------------------
        # Attendance improvement advice
        # ---------------------------------

        if any(
            word in message_lower
            for word in [
                "improve",
                "increase",
                "better",
                "improving",
                "low",
                "raise"
            ]
        ):

            if percentage >= 90:

                advice = (
                    "Your attendance is excellent. "
                    "Keep maintaining this consistency "
                    "and avoid unnecessary absences."
                )

            elif percentage >= 75:

                advice = (
                    "Your attendance is good, but there "
                    "is still room for improvement. Try "
                    "to attend classes consistently and "
                    "avoid unnecessary absences."
                )

            elif percentage >= 60:

                advice = (
                    "Your attendance needs improvement. "
                    "Try to attend classes regularly, "
                    "avoid unnecessary absences, and "
                    "catch up on any missed lessons."
                )

            else:

                advice = (
                    "Your attendance is quite low and "
                    "needs immediate attention. Prioritize "
                    "regular class attendance, avoid "
                    "unnecessary absences, and catch up "
                    "on missed lessons as soon as possible."
                )


            return {
                "response": (
                    f"Your current attendance is "
                    f"{percentage:.1f}%. "
                    f"You were present for "
                    f"{present_days} out of "
                    f"{total_days} days.\n\n"
                    f"{advice}"
                )
            }


        # ---------------------------------
        # Normal attendance question
        # ---------------------------------

        return {
            "response": (
                f"Your current attendance is "
                f"{percentage:.1f}%. "
                f"You were present for "
                f"{present_days} out of "
                f"{total_days} days and absent for "
                f"{absent_days} days."
            )
        }


    # ---------------------------------
    # Study tips
    # ---------------------------------

    if (
        "study" in message_lower
        or "studying" in message_lower
        or "learn" in message_lower
    ):

        return {
            "response": (
                "Here are some useful study tips:\n\n"
                "• Create a daily study schedule.\n"
                "• Use active recall to test your memory.\n"
                "• Revise your lessons regularly.\n"
                "• Practice questions instead of only reading.\n"
                "• Take short breaks to stay focused.\n"
                "• Review difficult topics more frequently."
            )
        }


    # ---------------------------------
    # Greeting
    # ---------------------------------

    if any(
        word in message_lower
        for word in ["hello", "hi", "hey"]
    ):

        return {
            "response": (
                f"Hello {user.name}! "
                "I'm your XYZ AI School Assistant. "
                "How can I help you?"
            )
        }


    # ---------------------------------
    # Default response
    # ---------------------------------

    return {
        "response": (
            "I'm your XYZ AI School Assistant. "
            "I can currently help you with "
            "attendance information and study tips. "
            "Try asking me about your attendance "
            "or how you can improve it."
        )
    }
```
