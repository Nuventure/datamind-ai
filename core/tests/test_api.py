
from fastapi.testclient import TestClient
from app.main import app
import os
import shutil
import pytest

client = TestClient(app)

TEST_UPLOAD_DIR = "app/uploads"
TEST_FILENAME = "test_analysis_no_ext"
TEST_FILE_PATH = os.path.join(TEST_UPLOAD_DIR, TEST_FILENAME)

@pytest.fixture(autouse=True)
def setup_and_teardown():
    # Setup: Create a dummy CSV file
    os.makedirs(TEST_UPLOAD_DIR, exist_ok=True)
    with open(TEST_FILE_PATH, "w") as f:
        f.write("col1,col2\n1,a\n2,b\n3,c")
    
    yield
    
    # Teardown: Remove the dummy file
    if os.path.exists(TEST_FILE_PATH):
        os.remove(TEST_FILE_PATH)

def test_analyze_file_endpoint():
    response = client.post(f"/datamind_ai/analysis/{TEST_FILENAME}")
    assert response.status_code == 200
    data = response.json()
    
    assert "metadata" in data
    assert "summary" in data
    assert data["metadata"]["col1"] == "int64"
    assert data["summary"]["col1"]["mean"] == 2.0

def test_analyze_file_endpoint_not_found():
    response = client.post("/datamind_ai/analysis/non_existent_file.csv")
    assert response.status_code == 404
