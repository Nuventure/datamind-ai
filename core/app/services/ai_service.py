
import pandas as pd
import numpy as np
import os
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

load_dotenv()

def extract_metadata(df: pd.DataFrame) -> dict:
    """
    Extracts metadata from the DataFrame, including column names and data types.
    """
    metadata = {}
    for col in df.columns:
        metadata[col] = str(df[col].dtype)
    return metadata

def generate_statistical_summary(df: pd.DataFrame) -> dict:
    """
    Generates a statistical summary for each column in the DataFrame.
    Includes count, mean, std, min, 25%, 50%, 75%, max for numeric columns.
    Includes count, unique, top, freq for object columns.
    Also calculates missing values and unique value counts for all columns.
    """
    summary = {}
    
    # improved description that handles both numeric and object types
    desc = df.describe(include='all').to_dict()
    
    for col in df.columns:
        col_summary = {}
        
        # Add basic stats from describe()
        # Filter out NaN values from the description
        if col in desc:
            for k, v in desc[col].items():
                if pd.notna(v):
                    col_summary[k] = v
        
        # Add additional stats
        col_summary['missing_values'] = int(df[col].isnull().sum())
        col_summary['unique_values'] = int(df[col].nunique())
        
        # Add sample values (top 5 unique)
        try:
            col_summary['samples'] = df[col].dropna().unique()[:5].tolist()
        except Exception:
             col_summary['samples'] = []

        summary[col] = col_summary
        
    return summary

def analyze_file(file_path: str) -> dict:
    """
    Orchestrates the analysis of a file.
    Loads the file, extracts metadata, and generates a statistical summary.
    """
    try:
        # Try reading as different formats since file extension might be missing
        try:
            df = pd.read_csv(file_path)
            # Basic validation to ensure it's a valid CSV (has columns)
            if df.empty and len(df.columns) == 0:
                 raise ValueError("Empty CSV")
        except Exception:
            try:
                df = pd.read_excel(file_path)
            except Exception:
                try:
                    df = pd.read_json(file_path)
                except Exception:
                    raise ValueError("Unsupported file format or unable to read file")

        metadata = extract_metadata(df)
        summary = generate_statistical_summary(df)

        return {
            "metadata": metadata,
            "summary": summary
        }

    except Exception as e:
        print(f"Error analyzing file: {e}")
        raise e

def generate_visualization_rules(analysis_result: dict) -> list:
    """
    Uses Google Gemini to generate visualization rules based on the analysis result.
    Returns a list of recommended charts.
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("GEMINI_API_KEY not found in environment variables.")
        return []

    try:
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=api_key)
        
        metadata_str = json.dumps(analysis_result.get("metadata", {}), indent=2)
        summary_str = json.dumps(analysis_result.get("summary", {}), indent=2)

        prompt_text = (
            f"You are an expert data analyst. Analyze the following dataset metadata and statistical summary.\n"
            f"Metadata: {metadata_str}\n"
            f"Summary: {summary_str}\n\n"
            f"Suggest 3 to 5 insightful visualizations that would help a user understand this data.\n"
            f"For each visualization, provide a JSON object with the following keys:\n"
            f"- 'type': The type of chart (e.g., 'bar', 'line', 'scatter', 'pie', 'histogram').\n"
            f"- 'title': A descriptive title for the chart.\n"
            f"- 'x': The column name for the X-axis.\n"
            f"- 'y': The column name for the Y-axis (if applicable).\n"
            f"- 'description': A specific insight or analysis of the data based on the provided statistics (e.g., mention range, central tendency, or specific patterns observed), not just a generic description of the chart type.\n\n"
            f"Return ONLY a valid JSON list of these objects. Do not include markdown formatting or explanations outside the JSON."
        )

        response = llm.invoke([HumanMessage(content=prompt_text)])
        json_str = response.content.strip()
        
        # Clean up code blocks if present
        if json_str.startswith("```json"):
            json_str = json_str[7:-3]
        elif json_str.startswith("```"):
            json_str = json_str[3:-3]
            
        rules = json.loads(json_str)
        return rules
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error generating visualization rules: {e}")
        return []
