from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from app.routes import router

app = FastAPI(
    title="CodeRefine Backend",
    description="AI-powered code review engine",
    version="1.0.0"
)

app.include_router(router)

@app.get("/")
def root():
    return {"status": "Backend is running"}
