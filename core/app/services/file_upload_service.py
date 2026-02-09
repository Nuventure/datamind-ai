from app.config import db
import os
import pandas as pd
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

load_dotenv()

UPLOAD_DIR = "app/uploads"

def save_uploaded_file(filename: str):
    """
    store the file like data-sheet-<uuid>
    """
    document = {
        "file_path": filename  
    }
    db.uploaded_files.insert_one(document)
    return document

def update_file_analysis(filename: str, analysis_result: dict, status: str = "completed"):
    """
    Updates the file record with analysis results.
    """
    if db is None:
        raise ConnectionError("Database connection is not available")
    
    try:
        result = db.uploaded_files.update_one(
            {"file_path": filename},
            {
                "$set": {
                    "analysis": analysis_result,
                    "status": status,
                    "processed_at": pd.Timestamp.now().isoformat()
                }
            }
        )
        if result.matched_count == 0:
            print(f"Warning: No document found with file_path: {filename}")
        return result
    except Exception as e:
        print(f"Database error updating file analysis: {e}")
        raise


def get_uploaded_files(filename: str = None):
    """
    Get uploaded files from DB
    """
    query = {}
    if filename:
        query["file_path"] = filename

    # Exclude _id to avoid serialization issues
    files = list(db.uploaded_files.find(query, {"_id": 0}))
    return files

def get_file_columns(filename: str):
    """
    Get column names from the uploaded CSV file
    """
    full_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(full_path):
        return []

    try:
        df = pd.read_csv(full_path, nrows=0)
        columns = list(df.columns)
        
        # AI Filtering
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            return columns # Fallback to all columns if no key

        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=api_key)
        prompt_text = (
            f"Analyze the following list of parameters (columns): {columns}\n\n"
            f"1. Identify which ones are related to 'Water Quality'.\n"
            f"2. For each identified parameter, provide the globally accepted ideal values (min, max, ideal).\n\n"
            f"Return ONLY a valid JSON object where keys are the parameter names and values are objects containing 'min', 'max', 'ideal', and 'unit'.\n"
            f"Example: {{ \"pH\": {{ \"min\": 6.5, \"max\": 8.5, \"ideal\": 7.0, \"unit\": \"\" }} }}\n"
            f"Do not include markdown formatting.\n"
        )
        
        try:
            response = llm.invoke([HumanMessage(content=prompt_text)])
            json_str = response.content.strip()
            if json_str.startswith("```json"):
                json_str = json_str[7:-3]
            elif json_str.startswith("```"):
                 json_str = json_str[3:-3]
            
            # This is a dict {"param": {...}}
            filtered_data = json.loads(json_str)
            return filtered_data
            
        except Exception as ai_e:
            print(f"AI Filtering Error: {ai_e}")
            # Fallback: return structure with empty values? Or just list?
            # User expectation is JSON with values. If AI fails, we might just return the list as keys with null values?
            # Let's return a simple dict for all columns to match type if possible, or just the list and let the frontend handle fallback.
            # But the route expects "columns".
            # Let's return the original list if AI fails, client will see list instead of dict.
            return columns

    except Exception as e:
        print(f"Error reading file columns: {e}")
        return []
