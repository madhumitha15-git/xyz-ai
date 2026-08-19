from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models import Base

from app.api.users import router as users_router
from app.api.attendance import router as attendance_router
from app.api.security_test import router as security_router
from app.api.relationships import router as relationships_router
from app.api.auth import router as auth_router
from app.api.ai import router as ai_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="XYZ AI - Human-Like AI School Assistant",
    description="Applied AI School Assistant",
    version="1.0.0"
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(users_router)
app.include_router(attendance_router)
app.include_router(security_router)
app.include_router(relationships_router)
app.include_router(auth_router)
app.include_router(ai_router)


@app.get("/")
def root():
    return {
        "message": "XYZ AI is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }