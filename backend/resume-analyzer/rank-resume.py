from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import PyPDF2
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain_core.prompts import PromptTemplate

# Load environment variables
load_dotenv()
api_key = os.getenv("GEMINI_KEY")

app = Flask(__name__)
CORS(app)  # Allow CORS for all origins (adjust if needed)

# Initialize LLM
llm = ChatGoogleGenerativeAI(model='gemini-2.0-flash-exp', google_api_key=api_key)

# Define schema and parser
response_schema = [
    ResponseSchema(name="matching_percent", description="Return the keyword matching percentage from the text"),
    ResponseSchema(name="Email", description="Return the email extracted from the resume text"),
    ResponseSchema(name="Name", description="Return the person name from the extracted text")
]
parser = StructuredOutputParser.from_response_schemas(response_schema)

# Define prompt template
prompt_template = PromptTemplate(
    template="""
Act as a professional recruiter who ranks resumes based on keyword matching from the job description. 
Parse the keyword matching from the resume text: {extracted_text} and job description: {job_description}. 
Return the result in the following JSON format: 
{{"matching_percent": number, "Email": string, "Name": string}}
""",
    input_variables=["extracted_text", "job_description"]
)

# Compose the chain
chain = prompt_template | llm | parser

# PDF text extractor helper
def extract_text_from_pdf(file):
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

# Analyze resume endpoint
@app.route('/analyze', methods=['POST'])
def analyze_resume():
    try:
        file = request.files.get('resume')
        job_description = request.form.get('job_description')

        if not file or not job_description:
            return jsonify({"error": "Missing resume file or job description"}), 400

        # Reset file pointer to start (important!)
        file.seek(0)

        filename_lower = file.filename.lower()
        if filename_lower.endswith(".pdf"):
            extracted_text = extract_text_from_pdf(file)
        elif filename_lower.endswith(".txt"):
            extracted_text = file.read().decode("utf-8")
        else:
            return jsonify({"error": "Unsupported file format"}), 400

        # Run LangChain LLM chain to get structured output
        result = chain.invoke({
            "extracted_text": extracted_text,
            "job_description": job_description
        })

        return jsonify(result), 200

    except Exception as e:
        print("Error in analyze_resume:", e)
        return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
