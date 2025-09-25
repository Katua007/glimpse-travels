from app import app
from config import db
from models import User, Trip, Photo, TripFollowers
from datetime import datetime, timedelta

with app.app_context():
    # Drop and recreate all tables to include new columns
    db.drop_all()
    db.create_all()
    
    print("Database recreated with new schema...")

    # Create Users with ratings and bios
    users = [
        User(username='TravellerOne', email='traveller@example.com', 
             bio='Adventure seeker exploring ancient civilizations', rating=4.8,
             wishlist='["Norway", "Iceland", "New Zealand"]'),
        User(username='WandererSam', email='wanderer@example.com', 
             bio='Wildlife photographer and safari enthusiast', rating=4.6,
             wishlist='["Madagascar", "Galapagos", "Antarctica"]'),
        User(username='NomadExplorer', email='nomad@example.com', 
             bio='Digital nomad discovering hidden gems worldwide', rating=4.9,
             wishlist='["Bhutan", "Myanmar", "Socotra Island"]'),
        User(username='CultureSeeker', email='culture@example.com', 
             bio='Art lover exploring museums and cultural sites', rating=4.4,
             wishlist='["Iran", "Uzbekistan", "Ethiopia"]'),
        User(username='AdventureQueen', email='adventure@example.com', 
             bio='Extreme sports and mountain climbing enthusiast', rating=4.7,
             wishlist='["Nepal", "Patagonia", "Alaska"]'),
        User(username='FoodieWanderer', email='foodie@example.com', 
             bio='Culinary explorer tasting flavors around the globe', rating=4.5,
             wishlist='["Vietnam", "Lebanon", "Georgia"]')
    ]
    
    for user in users:
        user.password_hash = 'password'
    
    db.session.add_all(users)
    db.session.commit()

    # Create diverse trips from different continents
    trips = [
        # South America
        Trip(title='Machu Picchu Adventure', destination='Peru', 
             start_date=datetime.now() - timedelta(days=30), 
             end_date=datetime.now() - timedelta(days=23), user_id=1),
        Trip(title='Amazon Rainforest Expedition', destination='Brazil', 
             start_date=datetime.now() + timedelta(days=60), 
             end_date=datetime.now() + timedelta(days=67), user_id=2),
        
        # Africa
        Trip(title='African Safari', destination='Kenya', 
             start_date=datetime.now() - timedelta(days=60), 
             end_date=datetime.now() - timedelta(days=53), user_id=2),
        Trip(title='Moroccan Desert Trek', destination='Morocco', 
             start_date=datetime.now() - timedelta(days=90), 
             end_date=datetime.now() - timedelta(days=83), user_id=3),
        Trip(title='Cape Town Wine Tour', destination='South Africa', 
             start_date=datetime.now() + timedelta(days=120), 
             end_date=datetime.now() + timedelta(days=127), user_id=4),
        
        # Asia
        Trip(title='Bali Island Escape', destination='Indonesia', 
             start_date=datetime.now() + timedelta(days=15), 
             end_date=datetime.now() + timedelta(days=22), user_id=3),
        Trip(title='Thai Island Hopping', destination='Thailand', 
             start_date=datetime.now() + timedelta(days=75), 
             end_date=datetime.now() + timedelta(days=82), user_id=5),
        Trip(title='Cherry Blossom Festival', destination='Japan', 
             start_date=datetime.now() + timedelta(days=100), 
             end_date=datetime.now() + timedelta(days=107), user_id=4),
        Trip(title='Golden Triangle Tour', destination='India', 
             start_date=datetime.now() - timedelta(days=45), 
             end_date=datetime.now() - timedelta(days=38), user_id=6),
        
        # Europe
        Trip(title='European Grand Tour', destination='Italy', 
             start_date=datetime.now() + timedelta(days=45), 
             end_date=datetime.now() + timedelta(days=52), user_id=4),
        Trip(title='Greek Island Adventure', destination='Greece', 
             start_date=datetime.now() + timedelta(days=90), 
             end_date=datetime.now() + timedelta(days=97), user_id=5),
        Trip(title='Paris & French Riviera', destination='France', 
             start_date=datetime.now() - timedelta(days=15), 
             end_date=datetime.now() - timedelta(days=8), user_id=6),
        
        # North America
        Trip(title='Yellowstone National Park', destination='USA', 
             start_date=datetime.now() + timedelta(days=30), 
             end_date=datetime.now() + timedelta(days=37), user_id=5),
        Trip(title='Canadian Rockies Expedition', destination='Canada', 
             start_date=datetime.now() + timedelta(days=150), 
             end_date=datetime.now() + timedelta(days=157), user_id=3)
    ]
    db.session.add_all(trips)
    db.session.commit()

    # Create TripFollowers records
    followers = [
        TripFollowers(user_id=2, trip_id=1, reason_for_following="Love Peru!"),
        TripFollowers(user_id=3, trip_id=1, reason_for_following="Ancient history fascinates me"),
        TripFollowers(user_id=1, trip_id=3, reason_for_following="Amazing wildlife"),
        TripFollowers(user_id=4, trip_id=3, reason_for_following="Safari photography"),
        TripFollowers(user_id=2, trip_id=4, reason_for_following="Desert adventure!"),
        TripFollowers(user_id=1, trip_id=7, reason_for_following="Beach paradise!"),
        TripFollowers(user_id=6, trip_id=8, reason_for_following="Cherry blossoms are magical"),
        TripFollowers(user_id=3, trip_id=10, reason_for_following="Roman history fascinates me"),
        TripFollowers(user_id=5, trip_id=12, reason_for_following="French culture and cuisine")
    ]
    db.session.add_all(followers)

    # Create Photo records for trips
    photos = [
        # Peru - Machu Picchu
        Photo(url='https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&h=400&fit=crop', trip_id=1, caption='Machu Picchu at sunrise'),
        Photo(url='https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop', trip_id=1, caption='Ancient Inca ruins'),
        
        # Brazil - Amazon
        Photo(url='https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop', trip_id=2, caption='Amazon rainforest canopy'),
        
        # Kenya - Safari
        Photo(url='https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop', trip_id=3, caption='Majestic elephant'),
        Photo(url='https://images.unsplash.com/photo-1549366021-9f761d040a94?w=600&h=400&fit=crop', trip_id=3, caption='Savanna sunset'),
        
        # Morocco - Desert
        Photo(url='https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=600&h=400&fit=crop', trip_id=4, caption='Sahara Desert dunes'),
        
        # South Africa - Cape Town
        Photo(url='https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&h=400&fit=crop', trip_id=5, caption='Cape Town vineyards'),
        
        # Indonesia - Bali
        Photo(url='https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&h=400&fit=crop', trip_id=6, caption='Bali rice terraces'),
        
        # Thailand - Islands
        Photo(url='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', trip_id=7, caption='Thai beach paradise'),
        
        # Japan - Cherry Blossoms
        Photo(url='https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600&h=400&fit=crop', trip_id=8, caption='Cherry blossoms in Kyoto'),
        
        # India - Golden Triangle
        Photo(url='https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop', trip_id=9, caption='Taj Mahal at dawn'),
        
        # Italy - Grand Tour
        Photo(url='https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=600&h=400&fit=crop', trip_id=10, caption='Colosseum in Rome'),
        
        # Greece - Islands
        Photo(url='https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=400&fit=crop', trip_id=11, caption='Santorini sunset'),
        
        # France - Paris & Riviera
        Photo(url='https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=600&h=400&fit=crop', trip_id=12, caption='Eiffel Tower at night'),
        
        # USA - Yellowstone
        Photo(url='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', trip_id=13, caption='Yellowstone geysers'),
        
        # Canada - Rockies
        Photo(url='https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop', trip_id=14, caption='Canadian Rockies landscape')
    ]
    db.session.add_all(photos)

    db.session.commit()
    print("Seeding complete with sample trips and photos.")