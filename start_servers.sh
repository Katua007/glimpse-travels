#!/bin/bash

echo "🌍 Starting Glimpse Travels Application..."

# Kill any existing processes
pkill -f flask
pkill -f "react-scripts start"

# Start Flask backend
echo "🚀 Starting Flask backend on port 5555..."
cd server && pipenv run flask run -p 5555 &
FLASK_PID=$!

# Wait for Flask to start
sleep 3

# Start React frontend  
echo "⚛️  Starting React frontend on port 3000..."
cd ../client && npm start &
REACT_PID=$!

echo "✅ Both servers started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5555"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait $FLASK_PID $REACT_PID