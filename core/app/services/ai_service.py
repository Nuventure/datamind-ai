
import pandas as pd
import numpy as np
import os
import json
from sklearn.ensemble import IsolationForest
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

def load_dataframe(file_path: str) -> pd.DataFrame:
    """
    Loads a file into a Pandas DataFrame. Supports CSV, Excel, and JSON.
    """
    try:
        try:
            df = pd.read_csv(file_path)
            # Basic validation to ensure it's a valid CSV (has columns)
            if df.empty and len(df.columns) == 0:
                 raise ValueError("Empty CSV")
            return df
        except Exception:
            try:
                return pd.read_excel(file_path)
            except Exception:
                try:
                    return pd.read_json(file_path)
                except Exception:
                    raise ValueError("Unsupported file format or unable to read file")
    except Exception as e:
        raise e

def analyze_file(file_path: str) -> dict:
    """
    Orchestrates the analysis of a file.
    Loads the file, extracts metadata, and generates a statistical summary.
    """
    try:
        df = load_dataframe(file_path)

        metadata = extract_metadata(df)
        summary = generate_statistical_summary(df)

        return {
            "metadata": metadata,
            "summary": summary
        }

    except Exception as e:
        print(f"Error analyzing file: {e}")
        raise e

def _query_gemini_json(prompt_text: str):
    """
    Helper function to query Gemini and parse JSON response.
    """
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("GOOGLE_API_KEY or GEMINI_API_KEY not found in environment variables.")
        return None

    try:
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=api_key)
        response = llm.invoke([HumanMessage(content=prompt_text)])
        json_str = response.content.strip()
        
        # Clean up code blocks if present
        if json_str.startswith("```json"):
            json_str = json_str[7:-3]
        elif json_str.startswith("```"):
            json_str = json_str[3:-3]
            
        return json.loads(json_str)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error querying Gemini: {e}")
        return None

def generate_visualization_rules(analysis_result: dict) -> list:
    """
    Uses Google Gemini to generate visualization rules based on the analysis result.
    Returns a list of recommended charts.
    """
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

    result = _query_gemini_json(prompt_text)
    return result if isinstance(result, list) else []

def generate_ai_insights(analysis_result: dict) -> dict:
    """
    Uses Google Gemini to generate a narrative summary, identify trends, 
    and calculate a data quality score based on the analysis result.
    """
    metadata_str = json.dumps(analysis_result.get("metadata", {}), indent=2)
    summary_str = json.dumps(analysis_result.get("summary", {}), indent=2)

    prompt_text = (
        f"You are an expert data analyst. Analyze the following dataset metadata and statistical summary.\n"
        f"Metadata: {metadata_str}\n"
        f"Summary: {summary_str}\n\n"
        f"Generate a comprehensive analysis of this dataset for a dashboard.\n"
        f"Return ONLY a valid JSON object with the following keys:\n"
        f"- 'summary': A 2-3 sentence narrative describing what the dataset is about and its key characteristics. Be professional and insightful.\n"
        f"- 'trends': A list of strings, each describing a notable trend, correlation, or regular pattern you might infer from the stats (e.g., specific ranges, dominant categories). If strict correlations are impossible to know for sure, make reasonable inferences based on the distributions.\n"
        f"- 'data_quality': An object containing:\n"
        f"    - 'score': An integer from 0 to 100 representing the overall health of the data (penalize for missing values).\n"
        f"    - 'alerts': A list of strings describing data quality issues (e.g., '10% missing values in Column X').\n"
        f"- 'stat_highlights': A list of objects to be displayed as a summary table. Each object should have 'label' (e.g., 'Average Churn'), 'value' (e.g., '25%'), and 'insight' (e.g., 'High Risk'). Choose 3-4 most important metrics.\n\n"
        f"Return ONLY the JSON. No markdown."
    )

    result = _query_gemini_json(prompt_text)
    
    if result and isinstance(result, dict):
        return result
    
    return {
        "summary": "Unable to generate insights at this time.",
        "trends": [],
        "data_quality": {"score": 0, "alerts": ["Error generating analysis"]},
        "stat_highlights": []
    }

def detect_anomalies(df: pd.DataFrame) -> dict:
    """
    Detects anomalies in the DataFrame using Isolation Forest.
    Returns a dictionary with indices of anomalies and the anomalous data points.
    Only considers numeric columns for detection.
    """
    # Select only numeric columns
    numeric_df = df.select_dtypes(include=[np.number])
    
    if numeric_df.empty:
        return {"anomalies": [], "count": 0, "message": "No numeric columns found for anomaly detection."}
        
    # Handle missing values by filling with mean (simple imputation for this MVP)
    # IsolationForest does not support NaN values natively in older versions or some implementations
    numeric_df_clean = numeric_df.fillna(numeric_df.mean())
    
    # If still empty (e.g. all NaNs), return empty
    if numeric_df_clean.empty:
         return {"anomalies": [], "count": 0, "message": "Not enough data for anomaly detection."}

    # Initialize Isolation Forest
    # contamination='auto' lets the algorithm determine the threshold
    clf = IsolationForest(contamination='auto', random_state=42)
    
    try:
        # Fit and predict
        # -1 indicates anomaly, 1 indicates normal
        predictions = clf.fit_predict(numeric_df_clean)
        
        # Get indices of anomalies
        # predictions == -1 gives a boolean mask
        anomaly_indices = np.where(predictions == -1)[0]
        
        # Convert to list of standard Python ints for JSON serialization
        anomaly_indices_list = anomaly_indices.tolist()
        
        # Get the actual data points that are anomalous
        # restricting to numeric columns for the response to highlight *why* it might be anomalous statistically
        anomalies_data = df.iloc[anomaly_indices].to_dict(orient='records')
        
        return {
            "anomalies": anomalies_data,
            "indices": anomaly_indices_list,
            "count": len(anomaly_indices_list),
            "message": "Anomaly detection successful."
        }
        
    except Exception as e:
        print(f"Error in anomaly detection: {e}")
        return {"anomalies": [], "count": 0, "message": f"Error during anomaly detection: {str(e)}"}
