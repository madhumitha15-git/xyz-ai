from fastapi import APIRouter
from app.security.permissions import is_authorized


router = APIRouter(
    prefix="/security",
    tags=["Security"]
)


@router.get("/check")
def check_permission(
    role: str,
    permission: str
):

    allowed = is_authorized(
        role,
        permission
    )

    return {
        "role": role,
        "permission": permission,
        "authorized": allowed
    }