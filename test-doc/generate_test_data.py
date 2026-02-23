import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_iot_sensor_data(num_records=1000, output_file="iot_sensor_data.csv"):
    """
    Generates realistic IoT sensor data with injected anomalies.
    """
    np.random.seed(42)  # For reproducibility

    # 1. Generate Timestamps (1 minute intervals)
    start_time = datetime(2023, 1, 1, 0, 0, 0)
    timestamps = [start_time + timedelta(minutes=i) for i in range(num_records)]

    # 2. Generate Device IDs (3 machines)
    devices = ['Machine_A', 'Machine_B', 'Machine_C']
    device_ids = np.random.choice(devices, num_records)

    # 3. Generate Normal Data Patterns
    
    # Temperature: Baseline around 70C with some noise
    temperature = np.random.normal(70, 5, num_records)
    
    # Pressure: Baseline around 120 PSI
    pressure = np.random.normal(120, 10, num_records)
    
    # Vibration: Baseline around 1.5 mm/s
    vibration = np.random.normal(1.5, 0.2, num_records)
    
    # Status (Operational, Warning, Critical) based loosely on conditions
    status = np.full(num_records, "Operational")

    # 4. Inject Anomalies to make it interesting for the AI to find

    # Anomaly 1: Machine B overheats
    # Around index 300 to 350, Machine B temp spikes
    spike_indices = np.where((device_ids == 'Machine_B') & (np.arange(num_records) > 300) & (np.arange(num_records) < 350))[0]
    temperature[spike_indices] += np.random.normal(20, 5, len(spike_indices))
    status[spike_indices] = "Warning"

    # Anomaly 2: Machine C pressure drop and vibration spike (predicting failure)
    # Around index 700 to 720
    failure_indices = np.where((device_ids == 'Machine_C') & (np.arange(num_records) > 700) & (np.arange(num_records) < 720))[0]
    pressure[failure_indices] -= np.random.normal(40, 5, len(failure_indices))
    vibration[failure_indices] += np.random.normal(3.0, 0.5, len(failure_indices))
    status[failure_indices] = "Critical"
    
    # Anomaly 3: Machine A Random Sensor Glitch
    # A single massive outlier
    glitch_index = 500
    if device_ids[glitch_index] == 'Machine_A':
        temperature[glitch_index] = 150
        vibration[glitch_index] = 0.1
    else:
        # ensure machine A has a glitch somewhere
        a_indices = np.where(device_ids == 'Machine_A')[0]
        if len(a_indices) > 0:
            glitch_idx = a_indices[len(a_indices)//2]
            temperature[glitch_idx] = 150
            vibration[glitch_idx] = 0.1

    # 5. Create DataFrame
    df = pd.DataFrame({
        'Timestamp': timestamps,
        'DeviceID': device_ids,
        'Temperature_C': temperature.round(2),
        'Pressure_PSI': pressure.round(2),
        'Vibration_mms': vibration.round(2),
        'Status': status
    })

    # Save to CSV
    df.to_csv(output_file, index=False)
    print(f"✅ Generated {num_records} rows of test data at: {output_file}")
    print(f"File contains data for {len(devices)} machines with injected anomalies.")

if __name__ == "__main__":
    generate_iot_sensor_data(num_records=1500, output_file="test-doc/iot_sensor_data.csv")
