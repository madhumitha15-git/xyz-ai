ROLE_PERMISSIONS = {

    "student": {
        "view_own_attendance"
    },

    "parent": {
        "view_child_attendance"
    },

    "teacher": {
        "view_student_attendance",
        "mark_attendance"
    },

    "principal": {
        "view_student_attendance",
        "view_school_analytics"
    }
}


def is_authorized(role: str, permission: str) -> bool:

    permissions = ROLE_PERMISSIONS.get(role, set())

    return permission in permissions