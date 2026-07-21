#!/usr/bin/env python3
"""
MongoDB Atlas Connection Test & Seeder
Created by Anuj Kumar
"""

import os
import sys
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, OperationFailure

def test_connection():
    """Test MongoDB Atlas connection"""
    
    print("=" * 60)
    print("MongoDB Atlas Connection Test")
    print("=" * 60)
    
    # Read from .env or environment
    mongo_url = os.getenv('MONGO_URL', '')
    
    if not mongo_url or mongo_url == 'mongodb://localhost:27017':
        print("\n⚠️  WARNING: Using local MongoDB!")
        print("Please update MONGO_URL in .env with your Atlas connection string.")
        print("\nYour connection string should look like:")
        print("mongodb+srv://anujkumar170705_db_user:YOUR_PASSWORD@cluster0.fun0itq.mongodb.net/engitech?retryWrites=true&w=majority")
        print("\n❌ Cannot proceed without Atlas connection string.")
        sys.exit(1)
    
    if '<db_password>' in mongo_url or '<YOUR_PASSWORD>' in mongo_url:
        print("\n❌ ERROR: You need to replace <db_password> with your actual password!")
        print("\nSteps:")
        print("1. Go to MongoDB Atlas → Database Access")
        print("2. Edit user 'anujkumar170705_db_user'")
        print("3. Reset password and copy it")
        print("4. Update MONGO_URL in .env file")
        sys.exit(1)
    
    print(f"\n📡 Testing connection to MongoDB Atlas...")
    print(f"Connection: {mongo_url[:50]}...") # Show partial URL for security
    
    try:
        # Test connection
        client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
        client.server_info()  # Force connection
        
        print("✅ Connection successful!")
        
        # Get database info
        db_name = os.getenv('DB_NAME', 'engitech')
        db = client[db_name]
        
        print(f"\n📊 Database Info:")
        print(f"   Database: {db_name}")
        
        # Check collections
        collections = db.list_collection_names()
        print(f"   Collections: {', '.join(collections) if collections else 'None yet'}")
        
        # Check equipment count
        if 'equipment' in collections:
            count = db.equipment.count_documents({})
            print(f"   Equipment count: {count}")
            
            if count > 0:
                print("\n✅ Database already has equipment!")
                print(f"   Total: {count} items")
                
                # Show breakdown
                for branch in ['mechanical', 'electrical', 'civil', 'electronics']:
                    branch_count = db.equipment.count_documents({'branch': branch})
                    print(f"   - {branch.capitalize()}: {branch_count}")
                
                response = input("\n❓ Do you want to re-seed the database? This will delete existing data. (yes/no): ")
                if response.lower() != 'yes':
                    print("\n✅ Keeping existing data. You're all set!")
                    client.close()
                    return True
        
        # Seed database
        print("\n🌱 Seeding database with 83 equipment items...")
        from seed_comprehensive_equipment import seed_comprehensive
        import asyncio
        asyncio.run(seed_comprehensive())
        
        print("\n✅ Database seeded successfully!")
        print("\n📋 Summary:")
        print(f"   Total equipment: {db.equipment.count_documents({})}")
        print(f"   Total users: {db.users.count_documents({})}")
        
        print("\n🎉 Your MongoDB Atlas is ready!")
        print("\n👤 Admin Login:")
        print(f"   Email: {os.getenv('ADMIN_EMAIL', 'admin@engitech.com')}")
        print(f"   Password: {os.getenv('ADMIN_PASSWORD', 'admin123')}")
        
        client.close()
        return True
        
    except ConnectionFailure:
        print("\n❌ Connection failed!")
        print("\nPossible reasons:")
        print("1. Wrong password in connection string")
        print("2. IP not whitelisted (Add 0.0.0.0/0 in MongoDB Atlas → Network Access)")
        print("3. Database user doesn't exist")
        print("\nCheck MONGODB_SETUP.md for detailed instructions.")
        return False
        
    except OperationFailure as e:
        print(f"\n❌ Authentication failed: {e}")
        print("\nMake sure:")
        print("1. Password is correct (no spaces, correct case)")
        print("2. User has proper permissions (readWrite or Atlas Admin)")
        return False
        
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    # Load .env
    from pathlib import Path
    from dotenv import load_dotenv
    
    env_path = Path(__file__).parent / '.env'
    load_dotenv(env_path)
    
    success = test_connection()
    sys.exit(0 if success else 1)
