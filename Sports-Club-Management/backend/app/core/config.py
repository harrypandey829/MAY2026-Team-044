from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
AI_SERVICE_URL = os.getenv("AI_SERVICE_URL")