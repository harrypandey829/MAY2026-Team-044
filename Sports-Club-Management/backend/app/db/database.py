from sqlalchemy import create_engine
from app.core.config import DATABASE_URL

def get_engine():
    try:
        connect_args = {}
        if DATABASE_URL and DATABASE_URL.startswith("sqlite"):
            connect_args = {"check_same_thread": False}
        eng = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)
        with eng.connect() as conn:
            pass
        return eng
    except Exception:
        fallback_url = "sqlite:///./sportsclub.db"
        return create_engine(fallback_url, connect_args={"check_same_thread": False}, echo=False)

engine = get_engine()