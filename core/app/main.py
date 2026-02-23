from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import file_upload, data_analysis

app = FastAPI(root_path="/datamind_ai")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(file_upload.router, prefix="/sheets", tags=["File Upload"])
app.include_router(data_analysis.router, tags=["Data Analysis"])

