from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.services.ai_service import analyze_file, generate_visualization_rules, generate_ai_insights
import os

router = APIRouter()

UPLOAD_DIR = "app/uploads"

@router.post("/analysis/{filename}")
def analyze_file_endpoint(filename: str):
    """
    Triggers the AI analysis for a specific uploaded file.
    Extracts metadata and statistical summary.
    """
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    try:
        analysis_result = analyze_file(file_path)
        return JSONResponse(content=analysis_result, status_code=200)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analysis/{filename}/rules")
def generate_rules_endpoint(filename: str):
    """
    Triggers the LLM to generate visualization rules based on the file analysis.
    """
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    try:
        # First, analyze the file to get stats
        analysis_result = analyze_file(file_path)
        
        # Then, generate rules based on stats
        rules = generate_visualization_rules(analysis_result)
        
        return JSONResponse(content={"rules": rules}, status_code=200)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analysis/{filename}/insights")
def generate_insights_endpoint(filename: str):
    """
    Triggers the LLM to generate narrative insights, trends, and quality scores.
    """
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    try:
        # First, analyze the file to get stats
        analysis_result = analyze_file(file_path)
        
        # Then, generate insights based on stats
        insights = generate_ai_insights(analysis_result)
        
        return JSONResponse(content=insights, status_code=200)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
