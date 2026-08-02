import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.base import Base
from app.db.session import get_db
from tests.database import engine, TestingSessionLocal

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)