from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:hariom1234@localhost:5432/sportsclub")
if not DATABASE_URL:
    DATABASE_URL = "postgresql://postgres:hariom1234@localhost:5432/sportsclub"

AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://127.0.0.1:8001")