#!/bin/bash

# Start the backend
echo "Starting the backend server..."
cd backend
poetry run python run.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start the frontend
echo "Starting the frontend..."
cd ../frontend
npm start &
FRONTEND_PID=$!

# Function to handle exit
cleanup() {
  echo "Shutting down servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit 0
}

# Register the cleanup function for when script receives SIGINT
trap cleanup INT

echo "Both servers are running. Press Ctrl+C to stop."

# Wait for user to press Ctrl+C
wait 