from flask import Flask, request, jsonify
import asyncio
from uuid import uuid4
import os
from dotenv import load_dotenv
from gpt_researcher import GPTResearcher
from backend.report_type import DetailedReport

app = Flask(__name__)
load_dotenv()

def run_async(coro):
    """Helper function to run async code in Flask"""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()

@app.route('/research', methods=['POST'])
def research():
    try:
        data = request.get_json()
        query = data.get('query')
        report_type = data.get('report_type', 'research_report')

        if not query:
            return jsonify({'error': 'Query is required'}), 400

        if report_type == 'detailed_report':
            detailed_report = DetailedReport(
                query=query,
                report_type="research_report",
                report_source="web_search",
            )
            report = run_async(detailed_report.run())
        else:
            researcher = GPTResearcher(
                query=query,
                report_type=report_type
            )
            run_async(researcher.conduct_research())
            report = run_async(researcher.write_report())

        # Save report to file
        artifact_filepath = f"outputs/{uuid4()}.md"
        os.makedirs("outputs", exist_ok=True)
        with open(artifact_filepath, "w") as f:
            f.write(report)

        return jsonify({
            'report': report,
            'file_path': artifact_filepath
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 