import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "datamind_ai")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# File size threshold for large file detection (5MB)
LARGE_FILE_THRESHOLD = 5 * 1024 * 1024