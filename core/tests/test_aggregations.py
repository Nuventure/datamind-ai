import requests
import pandas as pd
import numpy as np
import io
import json

# Setup synthetic data
data = {
    'Category': ['A', 'A', 'B', 'B', 'C', 'C'] * 10,
    'Value': np.random.randint(1, 100, 60),
    'Month': ['Jan', 'Feb'] * 30
}
df = pd.DataFrame(data)

# Save to in-memory CSV
csv_buffer = io.StringIO()
df.to_csv(csv_buffer, index=False)
csv_content = csv_buffer.getvalue()

# URL
BASE_URL = "http://localhost:8000"

def test_aggregations():
    print("1. Uploading File...")
    files = {'file': ('test_aggregations.csv', csv_content, 'text/csv')}
    upload_resp = requests.post(f"{BASE_URL}/sheets/upload-file", files=files)
    
    if upload_resp.status_code != 200:
        print(f"Upload failed: {upload_resp.text}")
        return

    filename = upload_resp.json()['file_name']
    print(f"File uploaded: {filename}")

    # 2. Get Suggested Rules
    print("\n2. Getting Suggested Rules...")
    url_suggest = f"{BASE_URL}/analysis/{filename}/aggregations/suggest"
    resp_suggest = requests.post(url_suggest)
    
    if resp_suggest.status_code == 200:
        suggestions = resp_suggest.json().get('rules', [])
        print(f"Received {len(suggestions)} suggestions.")
        if suggestions:
            print(f"First suggestion: {json.dumps(suggestions[0], indent=2)}")
    else:
        print(f"Failed to get suggestions: {resp_suggest.text}")

    # 3. Execute a Specific Rule
    print("\n3. Executing a Manual Rule...")
    # We want to group by Category and get mean Value
    rule = {
        "title": "Test Rule",
        "group_by": ["Category"],
        "aggregations": {"Value": "mean"},
        "description": "Mean value per category"
    }
    
    url_exec = f"{BASE_URL}/analysis/{filename}/aggregations/execute"
    resp_exec = requests.post(url_exec, json=rule)
    
    if resp_exec.status_code == 200:
        result = resp_exec.json()
        print("Execution Success!")
        print(f"Count: {result['count']}")
        print(f"Data Sample: {json.dumps(result['data'][:3], indent=2)}")
        
        # Verify correctness
        expected_mean_A = df[df['Category'] == 'A']['Value'].mean()
        # Find result for A
        res_A = next((item for item in result['data'] if item['Category'] == 'A'), None)
        if res_A and abs(res_A['Value'] - expected_mean_A) < 0.001:
             print("SUCCESS: Aggregation result matches expected Pandas calculation.")
        else:
             print(f"FAILURE: Expected {expected_mean_A}, got {res_A['Value'] if res_A else 'None'}")

    else:
        print(f"Execution Failed: {resp_exec.text}")

if __name__ == "__main__":
    test_aggregations()
