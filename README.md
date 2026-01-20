# DataMind AI

**DataMind AI** is an open-source project dedicated to building an intelligent, dynamic dashboard for IoT data analysis. It leverages Generative AI to automatically summarize datasets, detect anomalies, predict machine failures, and generate beautiful, interactive visualizations.

## 🚀 Project Vision

We aim to solve the problem of visualizing and understanding large IoT datasets without manual configuration. By combining high-performance data processing (Pandas/Scikit-Learn) with the contextual intelligence of LLMs (Google Gemini), DataMind AI transforms raw CSV/Excel sheets into actionable insights.

## 🏗 Architecture

The project follows a modern decoupled architecture:

### **Backend (`core/`)**
- **Framework**: FastAPI (Python)
- **Data Processing**: Pandas & Scikit-Learn
    - *Hybrid Approach*: We don't send massive datasets to the LLM. Instead, we extract metadata and statistical summaries locally.
    - **Logic**: The LLM acts as the "Brain" to define aggregation rules and anomaly detection parameters, while the Python backend acts as the "Muscle" to execute these rules on the full dataset.
- **AI Integration**: Google Gemini (via `google-generativeai`)
- **Database**: MongoDB (for storing file metadata and results)

### **Frontend (`ui/`)**
- **Framework**: React + Vite
- **Styling**: TailwindCSS
- **Visualization**: Recharts (Dynamic rendering based on JSON config)
- **State Management**: Zustand

## 🌟 Key Features

### 1. 🧠 Smart Data Ingestion
- **Universal Support**: Drag-and-drop support for CSV, Excel (`.xlsx`), and JSON files.
- **Large File Handling**: Optimized to handle gigabyte-sized datasets by processing data locally using Pandas/Polars and only sending metadata to the cloud.

### 2. 🤖 AI-Driven Aggregation (The "Brain")
- **Contextual Understanding**: Gemini AI analyzes your column headers and data types to understand *what* your data represents (e.g., "This looks like IoT sensor data").
- **Auto-Rule Generation**: Instead of generic charts, the AI generates specific Pandas aggregation rules (e.g., "Group by `DeviceID` and calculate average `Temperature`") to reveal hidden patterns.

### 3. 🔍 Anomaly Detection & Predictive Maintenance
- **Statistical Rigor**: Uses Isolation Forests and Z-Score analysis to mathematically identify outliers.
- **Context-Aware Alerts**: The AI interprets *why* a data point is an anomaly (e.g., "Pressure dropped by 40% in 5 minutes") and suggests potential root causes.
- **Failure Prediction**: Aims to identify trendlines that historically precede machine failures.

### 4. 📊 Dynamic "Self-Constructing" Dashboard
- **Zero-Config**: You don't build charts; the AI builds them for you.
- **Interactive UI**: Fully responsive Recharts visualizations that support zooming, panning, and tooltips.

## 🐛 Issues & Feature Requests
Found a bug? Want to request a new feature?
1. Check the [TODO.md](./TODO.md) to see if it's already planned.
2. Open a **GitHub Issue** with a clear title and description.
3. We welcome detailed bug reports!

## 🤝 Contribution & Status

This is a community-driven project. check [TODO.md](./TODO.md) to see the progress and open tasks.

## 🛠️ Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB

### Backend Setup
1. **Navigate to the core directory**:
   ```bash
   cd core
   ```
2. **Install dependencies**:
   ```bash
   poetry install
   ```
3. **Configure Environment Variables**:
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and add your keys:
     - `MONGO_URI`: Your MongoDB connection string.


4. **Run the Server**:
   ```bash
   poetry run uvicorn app.main:app --reload
   ```

### Frontend Setup
```bash
cd ui
npm install
npm run dev
```

## 📜 License
MIT
