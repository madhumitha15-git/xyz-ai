import os

from groq import Groq
from dotenv import load_dotenv

load_dotenv()


def ask_llm(message: str, user_name: str, role: str) -> str:
    """
    Send a general question to the Groq LLM.
    """

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        return (
            "The AI language model is not configured yet. "
            "Please check the GROQ_API_KEY environment variable."
        )

    try:
        client = Groq(api_key=api_key)

        system_prompt = f"""
You are XYZ AI, an intelligent school assistant.

The current user is:
Name: {user_name}
Role: {role}

Help the user with:
- studying
- learning
- school subjects
- academic guidance
- productivity
- general educational questions

Be friendly, concise, and easy for a student or parent to understand.

Important:
- Do not invent attendance information.
- Do not invent school records.
- Do not claim access to information that was not provided.
- For attendance questions, the application handles the database information separately.
"""

        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": message,
                },
            ],
            temperature=0.5,
            max_tokens=500,
        )

        return response.choices[0].message.content.strip()

    except Exception as error:
        print("GROQ ERROR:", error)

        return (
            "I'm having trouble connecting to the AI service "
            "right now. Please try again."
        )