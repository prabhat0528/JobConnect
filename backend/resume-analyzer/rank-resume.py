from flask import Flask, request, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader
import os
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain_core.prompts import PromptTemplate

# Load environment variables
load_dotenv()
api_key = os.getenv("GEMINI_KEY")

app = Flask(__name__)

#  CORS setup
CORS(
    app,
    origins=["https://jobconnect-hub.onrender.com"],  
    supports_credentials=True,                        
)

# Initialize Gemini LLM
llm = ChatGoogleGenerativeAI(model='gemini-2.0-flash-exp', google_api_key=api_key)

# Schema for /evaluate endpoint
evaluate_schema = [
    ResponseSchema(name="match_percentage", description="Total keyword match percentage (number)"),
    ResponseSchema(name="ranking", description="Overall ranking of the resume (e.g., Good, Average, Poor)"),
    ResponseSchema(name="keywords", description="List of keyword matches with fields: keyword, present (true/false), and percentage (int)"),
    ResponseSchema(name="suggestions", description="List of suggestions to improve the resume")
]
evaluate_parser = StructuredOutputParser.from_response_schemas(evaluate_schema)

evaluate_prompt = PromptTemplate(
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

# Schema for /analyze endpoint
analyze_schema = [
    ResponseSchema(name="matching_percent", description="Return the keyword matching percentage from the text"),
    ResponseSchema(name="Email", description="Return the email extracted from the resume text"),
    ResponseSchema(name="Name", description="Return the person name from the extracted text")
]
analyze_parser = StructuredOutputParser.from_response_schemas(analyze_schema)

analyze_prompt = PromptTemplate(
    template="""
Act as a professional recruiter who ranks resumes based on keyword matching from the job description. 
Parse the keyword matching from the resume text: {extracted_text} and job description: {job_description}. 
Return the result in the following JSON format: 
{{"matching_percent": number, "Email": string, "Name": string}}
""",
    input_variables=["extracted_text", "job_description"]
)

# LangChain Chains
evaluate_chain = evaluate_prompt | llm | evaluate_parser
analyze_chain = analyze_prompt | llm | analyze_parser

# PDF text extractor
def extract_text_from_pdf(file):
    reader = PdfReader(file)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text
    return text

# /evaluate route
@app.route('/evaluate', methods=['POST'])
def evaluate_resume():
    try:
        job_description = request.form.get('job_description')
        resume_file = request.files.get('resume')
        
        if not resume_file or not job_description:
            return jsonify({"error": "Missing resume file or job description"}), 400

        resume_text = extract_text_from_pdf(resume_file)

        if not resume_text.strip():
            return jsonify({"error": "Uploaded PDF contains no readable text."}), 400

        result = evaluate_chain.invoke({
            "resume_text": resume_text,
            "job_description": job_description
        })

        return jsonify({"result": result})

    except Exception as e:
        print("Internal Server Error:", str(e))
        return jsonify({"error": str(e)}), 500

# /analyze route
@app.route('/analyze', methods=['POST'])
def analyze_resume():
    try:
        file = request.files.get('resume')
        job_description = request.form.get('job_description')

        if not file or not job_description:
            return jsonify({"error": "Missing resume file or job description"}), 400

        file.seek(0)
        filename_lower = file.filename.lower()

        if filename_lower.endswith(".pdf"):
            extracted_text = extract_text_from_pdf(file)
        elif filename_lower.endswith(".txt"):
            extracted_text = file.read().decode("utf-8")
        else:
            return jsonify({"error": "Unsupported file format"}), 400

        if not extracted_text.strip():
            return jsonify({"error": "Resume contains no readable text"}), 400

        result = analyze_chain.invoke({
            "extracted_text": extracted_text,
            "job_description": job_description
        })

        return jsonify(result), 200

    except Exception as e:
        print("Error in analyze_resume:", e)
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0', debug=True)
