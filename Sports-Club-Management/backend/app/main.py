from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.users import router as user_router
from app.api.events import router as event_router
from app.api.event_registration import router as registration_router
from app.api.attendance import router as attendance_router
from app.api.performance import router as performance_router
from app.api.payments import router as payment_router
from app.api.announcement import router as announcement_router
from app.api.notification import router as notification_router
from app.api.resource import router as resource_router
from app.api.resource_booking import router as resource_booking_router
from app.api import ai

app = FastAPI(
    title="Sports Club Management API",
    description="Backend API for Sports Club Management System",
    version="1.0.0"
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(event_router)
app.include_router(registration_router)
app.include_router(attendance_router)
app.include_router(performance_router)
app.include_router(payment_router)
app.include_router(announcement_router)
app.include_router(notification_router)
app.include_router(resource_router)
app.include_router(resource_booking_router)
app.include_router(ai.router)


@app.on_event("startup")
def on_startup():
    """Auto-create all tables on startup (safe for SQLite dev environment)."""
    from app.db.base import Base
    from app.db.database import engine
    import app.models  # noqa: F401 — ensures all models are imported before create_all
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Sports Club Management API is running"}