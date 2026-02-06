import os
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-pro")


def gemini_review(code: str, language: str):
    prompt = f"""
You are a senior software engineer.

Analyze the following {language} code.

Return ONLY valid JSON.
Do NOT include markdown.
Do NOT include explanations outside JSON.
Do NOT include backticks.

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

    response = model.generate_content(prompt)
    return response.text
