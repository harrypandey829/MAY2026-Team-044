from fastapi import FastAPI

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
    title="Sports Club Management API"
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