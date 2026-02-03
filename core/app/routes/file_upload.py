import os
import uuid
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse, FileResponse
from app.services.file_upload_service import save_uploaded_file, get_uploaded_files, get_file_columns
import pandas as pd

router = APIRouter()

UPLOAD_DIR = "app/uploads"

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    """
    Generate a unique filename: data-sheet-<uuid> and add it into db and folder[apps/uploads]
    """
    unique_filename = f"data-sheet-{uuid.uuid4().hex[:8]}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Save the uploaded file content to disk
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # Save filename to DB
    save_uploaded_file(unique_filename)


    return JSONResponse(
        content={
            "message": "File uploaded successfully",
            "file_name": unique_filename
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
