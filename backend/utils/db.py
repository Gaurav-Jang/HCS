from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    def __init__(self):
        self.client = None
        self.db = None
        
    def connect(self):
        try:
            # MongoDB connection string - use local MongoDB by default
            mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
            self.client = MongoClient(mongo_uri)
            self.db = self.client['healthcare_system']
            print("Connected to MongoDB successfully!")
            return True
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            return False
    
    def get_collection(self, collection_name):
        # if self.db is not None:
        #     return self.db[collection_name]
        # return None
        if self.db is None:
            print("WARNING: db_instance.db is None. Trying to reconnect...")
            connected = self.connect()
            if not connected:
                print("ERROR: Could not connect to MongoDB.")
                return None
        return self.db[collection_name]
    
    def close_connection(self):
        if self.client:
            self.client.close()

# Global database instance
db_instance = Database()