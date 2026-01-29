import os
import uuid
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from app.services.file_upload_service import save_uploaded_file

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
