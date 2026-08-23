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
from app.api.sports import router as sports_router
from app.api.equipment import router as equipment_router
from app.api.certificates import router as certificates_router
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
app.include_router(sports_router)
app.include_router(equipment_router)
app.include_router(certificates_router)
app.include_router(ai.router)


@app.on_event("startup")
def on_startup():
    """Auto-create all tables and migrate missing columns on startup (safe for SQLite dev environment)."""
    from sqlalchemy import inspect, text
    from app.db.base import Base
    from app.db.database import engine
    import app.models  # noqa: F401 — ensures all models are imported before create_all
    Base.metadata.create_all(bind=engine)

    try:
        with engine.begin() as conn:
            inspector = inspect(engine)
            if "events" in inspector.get_table_names():
                columns = [c["name"] for c in inspector.get_columns("events")]
                if "sport" not in columns:
                    conn.execute(text("ALTER TABLE events ADD COLUMN sport VARCHAR(50)"))
            if "users" in inspector.get_table_names():
                columns = [c["name"] for c in inspector.get_columns("users")]
                if "sport" not in columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN sport VARCHAR(255)"))
                if "address" not in columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN address VARCHAR(255)"))
            if "resources" in inspector.get_table_names():
                columns = [c["name"] for c in inspector.get_columns("resources")]
                if "capacity" not in columns:
                    conn.execute(text("ALTER TABLE resources ADD COLUMN capacity INTEGER DEFAULT 50"))

    except Exception as e:
        print(f"Startup migration check: {e}")


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Sports Club Management API is running"}