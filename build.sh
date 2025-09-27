#!/usr/bin/env bash
# Build script for Render

set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations/setup
cd server
python seed.py