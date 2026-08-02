import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    os.getenv("DATABASE_URL", "postgresql://postgres:hariom1234@localhost:5432/test_sportsclub")
)

def get_test_engine():
    try:
        connect_args = {}
        if TEST_DATABASE_URL and TEST_DATABASE_URL.startswith("sqlite"):
            connect_args = {"check_same_thread": False}
        eng = create_engine(TEST_DATABASE_URL, connect_args=connect_args)
        with eng.connect() as conn:
            pass
        return eng
    except Exception:
        fallback_url = "sqlite:///./test_sportsclub.db"
        return create_engine(fallback_url, connect_args={"check_same_thread": False})

engine = get_test_engine()

TestingSessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)