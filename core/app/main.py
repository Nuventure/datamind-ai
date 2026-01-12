from fastapi import FastAPI
from app.routes import file_upload

app = FastAPI(root_path="/datamind_ai")
app.include_router(file_upload.router, prefix="/sheets", tags=["File Upload"])

