# Live Camera Monitoring with LSTM Panic Detection

## Overview
This implementation adds real-time video monitoring with AI-powered panic detection using LSTM neural networks to your admin dashboard.

## Features Implemented

### Frontend (`frontend/app/admin/monitoring/page.tsx`)
- ✅ **Live Camera Feed**: Real-time video streaming from multiple cameras
- ✅ **LSTM Panic Detection**: Real-time crowd panic analysis with confidence scores
- ✅ **Live Status Indicator**: Visual alerts showing panic/normal status
- ✅ **Multi-Camera Support**: Monitor multiple camera feeds simultaneously
- ✅ **Filter by Status**: Filter cameras by Live/Offline status
- ✅ **Fullscreen View**: Expand any camera feed to fullscreen
- ✅ **Real-time Updates**: 2 FPS continuous inference on video frames
- ✅ **liveEnable Toggle**: Switch between live inference and static view

### Backend

#### New Controllers (`backend/controllers/inferenceController.js`)
- `lstmPanicDetect()`: Process frames and run LSTM model inference
- `getDetectionHistory()`: Retrieve detection history for a camera
- `getDetectionStats()`: Get statistics across time periods
- `clearBuffer()`: Clear temporal buffers for reset

#### New Routes (`backend/routes/inferenceRoutes.js`)
- `POST /api/inference/lstm-panic-detect`: Send frame for inference
- `GET /api/inference/history/:camera_id`: Get detection history
- `GET /api/inference/stats/:event_id`: Get detection statistics
- `DELETE /api/inference/clear-buffer/:camera_id`: Clear buffers

#### WebSocket Handler (`backend/websocket/cameraHandler.js`)
- Real-time camera stream namespace
- Frame and detection broadcasting
- Multi-client support

#### New Models
- **Camera.js**: Store camera configurations and metadata
- **PanicDetection.js**: Store detection results and alerts

### Python Scripts (`model/`)

#### `extract_features.py`
Extracts two key features from video frames:
- **Motion Energy**: Optical flow magnitude using Laplacian
- **Flux of Count**: Crowd density approximation using contour detection

#### `run_inference.py`
Loads the LSTM model and performs panic detection:
- Normalizes temporal features
- Runs LSTM model with 30 time-step sequences
- Returns panic probability and confidence

#### `process_frame.py`
End-to-end frame processing with feature extraction

## Architecture

```
Video Feed (Frontend)
    ↓
Canvas Capture (500ms intervals)
    ↓
Backend API POST /api/inference/lstm-panic-detect
    ↓
Feature Extraction (Motion Energy, Flux of Count)
    ↓
Temporal Buffer (30 time steps)
    ↓
LSTM Model Inference
    ↓
Detection Result + Alert Creation
    ↓
Database Storage (PanicDetection + Alert)
    ↓
Frontend Real-time Update
```

## Setup Instructions

### Backend Setup

1. **Install dependencies**:
```bash
cd backend
npm install
```

2. **Update `.env`**:
```
MONGODB_URI=mongodb://localhost:27017/indra_netra
FRONTEND_URL=http://localhost:3000
PORT=5001
```

3. **Ensure Python dependencies**:
```bash
cd model
pip install tensorflow opencv-python numpy
```

4. **Start the backend**:
```bash
npm start
# or for development
npm run dev
```

### Frontend Setup

1. **Ensure dependencies**:
```bash
cd frontend
npm install
```

2. **Start the frontend**:
```bash
npm run dev
```

## API Endpoints

### POST `/api/inference/lstm-panic-detect`
Send a frame for panic detection

**Request:**
```
multipart/form-data:
- frame: Blob (image/jpeg)
- camera_id: string
- event_id: string
```

**Response:**
```json
{
  "panic_detected": true,
  "confidence": 0.85,
  "timestamp": "2024-01-20T10:30:45.123Z",
  "detection_id": "..."
}
```

### GET `/api/inference/history/:camera_id`
Get detection history for a camera

**Query Parameters:**
- `limit`: Number of results (default: 100)

**Response:**
```json
[
  {
    "_id": "...",
    "cameraId": "cam_001",
    "panicDetected": true,
    "confidence": 0.87,
    "timestamp": "2024-01-20T10:30:45.123Z"
  }
]
```

### GET `/api/inference/stats/:event_id`
Get detection statistics

**Query Parameters:**
- `timeRange`: Time range in milliseconds (default: 3600000 = 1 hour)

**Response:**
```json
[
  {
    "_id": "cam_001",
    "totalDetections": 120,
    "panicDetections": 5,
    "avgConfidence": 0.45,
    "maxConfidence": 0.95
  }
]
```

## Model Details

### LSTM Architecture
```
Input: 30 time steps × 2 features (Motion Energy, Flux of Count)
    ↓
LSTM Layer 1: 64 units, return_sequences=True
    ↓
Dropout: 0.2
    ↓
LSTM Layer 2: 32 units
    ↓
Dropout: 0.2
    ↓
Dense: 16 units, ReLU activation
    ↓
Output: 1 unit, Sigmoid (probability 0-1)
```

### Training Data
- Input: 30 time-step sequences of motion metrics
- Output: Binary classification (Panic/Normal)
- Loss: Binary Crossentropy
- Optimizer: Adam

## Real-time Inference Details

### Temporal Buffering
- Maintains 30-step circular buffer per camera
- Stores motion energy and flux of count
- Automatically shifts data as new frames arrive

### Detection Thresholds
- **Panic Detected**: Confidence > 0.5
- **High Confidence Alert**: Confidence > 0.75
- **Critical Alert**: Confidence > 0.9

### Alert Generation
- Automatically creates Alert records when panic detected
- Prevents duplicate alerts within 10-second window
- Links detection to Alert in database

## Performance Optimization

1. **Frame Sampling**: 2 FPS (500ms intervals) balances accuracy and performance
2. **Memory Efficient**: Canvas-based frame capture with automatic garbage collection
3. **Async Processing**: Non-blocking inference pipeline
4. **Batch Operations**: Efficient database writes using MongoDB bulk operations

## Future Enhancements

- [ ] Multi-frame buffering for increased accuracy
- [ ] Camera stream authentication
- [ ] Advanced alert routing and notifications
- [ ] Historical data visualization and analytics
- [ ] Model retraining pipeline
- [ ] Fallback detection when LSTM unavailable
- [ ] Support for multiple LSTM models per event type

## Troubleshooting

### Python Script Not Found
Ensure model directory structure is correct:
```
model/
├── panic_lstm_model.h5
├── extract_features.py
├── run_inference.py
├── process_frame.py
└── ...
```

### Detection Not Working
1. Check MongoDB connection
2. Verify LSTM model file exists at `model/panic_lstm_model.h5`
3. Check Python environment has TensorFlow installed
4. Review server logs for Python errors

### High Latency
1. Increase frame sampling interval (default 500ms)
2. Reduce canvas resolution
3. Optimize feature extraction
4. Monitor backend CPU/memory usage
