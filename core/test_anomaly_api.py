import requests
import pandas as pd
import numpy as np
import io

# Setup synthetic data with a clear anomaly
data = {
    'id': range(1, 101),
    'value': [10 + np.random.normal(0, 1) for _ in range(99)] + [1000] # 1000 is the anomaly
}
df = pd.DataFrame(data)

# Save to in-memory CSV
csv_buffer = io.StringIO()
df.to_csv(csv_buffer, index=False)
csv_content = csv_buffer.getvalue()

# URL
BASE_URL = "http://localhost:8000"

def test_anomaly_detection():
    # 1. Upload File
    files = {'file': ('test_anomalies.csv', csv_content, 'text/csv')}
    upload_resp = requests.post(f"{BASE_URL}/sheets/upload-file", files=files)
    
    if upload_resp.status_code != 200:
        print(f"Upload failed: {upload_resp.text}")
        return

    filename = upload_resp.json()['file_name']
    print(f"File uploaded: {filename}")

    # 2. Trigger Anomaly Detection
    url = f"{BASE_URL}/analysis/{filename}/anomalies"
    resp = requests.post(url)
    
    if resp.status_code == 200:
        result = resp.json()
        print("Anomaly Detection Success!")
        print(f"Message: {result['message']}")
        print(f"Count: {result['count']}")
        print(f"Anomaly Indices: {result['indices']}")
        
        # Verify the last index (99) is detected
        if 99 in result['indices']:
             print("SUCCESS: The known anomaly (index 99) was detected.")
        else:
             print("FAILURE: The known anomaly was NOT detected.")
             print(f"Detected anomalies: {result['anomalies']}")

    else:
        print(f"Anomaly Detection Failed: {resp.status_code} - {resp.text}")

if __name__ == "__main__":
    test_anomaly_detection()
