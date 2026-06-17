import os

from dotenv import load_dotenv
from groq import Groq

# Load .env file
load_dotenv()

# Create Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_answer(question, context):

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "Answer the question only using the provided context."
            },
            {
                "role": "user",
                "content": f"""
Context:
{context}

Question:
{question}
"""
            }
        ]
    )

    return response.choices[0].message.content


def generate_summary(context):

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
    "role": "system",
    "content": """
You are a Research Paper Assistant.

Generate the response in Markdown format.

Use this exact structure:

## Abstract Summary
Write one short paragraph.

## Methodology
- point 1
- point 2
- point 3

## Results
- result 1
- result 2
- result 3

## Key Takeaways
- takeaway 1
- takeaway 2
- takeaway 3

Rules:
- Use bullet points (-), not numbering.
- Keep sections concise.
- Do not leave large blank spaces.
"""
},
            {
                "role": "user",
                "content": context
            }
        ]
    )

    return response.choices[0].message.content