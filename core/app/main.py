from fastapi import FastAPI
from app.routes import file_upload, data_analysis

app = FastAPI(root_path="/datamind_ai")
app.include_router(file_upload.router, prefix="/sheets", tags=["File Upload"])
app.include_router(data_analysis.router, tags=["Data Analysis"])

