from fastapi import APIRouter, HTTPException
from app.schemas import CodeRequest, CodeResponse
from app.ai_engine import analyze_code

router = APIRouter()

@router.post("/analyze", response_model=CodeResponse)
def analyze(request: CodeRequest):
    try:
        return analyze_code(request.code, request.language.lower())
    except Exception:
        raise HTTPException(status_code=500, detail="Internal analysis error")
