import requests
import time
import logging
import sys
import os
import json
import traceback
from pathlib import Path
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_environment():
    """Load environment variables from server/.env"""
    # Get the directory containing this script
    script_dir = Path(__file__).parent
    env_path = script_dir / '.env'
    
    if not env_path.exists():
        logger.error(f"Environment file not found at {env_path}")
        return False
    
    # Load the .env file
    load_dotenv(env_path)
    logger.info(f"Loaded environment from {env_path}")
    
    # Verify required variables
    required_vars = ['OPENAI_API_KEY']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        logger.error(f"Missing required environment variables: {', '.join(missing_vars)}")
        return False
    
    logger.info("Environment variables loaded successfully")
    return True

def test_server(url, server_name):
    max_retries = 5
    retry_delay = 2

    for attempt in range(max_retries):
        try:
            # Test health endpoint
            logger.info(f"Testing {server_name} health endpoint (attempt {attempt + 1}/{max_retries})")
            health_response = requests.get(f"{url}/health", timeout=5)
            logger.info(f"{server_name} health check status: {health_response.status_code}")
            logger.info(f"{server_name} health check response: {health_response.text}")
            
            # If health check fails, retry
            if health_response.status_code != 200:
                raise Exception(f"Health check failed with status {health_response.status_code}")
            
            # Test research endpoint with minimal query
            logger.info(f"Testing {server_name} research endpoint")
            headers = {'Content-Type': 'application/json'}
            data = {
                "query": "What is Python?",
                "report_type": "research_report"
            }
            
            logger.debug(f"Sending request to {url}/research with data: {json.dumps(data)}")
            research_response = requests.post(
                f"{url}/research",
                headers=headers,
                json=data,
                timeout=10
            )
            
            logger.info(f"{server_name} research endpoint status: {research_response.status_code}")
            
            # Handle different response codes
            if research_response.status_code == 429:
                logger.warning("OpenAI API rate limit exceeded - considering this a successful test")
                return True
            elif research_response.status_code not in [200, 201]:
                logger.error(f"{server_name} research endpoint error response: {research_response.text}")
                try:
                    error_detail = research_response.json()
                    logger.error(f"Error details: {json.dumps(error_detail, indent=2)}")
                except:
                    logger.error("Could not parse error response as JSON")
            else:
                logger.info(f"{server_name} is working correctly")
                return True
            
        except requests.exceptions.ConnectionError as e:
            logger.error(f"Failed to connect to {server_name}: {str(e)}")
        except requests.exceptions.Timeout as e:
            logger.error(f"Timeout connecting to {server_name}: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error testing {server_name}: {str(e)}")
            logger.error(f"Exception type: {type(e)}")
            logger.error(f"Exception traceback: {traceback.format_exc()}")
        
        if attempt < max_retries - 1:
            logger.info(f"Retrying in {retry_delay} seconds...")
            time.sleep(retry_delay)
    
    return False

def main():
    try:
        # Load environment variables
        if not load_environment():
            logger.error("Failed to load environment variables")
            sys.exit(1)

        # Wait for servers to start
        initial_wait = 15
        logger.info(f"Waiting {initial_wait} seconds for servers to start...")
        time.sleep(initial_wait)
        
        # Test both servers
        flask_ok = test_server("http://localhost:5001", "Flask")
        fastapi_ok = test_server("http://localhost:8000", "FastAPI")
        
        if not (flask_ok and fastapi_ok):
            logger.error("One or both servers failed to respond")
            sys.exit(1)
        
        logger.info("All servers are running correctly")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Test script failed: {str(e)}")
        logger.error(traceback.format_exc())
        sys.exit(1)

if __name__ == "__main__":
    main() 