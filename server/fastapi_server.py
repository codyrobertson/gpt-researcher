from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from uuid import uuid4
import os
from dotenv import load_dotenv
from gpt_researcher import GPTResearcher
from backend.report_type import DetailedReport

app = FastAPI(title="GPT Researcher API")
load_dotenv()

class ResearchRequest(BaseModel):
    query: str
    report_type: str = "research_report"

class ResearchResponse(BaseModel):
    report: str
    file_path: str

@app.post("/research", response_model=ResearchResponse)
async def research(request: ResearchRequest):
    try:
        if request.report_type == 'detailed_report':
            detailed_report = DetailedReport(
                query=request.query,
                report_type="research_report",
                report_source="web_search",
            )
            report = await detailed_report.run()
        else:
            researcher = GPTResearcher(
                query=request.query,
                report_type=request.report_type
            )
            await researcher.conduct_research()
            report = await researcher.write_report()

        # Save report to file
        artifact_filepath = f"outputs/{uuid4()}.md"
        os.makedirs("outputs", exist_ok=True)
        with open(artifact_filepath, "w") as f:
            f.write(report)

        return ResearchResponse(
            report=report,
            file_path=artifact_filepath
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 