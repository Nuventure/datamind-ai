import os
import uuid
from fastapi import APIRouter, UploadFile, File, BackgroundTasks
from fastapi.responses import JSONResponse, FileResponse
from app.services.file_upload_service import save_uploaded_file, get_uploaded_files, get_file_columns, update_file_analysis
from app.services.ai_service import analyze_file



router = APIRouter()

UPLOAD_DIR = "app/uploads"

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

def process_file_background(filename: str, file_path: str):
    """
    Background task to analyze file.
    """
    try:
        print(f"Starting background analysis for {filename}...")
        
        # Analyze file (Metadata + Stats)
        analysis_result = analyze_file(file_path)

        # Update DB
        update_file_analysis(filename, analysis_result)
        print(f"Background analysis completed for {filename}.")
        
    except Exception as e:
        print(f"Error in background processing for {filename}: {e}")
        update_file_analysis(filename, {"error": str(e)}, status="failed")

@router.post("/upload-file")
async def upload_file(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """
    Generate a unique filename: data-sheet-<uuid> and add it into db and folder[apps/uploads]
    Triggers background analysis.
    """
    # Preserve original extension
    file_ext = os.path.splitext(file.filename)[1] if file.filename else ""
    unique_filename = f"data-sheet-{uuid.uuid4().hex[:8]}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Check file size (approximate by reading into memory - careful with RAM)
    # Better: read chunks and write.
    file_size = 0
    with open(file_path, "wb") as f:
        while chunk := await file.read(1024 * 1024):  # Read in 1MB chunks
            file_size += len(chunk)
            f.write(chunk)

    # Save filename to DB (initial record)
    save_uploaded_file(unique_filename)
    
    # Add background task
    background_tasks.add_task(process_file_background, unique_filename, file_path)

    # Determine response message based on size
    # Threshold: 5MB = 5 * 1024 * 1024 bytes
    LARGE_FILE_THRESHOLD = 5 * 1024 * 1024 
    
    message = "File uploaded successfully"
    if file_size > LARGE_FILE_THRESHOLD:
        message = "File uploaded. Large file detected, analysis running in background."

    return JSONResponse(
        content={
            "message": message,
            "file_name": unique_filename,
            "file_size_bytes": file_size,
            "background_analysis": "started"
        },
        status_code=200
    )
@router.get("/get-files")
def get_files(filename: str = None):
    """
    Fetch all uploaded files
    """
    files = get_uploaded_files(filename)
    return JSONResponse(content={"files": files}, status_code=200)

@router.get("/download-file/{filename}")
def download_file(filename: str):
    """
    Download a file by its filename
    """
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    if not os.path.exists(file_path):
        return JSONResponse(content={"message": "File not found"}, status_code=404)
        
    return FileResponse(path=file_path, filename=filename, media_type='application/octet-stream')


@router.get("/get-columns")
def get_columns(filename: str):
    """
    Get column names of the uploaded file
    """
    columns = get_file_columns(filename)
    if not columns:
         return JSONResponse(content={"error": "File not found or unreadable"}, status_code=404)
         
    return JSONResponse(content={"columns": columns}, status_code=200)
