from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

try:
    client = MongoClient(os.getenv('MONGODB_URI'))
    db = client['healthcare_system']

    client.admin.command('ping')
    print("✅ MongoDB connection successful!")
    print("📂 Databases:", client.list_database_names())
    print("📋 Collections:", db.list_collection_names())

except Exception as e:
    print("❌ MongoDB connection failed:", e)
