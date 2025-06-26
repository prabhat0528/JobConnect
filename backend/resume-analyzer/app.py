from flask import Flask, request, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader
import os
from dotenv import load_dotenv

from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.output_parsers import StructuredOutputParser, ResponseSchema

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Load Gemini API key
api_key = os.getenv("GEMINI_KEY")

# Setup Gemini LLM
llm = ChatGoogleGenerativeAI(model='gemini-2.0-flash-exp', google_api_key=api_key)

# Define expected structured output
response_schemas = [
    ResponseSchema(name="match_percentage", description="Total keyword match percentage (number)"),
    ResponseSchema(name="ranking", description="Overall ranking of the resume (e.g., Good, Average, Poor)"),
    ResponseSchema(name="keywords", description="List of keyword matches with fields: keyword, present (true/false), and percentage (int)"),
    ResponseSchema(name="suggestions", description="List of suggestions to improve the resume")
]

# Parser to parse structured LLM output
parser = StructuredOutputParser.from_response_schemas(response_schemas)

# Prompt template with escaped JSON structure
prompt = PromptTemplate(
    template="""
You are an expert recruiter. Evaluate the given resume against the job description.

Return the following in JSON format:
{{"match_percentage": number, "ranking": string, "keywords": [{{"keyword": string, "present": bool, "percentage": number}}], "suggestions": [string]}}

Resume:
{resume_text}

Job Description:
{job_description}
""",
    input_variables=["resume_text", "job_description"]
)

# Function to extract text from uploaded PDF
def extract_from_pdf(pdf_file):
    reader = PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text
    return text

# Route to evaluate resume
@app.route('/evaluate', methods=['POST'])
def evaluate_resume():
    try:
        job_description = request.form['job_description']
        resume_file = request.files['resume']
        resume_text = extract_from_pdf(resume_file)

        if not resume_text.strip():
            return jsonify({"error": "Uploaded PDF contains no readable text."}), 400

        # Run prompt -> LLM -> parser chain
        chain = prompt | llm | parser
        result = chain.invoke({
            "resume_text": resume_text,
            "job_description": job_description
        })

        return jsonify({"result": result})

    except Exception as e:
        print("Internal Server Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
