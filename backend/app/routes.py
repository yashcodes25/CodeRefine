from fastapi import APIRouter, HTTPException
from app.schemas import AnalyzeRequest
from app.ai_engine import analyze_code

router = APIRouter()


@router.post("/analyze")
def analyze(request: AnalyzeRequest):
    """
    Analyze source code using Groq LLM.
    """
    try:
        result = analyze_code(
            code=request.code,
            language=request.language
        )
        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )
