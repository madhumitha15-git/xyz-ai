from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Attendance, StudentParent
from app.security.auth import get_current_user
from app.ai_service import ask_llm


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

    # =========================================
    # GET CURRENT USER
    # =========================================

    user = db.query(User).filter(
        User.id == current_user_id
    ).first()

    if not user:
        return {
            "response": "User account not found."
        }

    message_lower = message.lower().strip()

    # =========================================
    # PARENT AI
    # =========================================

    if user.role == "parent":

        relationship = db.query(StudentParent).filter(
            StudentParent.parent_id == current_user_id
        ).first()

        if not relationship:
            return {
                "response": "No child is linked to your account."
            }

        child = db.query(User).filter(
            User.id == relationship.student_id,
            User.role == "student"
        ).first()

        if not child:
            return {
                "response": "Your linked child could not be found."
            }

        # -----------------------------------------
        # CHILD ATTENDANCE
        # -----------------------------------------

        if "attendance" in message_lower:

            records = db.query(Attendance).filter(
                Attendance.student_id == child.id
            ).all()

            if not records:
                return {
                    "response": (
                        f"{child.name} currently has no "
                        "attendance records."
                    )
                }

            total_days = len(records)

            present_days = sum(
                1
                for record in records
                if record.status
                and record.status.lower() == "present"
            )

            absent_days = total_days - present_days

            percentage = (
                present_days / total_days
            ) * 100

            # Attendance improvement question
            if any(
                word in message_lower
                for word in [
                    "improve",
                    "increase",
                    "better",
                    "low",
                    "raise"
                ]
            ):

                if percentage >= 90:
                    advice = (
                        "Their attendance is excellent. "
                        "Keep maintaining this consistency."
                    )

                elif percentage >= 75:
                    advice = (
                        "Their attendance is good, but there "
                        "is still room for improvement."
                    )

                elif percentage >= 60:
                    advice = (
                        "Their attendance needs improvement. "
                        "Encourage regular class attendance."
                    )

                else:
                    advice = (
                        "Their attendance is quite low. "
                        "Regular attendance should be prioritized."
                    )

                return {
                    "response": (
                        f"{child.name}'s current attendance is "
                        f"{percentage:.1f}%. "
                        f"They were present for "
                        f"{present_days} out of {total_days} days.\n\n"
                        f"{advice}"
                    )
                }

            return {
                "response": (
                    f"{child.name}'s current attendance is "
                    f"{percentage:.1f}%. "
                    f"They were present for "
                    f"{present_days} out of {total_days} days "
                    f"and absent for {absent_days} days."
                )
            }

        # -----------------------------------------
        # STUDY QUESTIONS
        # -----------------------------------------

        if (
            "study" in message_lower
            or "studying" in message_lower
            or "learn" in message_lower
            or "exam" in message_lower
            or "prepare" in message_lower
        ):

            return {
                "response": (
                    f"Here are some study suggestions for "
                    f"{child.name}:\n\n"
                    "• Create a daily study schedule.\n"
                    "• Use active recall.\n"
                    "• Revise lessons regularly.\n"
                    "• Practice questions instead of only reading.\n"
                    "• Take short breaks.\n"
                    "• Spend extra time on difficult topics."
                )
            }

        # -----------------------------------------
        # GREETING
        # -----------------------------------------

        if any(
            word in message_lower
            for word in ["hello", "hi", "hey"]
        ):

            return {
                "response": (
                    f"Hello {user.name}! I'm your XYZ AI "
                    f"School Assistant. I can help you "
                    f"monitor {child.name}'s attendance "
                    "and provide study guidance."
                )
            }

        # -----------------------------------------
        # GROQ FOR OTHER PARENT QUESTIONS
        # -----------------------------------------

        try:

            response = ask_llm(
                message=message,
                user_name=user.name,
                role=user.role
            )

            return {
                "response": response
            }

        except Exception as error:

            print("GROQ ERROR:", error)

            return {
                "response": (
                    "I'm currently unable to connect to "
                    "the AI service. Please try again."
                )
            }

    # =========================================
    # STUDENT AI
    # =========================================

    if user.role == "student":

        # -----------------------------------------
        # ATTENDANCE
        # -----------------------------------------

        if "attendance" in message_lower:

            records = db.query(Attendance).filter(
                Attendance.student_id == current_user_id
            ).all()

            if not records:
                return {
                    "response": (
                        "You currently have no "
                        "attendance records."
                    )
                }

            total_days = len(records)

            present_days = sum(
                1
                for record in records
                if record.status
                and record.status.lower() == "present"
            )

            absent_days = total_days - present_days

            percentage = (
                present_days / total_days
            ) * 100

            return {
                "response": (
                    f"Your current attendance is "
                    f"{percentage:.1f}%. "
                    f"You were present for "
                    f"{present_days} out of {total_days} days "
                    f"and absent for {absent_days} days."
                )
            }

        # -----------------------------------------
        # STUDY / EXAM QUESTIONS
        # -----------------------------------------

        if (
            "study" in message_lower
            or "studying" in message_lower
            or "learn" in message_lower
            or "exam" in message_lower
            or "prepare" in message_lower
        ):

            try:

                response = ask_llm(
                    message=message,
                    user_name=user.name,
                    role=user.role
                )

                return {
                    "response": response
                }

            except Exception as error:

                print("GROQ ERROR:", error)

                return {
                    "response": (
                        "Here are some useful exam preparation tips:\n\n"
                        "• Make a realistic study timetable.\n"
                        "• Start with the most important topics.\n"
                        "• Practice previous questions.\n"
                        "• Use active recall and spaced revision.\n"
                        "• Take short breaks while studying.\n"
                        "• Review difficult topics regularly."
                    )
                }

        # -----------------------------------------
        # GREETING
        # -----------------------------------------

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

        # -----------------------------------------
        # GROQ FOR OTHER STUDENT QUESTIONS
        # -----------------------------------------

        try:

            response = ask_llm(
                message=message,
                user_name=user.name,
                role=user.role
            )

            return {
                "response": response
            }

        except Exception as error:

            print("GROQ ERROR:", error)

            return {
                "response": (
                    "I'm currently unable to connect to "
                    "the AI service. Please try again."
                )
            }

    # =========================================
    # UNKNOWN ROLE
    # =========================================

    return {
        "response": (
            "I'm your XYZ AI School Assistant. "
            "I can help with attendance, studies, "
            "and academic guidance."
        )
    }