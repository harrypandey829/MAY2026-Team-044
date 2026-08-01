from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

TEST_DATABASE_URL = (
    "postgresql+psycopg://postgres:hariom1234@localhost:5432/sportsclub_test"
)

engine = create_engine(TEST_DATABASE_URL)

TestingSessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)