import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_json(text: str):
    """
    Extract the first JSON object found in text.
    """
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError("No JSON object found")
    return json.loads(match.group())

def analyze_code(code: str, language: str):
    prompt = f"""
You are a STRICT code review engine.

RULES (MANDATORY):
- Output MUST be valid JSON
- Output MUST start with {{ and end with }}
- NO markdown
- NO explanations outside JSON
- NO code blocks
- NO backticks

Return EXACTLY this JSON schema:

{{
  "score": number,
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

Analyze this {language} code:

{code}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You output ONLY raw JSON. No text."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.1,
        max_tokens=700
    )

    raw_output = response.choices[0].message.content

    try:
        return extract_json(raw_output)
    except Exception:
        return {
            "score": 0,
            "issues": [
                {
                    "category": "AI Formatting Error",
                    "message": "Model did not return strict JSON",
                    "severity": "high"
                }
            ],
            "optimized_code": code,
            "explanation": raw_output
        }
