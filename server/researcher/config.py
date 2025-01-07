from typing import List, Optional
from pydantic import BaseModel

class Config(BaseModel):
    report_type: str
    research_tone: str
    max_sections: int
    agent_mode: bool
    follow_guidelines: bool
    verbose: bool
    model: str
    source: str
    local_files: Optional[List[str]] = None 