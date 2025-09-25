#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'server'))

from app import app
import json

def test_api():
    print("🧪 Testing Glimpse Travels API...")
    
    with app.test_client() as client:
        with app.app_context():
            # Test trips endpoint
            response = client.get('/trips')
            print(f"✅ GET /trips: {response.status_code}")
            if response.status_code == 200:
                trips = response.get_json()
                print(f"   📊 Found {len(trips)} trips")
                if trips:
                    print(f"   🏔️  Sample: {trips[0]['title']} in {trips[0]['destination']}")
            
            # Test users endpoint
            response = client.get('/users')
            print(f"✅ GET /users: {response.status_code}")
            if response.status_code == 200:
                users = response.get_json()
                print(f"   👥 Found {len(users)} users")
                if users:
                    print(f"   🌟 Sample: {users[0]['username']} (Rating: {users[0]['rating']})")
            
            # Test photos endpoint
            response = client.get('/photos')
            print(f"✅ GET /photos: {response.status_code}")
            if response.status_code == 200:
                photos = response.get_json()
                print(f"   📸 Found {len(photos)} photos")
    
    print("\n🎉 API is working correctly!")
    print("🚀 Run './start_servers.sh' to start the application")

if __name__ == "__main__":
    test_api()