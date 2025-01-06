import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import asyncio
from uuid import uuid4
import os
import traceback
from dotenv import load_dotenv
from gpt_researcher import GPTResearcher
from backend.report_type import DetailedReport

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)
load_dotenv()

def run_async(coro):
    """Helper function to run async code in Flask"""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy"})

@app.route('/research', methods=['POST'])
def research():
    try:
        logger.info("Received research request")
        data = request.get_json()
        if not data:
            logger.error("No JSON data received")
            return jsonify({'error': 'No JSON data received'}), 400

        query = data.get('query')
        report_type = data.get('report_type', 'research_report')

        if not query:
            logger.error("Query is required")
            return jsonify({'error': 'Query is required'}), 400

        logger.info(f"Processing query: {query} with report type: {report_type}")

        # Check environment variables
        required_vars = ['OPENAI_API_KEY']
        missing_vars = [var for var in required_vars if not os.getenv(var)]
        if missing_vars:
            error_msg = f"Missing required environment variables: {', '.join(missing_vars)}"
            logger.error(error_msg)
            return jsonify({'error': error_msg}), 500

        try:
            if report_type == 'detailed_report':
                logger.debug("Creating DetailedReport instance")
                detailed_report = DetailedReport(
                    query=query,
                    report_type="research_report",
                    report_source="web_search",
                )
                logger.debug("Running detailed report")
                report = run_async(detailed_report.run())
            else:
                logger.debug("Creating GPTResearcher instance")
                researcher = GPTResearcher(
                    query=query,
                    report_type=report_type
                )
                logger.debug("Conducting research")
                run_async(researcher.conduct_research())
                logger.debug("Writing report")
                report = run_async(researcher.write_report())

            # Save report to file
            artifact_filepath = f"outputs/{uuid4()}.md"
            os.makedirs("outputs", exist_ok=True)
            with open(artifact_filepath, "w") as f:
                f.write(report)

            logger.info(f"Report saved to {artifact_filepath}")

            return jsonify({
                'report': report,
                'file_path': artifact_filepath
            })

        except Exception as e:
            logger.error(f"Error in research process: {str(e)}")
            logger.error(traceback.format_exc())
            return jsonify({
                'error': str(e),
                'traceback': traceback.format_exc()
            }), 500

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

def start_server():
    """Function to start the server"""
    logger.info("Starting Flask server on port 5001")
    app.run(host='0.0.0.0', port=5001, debug=True)

if __name__ == '__main__':
    start_server() 