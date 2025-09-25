#!/bin/bash

# In server/seed.sh

# 1. Delete and recreate the database file
rm -f app.db

# 2. Run the Python seeding script to populate the tables
python seed.py

echo "Database seeded successfully!"