import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")
if not API_KEY:
    raise RuntimeError("GOOGLE_API_KEY not set")

# ✅ This model IS supported in v1beta
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/"
    "models/gemini-pro:generateContent"
)

def gemini_review(code: str, language: str) -> str:
    prompt = f"""
You are a senior software engineer.

Analyze the following {language} code.

Return ONLY valid JSON.
Do NOT include markdown.
Do NOT include backticks.
Do NOT add explanations outside JSON.

JSON format:
{{
  "issues": [
    {{
      "category": "string",
      "message": "string",
      "severity": "low | medium | high"
    }}
  ],
  "optimized_code": "string",
  "explanation": "string"
}}

Code:
{code}
"""

    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ]
    }

    response = requests.post(
        f"{GEMINI_URL}?key={API_KEY}",
        json=payload,
        timeout=30
    )

    if response.status_code != 200:
        raise RuntimeError(response.text)

    data = response.json()
    return data["candidates"][0]["content"]["parts"][0]["text"]
