#!/bin/bash
set -e  # Exit on error

# Function to cleanup on exit
cleanup() {
    echo "Cleaning up..."
    docker-compose down
}

# Set trap for cleanup
trap cleanup EXIT

# Check for .env file in server directory and copy to root
if [ ! -f server/.env ]; then
    echo "Error: No .env file found in server directory"
    exit 1
fi

# Export environment variables from server/.env
set -a
source server/.env
set +a

echo "Environment variables loaded from server/.env"

echo "Checking if ports are in use..."
if lsof -i :5001 > /dev/null || lsof -i :8000 > /dev/null; then
    echo "Ports 5001 or 8000 are in use. Stopping conflicting services..."
    if lsof -i :5001 > /dev/null; then
        lsof -ti :5001 | xargs kill -9 || true
    fi
    if lsof -i :8000 > /dev/null; then
        lsof -ti :8000 | xargs kill -9 || true
    fi
    sleep 2
fi

echo "Stopping any existing containers..."
docker-compose down --remove-orphans

echo "Building the Docker image..."
docker-compose build --no-cache

echo "Starting the services..."
docker-compose up -d

echo "Waiting for services to start..."
sleep 15

echo "Testing the services..."
python server/test_servers.py

if [ $? -eq 0 ]; then
    echo "Services are running successfully!"
    echo "You can now use the following endpoints:"
    echo "Flask: http://localhost:5001"
    echo "FastAPI: http://localhost:8000"
    
    echo -e "\nExample usage:"
    echo "curl http://localhost:5001/health"
    echo 'curl -X POST http://localhost:5001/research -H "Content-Type: application/json" -d '"'"'{"query": "Test query", "report_type": "research_report"}'"'"
    
    echo -e "\nContainers are running in the background. To view logs use: docker-compose logs -f"
else
    echo "Service testing failed. Checking logs..."
    docker-compose logs
    exit 1
fi 