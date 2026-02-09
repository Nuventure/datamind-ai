
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
import os
import time

# Create a dummy CSV for testing
TEST_CSV_CONTENT = """id,value
1,10
2,12
3,11
4,1000
5,13
"""

@pytest.mark.asyncio
async def test_upload_and_background_analysis():
    filename = "test_data.csv"
    with open(filename, "w") as f:
        f.write(TEST_CSV_CONTENT)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        files = {'file': (filename, open(filename, 'rb'), 'text/csv')}
        response = await ac.post("/sheets/upload-file", files=files)
        
    assert response.status_code == 200
    data = response.json()
    assert "background_analysis" in data
    assert data["background_analysis"] == "started"
    
    unique_filename = data["file_name"]
    
    # Wait for background task to complete (basic sleep for manual verification script)
    # In a real test, we might check DB or mock
    print(f"\nUploaded: {unique_filename}. Waiting for background task...")
    
    # Clean up
    if os.path.exists(filename):
        os.remove(filename)

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_upload_and_background_analysis())
