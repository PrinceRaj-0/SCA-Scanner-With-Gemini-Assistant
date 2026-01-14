#!/bin/bash
export PATH="/opt/homebrew/bin:$PATH"

echo "Starting Trivy Scanner..."

# Check dependencies
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH."
    exit 1
fi

if ! command -v trivy &> /dev/null; then
    echo "Error: Trivy is not installed or not in PATH."
    exit 1
fi

# Cleanup previous processes (optional, simplistic)
pkill -f "node server/index.js"
pkill -f "vite"

# Start Backend
echo "Starting Backend on port 3000..."
cd server
npm install &> /dev/null
node index.js &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "Starting Frontend..."
cd client
npm install &> /dev/null
npm run dev -- --open &
FRONTEND_PID=$!

echo "App is running!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Press CTRL+C to stop."

wait
