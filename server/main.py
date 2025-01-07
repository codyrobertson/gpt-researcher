from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import List, Optional
import uvicorn
import json
import asyncio
from pydantic import BaseModel
import os
from datetime import datetime
import aiofiles
import sys
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from researcher.researcher import Researcher
from researcher.config import Config

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ResearchRequest(BaseModel):
    query: str
    source: str
    report_type: str
    research_tone: str
    max_sections: int
    agent_mode: bool
    follow_guidelines: bool
    verbose_logging: bool
    ai_model: str

async def research_stream(researcher: Researcher, query: str, config: Config):
    """Stream research results"""
    try:
        async for progress in researcher.research_stream(query, config):
            yield f"data: {json.dumps(progress)}\n\n"
    except Exception as e:
        logger.error(f"Research error: {str(e)}")
        yield f"data: {json.dumps({'error': str(e)})}\n\n"

@app.post("/api/research")
async def research(
    query: str = Form(...),
    source: str = Form(...),
    report_type: str = Form(...),
    research_tone: str = Form(...),
    max_sections: int = Form(...),
    agent_mode: bool = Form(...),
    follow_guidelines: bool = Form(...),
    verbose_logging: bool = Form(...),
    ai_model: str = Form(...),
    files: List[UploadFile] = File(None),
):
    try:
        # Log received form data
        logger.info(f"Received research request: query={query}, source={source}, report_type={report_type}, research_tone={research_tone}, max_sections={max_sections}, agent_mode={agent_mode}, follow_guidelines={follow_guidelines}, verbose_logging={verbose_logging}, ai_model={ai_model}")

        # Handle file uploads if present
        uploaded_files = []
        if files:
            for file in files:
                file_path = os.path.join(UPLOAD_DIR, file.filename)
                async with aiofiles.open(file_path, 'wb') as buffer:
                    content = await file.read()
                    await buffer.write(content)
                uploaded_files.append(file_path)

        # Configure research settings
        config = Config(
            report_type=report_type,
            research_tone=research_tone,
            max_sections=max_sections,
            agent_mode=agent_mode,
            follow_guidelines=follow_guidelines,
            verbose=verbose_logging,
            model=ai_model,
            source=source,
            local_files=uploaded_files if source in ['documents', 'hybrid'] else None
        )

        # Initialize researcher
        researcher = Researcher(config)

        # Return streaming response
        return StreamingResponse(
            research_stream(researcher, query, config),
            media_type="text/event-stream"
        )

    except Exception as e:
        logger.error(f"API error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True) 