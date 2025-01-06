import logging
import traceback
import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional
from uuid import uuid4
from dotenv import load_dotenv
from gpt_researcher import GPTResearcher
from backend.report_type import DetailedReport
from openai import RateLimitError, APIError

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="GPT Researcher API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables
load_dotenv()

class ResearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    report_type: str = Field(default="research_report", 
                           regex="^(research_report|detailed_report)$")

class ResearchResponse(BaseModel):
    report: str
    file_path: str

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    try:
        response = await call_next(request)
        logger.info(f"Response status: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Request failed: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"detail": str(e)}
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception handler caught: {str(exc)}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)}
    )

@app.post("/research", response_model=ResearchResponse)
async def research(request: ResearchRequest):
    try:
        logger.info(f"Received research request: {request.dict()}")
        
        # Check environment variables
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500, 
                detail="OpenAI API key not found"
            )
        
        try:
            if request.report_type == 'detailed_report':
                logger.debug("Creating DetailedReport instance")
                detailed_report = DetailedReport(
                    query=request.query,
                    report_type="research_report",
                    report_source="web_search",
                )
                logger.debug("Running detailed report")
                report = await detailed_report.run()
            else:
                logger.debug("Creating GPTResearcher instance")
                researcher = GPTResearcher(
                    query=request.query,
                    report_type=request.report_type
                )
                logger.debug("Conducting research")
                await researcher.conduct_research()
                logger.debug("Writing report")
                report = await researcher.write_report()

            if not isinstance(report, str):
                logger.error(f"Invalid report type: {type(report)}")
                raise HTTPException(
                    status_code=500, 
                    detail="Invalid report format"
                )

            # Save report to file
            artifact_filepath = f"outputs/{uuid4()}.md"
            os.makedirs("outputs", exist_ok=True)
            with open(artifact_filepath, "w") as f:
                f.write(report)

            logger.info(f"Report saved to {artifact_filepath}")
            
            return ResearchResponse(
                report=report,
                file_path=artifact_filepath
            )

        except RateLimitError as e:
            logger.error(f"OpenAI API rate limit exceeded: {str(e)}")
            raise HTTPException(
                status_code=429,
                detail="OpenAI API rate limit exceeded. Please try again later or check your API quota."
            )
        except APIError as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise HTTPException(
                status_code=503,
                detail="OpenAI API error. Please try again later."
            )
        except Exception as e:
            logger.error(f"Error in research process: {str(e)}")
            logger.error(traceback.format_exc())
            raise HTTPException(
                status_code=500,
                detail=f"Research process error: {str(e)}"
            )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.on_event("startup")
async def startup_event():
    logger.info("FastAPI server starting up...")
    # Log environment variables (excluding sensitive ones)
    env_vars = {k: '***' if 'key' in k.lower() else v 
                for k, v in os.environ.items()}
    logger.debug(f"Environment variables: {env_vars}")

def start_server():
    """Function to start the server"""
    import uvicorn
    logger.info("Starting FastAPI server on port 8000")
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000, 
        log_level="debug",
        access_log=True
    )

if __name__ == "__main__":
    start_server() 