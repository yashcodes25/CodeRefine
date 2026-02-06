from pydantic import BaseModel, Field
from typing import List

class Issue(BaseModel):
    category: str
    message: str
    severity: str

class CodeRequest(BaseModel):
    code: str = Field(..., min_length=1)
    language: str

class CodeResponse(BaseModel):
    score: int
    issues: List[Issue]
    optimized_code: str
    explanation: str

