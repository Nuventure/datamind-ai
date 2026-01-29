# 📐 DataMind AI - Technical Specifications

This document outlines the detailed architecture, data schemas, and component designs for DataMind AI. Contributors should use this as the primary reference when implementing features.

## 1. 📡 API Contracts

### Data Analysis Endpoint
**POST** `/ai/analyze`
- **Input**: `{"filename": "data-uuid.csv"}`
- **Output Schema**:
```json
{
  "summary": {
    "columns": ["Date", "Temperature", "Vibration"],
    "dtypes": {"Date": "datetime", "Temperature": "float"},
    "shape": [1000, 3],
    "summary_stats": { ... },
    "null_counts": { ... }
  },
  "config": {
    "title": "Temperature Trends over Time",
    "chart_type": "line",
    "aggregation": {
      "groupby": "Date",
      "function": "mean",
      "column": "Temperature"
    },
    "anomaly_detection": {
      "column": "Temperature",
      "method": "isolation_forest",
      "threshold": 0.05
    },
    "key_insights": [
      "Temperature spikes correlate with high Vibration."
    ]
  },
  "data": [
    // Aggregated data points for the chart
    {"Date": "2023-01-01", "Temperature": 45.2},
    {"Date": "2023-01-02", "Temperature": 46.1}
  ],
  "anomalies": [
    // Raw rows identified as anomalies
    {"Date": "2023-01-15", "Temperature": 89.5, "Vibration": 10.2}
  ]
}
```

## 2. 💻 Frontend Architecture (React + Zustand)

### State Management (`useDashboardStore`)
We use Zustand to manage the analysis state globally.
```typescript
interface DashboardState {
  isLoading: boolean;
  analysisResult: AnalysisResult | null;
  analyzeFile: (filename: string) => Promise<void>;
  reset: () => void;
}
```

### Component Hierarchy
1. **`DashboardPage`**: Main container.
   - **`FileUploader`**: Handles file selection and upload API.
   - **`SummaryCard`**: Displays shape, columns, and data health (nulls).
   - **`InsightsPanel`**: Renders the AI-generated textual insights.
   - **`MainChart`**: container for the dynamic visualization.
     - **`ChartRenderer`**: A generic wrapper around Recharts.
   - **`AnomalyFeed`**: A scrolling list/table of detected anomalies.

### Reusable Components
#### `ChartRenderer`
A "smart" component that takes the `config` object and renders the appropriate Recharts component.
- **Props**: `{ data: any[], type: 'bar' | 'line' | 'pie', xKey: string, yKey: string }`
- **Logic**:
  - If `type === 'bar'`, render `<BarChart>`.
  - If `type === 'line'`, render `<LineChart>`.
  - Auto-assign colors from a theme palette.

## 3. 🧠 AI & Backend Logic

### Hybrid Analysis Pipeline
1. **Ingest**: Load DataFrame via Pandas.
2. **Profile**: Calculate metadata (Types, Min/Max, Mean, Nulls).
3. **Decide (AI)**: Send *Profile* + *Small Sample* to LLM.
   - Ask for: Aggregation Rule, Visualization Type, Anomaly Strategy.
4. **Execute (Python)**:
   - Apply specific `groupby` and `agg` operations dynamically.
   - Run `sklearn.ensemble.IsolationForest` on the requested column.
5. **Serve**: Return reduced JSON payload.

### Anomaly Detection Strategies
- **Z-Score**: Best for normal distributions. Simple threshold (e.g., > 3 std devs).
- **Isolation Forest**: Best for multi-dimensional or non-linear anomalies.

## 4. 🔮 Future Roadmap & Agentic Workflows
- [ ] **Conversational Analyst (LangGraph)**:
    - Currently, we use a linear router (Input -> LLM -> Rule -> Output).
    - *Future Upgrade*: Implement **LangGraph** to support multi-turn conversations.
        - Example: User asks "Why is the vibration high?", Agent queries the dataframe again, finds correlations, and responds.
        - *Benefit*: Cyclic loops for self-correction and deep-diving into data.
- [ ] **Streaming Support**: WebSockets for real-time IoT data.
- [ ] **Plugin System**: Allow users to write custom Python analysis scripts.
- [ ] **Export**: PDF Reports including charts and insights.
