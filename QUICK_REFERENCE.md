# Quick Reference Card

## 🚀 Start Everything

```bash
# Terminal 1: Backend
cd backend && npm run dev
# Starts on http://localhost:5001

# Terminal 2: Frontend  
cd frontend && npm run dev
# Starts on http://localhost:3000

# Terminal 3: MongoDB (if not running)
mongod

# Terminal 4: Python environment
cd model
python --version  # Verify 3.8+
```

## 🎯 Access Points

| Component | URL | Purpose |
|-----------|-----|---------|
| **Admin Dashboard** | http://localhost:3000/admin/monitoring | Live monitoring |
| **Backend API** | http://localhost:5001 | REST endpoints |
| **Health Check** | http://localhost:5001/health | API status |
| **MongoDB** | mongodb://localhost:27017/indra_netra | Database |

## 📝 Key Files

```
Frontend:
  └─ frontend/app/admin/monitoring/page.tsx ← Main monitoring page

Backend:
  ├─ backend/server.js ← Main server (updated)
  ├─ controllers/inferenceController.js ← NEW LSTM logic
  ├─ routes/inferenceRoutes.js ← NEW API routes
  ├─ models/Camera.js ← NEW camera model
  ├─ models/PanicDetection.js ← NEW detection model
  └─ websocket/cameraHandler.js ← NEW WebSocket handler

Python:
  ├─ model/extract_features.py ← NEW feature extraction
  ├─ model/run_inference.py ← NEW LSTM inference
  └─ model/process_frame.py ← NEW frame processing

Docs:
  ├─ LIVE_MONITORING_README.md ← Full documentation
  ├─ IMPLEMENTATION_SUMMARY.md ← What was built
  └─ TESTING_GUIDE.md ← How to test
```

## 🔌 API Endpoints

```bash
# Send frame for panic detection
POST /api/inference/lstm-panic-detect
multipart/form-data: frame, camera_id, event_id

# Get detection history
GET /api/inference/history/:camera_id?limit=100

# Get statistics
GET /api/inference/stats/:event_id?timeRange=3600000

# Clear buffer
DELETE /api/inference/clear-buffer/:camera_id
```

## 🎮 Frontend Features

```typescript
// Toggle live LSTM inference
liveEnable checkbox → Turns on/off continuous analysis

// Filter cameras
Status dropdown → All / Live / Offline

// View details
Fullscreen button → Expand with panic alerts

// Real-time indicators
🟢 Green badge → Normal (confidence < 0.5)
🔴 Red badge → Panic detected (confidence > 0.5)
```

## 📊 Data Flow

```
User clicks "liveEnable" ✓
    ↓
Frontend captures frame every 500ms
    ↓
Canvas→Blob→POST to backend
    ↓
Backend extracts features (Motion, Crowd)
    ↓
LSTM model predicts panic probability
    ↓
Save detection to MongoDB
    ↓
Auto-create Alert if confidence > 0.75
    ↓
Response to frontend with panic_detected, confidence
    ↓
Update UI (green/red indicator)
```

## ✅ Verification Checklist

```bash
[ ] Backend running (npm run dev)
[ ] Frontend running (npm run dev)
[ ] MongoDB running (mongod)
[ ] Python 3.8+ installed
[ ] TensorFlow installed (pip list | grep tensorflow)
[ ] OpenCV installed (pip list | grep opencv)
[ ] panic_lstm_model.h5 exists (ls model/panic_lstm_model.h5)
[ ] No console errors in browser DevTools
[ ] No console errors in backend terminal
[ ] Videos load in monitoring page
[ ] liveEnable toggle works
[ ] Detection updates appear in real-time
```

## 🆘 Quick Fixes

| Problem | Solution |
|---------|----------|
| "Cannot find module" | `npm install multer` in backend |
| Videos not showing | Check video URLs, test in browser |
| Detection not updating | Toggle liveEnable OFF then ON |
| Python error | `pip install tensorflow opencv-python` |
| Model not found | Verify `model/panic_lstm_model.h5` exists |
| CORS error | Already configured, clear browser cache |
| Slow response | Check CPU/memory, reduce frame rate |
| DB connection error | Verify MongoDB running on port 27017 |

## 📚 Documentation Map

```
Want to...                          → Read this file
├─ Understand architecture          → IMPLEMENTATION_SUMMARY.md
├─ See all features                 → LIVE_MONITORING_README.md
├─ Test the system                  → TESTING_GUIDE.md
├─ Deploy to production             → TESTING_GUIDE.md (section 8)
├─ Modify frame rate                → monitoring/page.tsx (line ~120, 500ms)
├─ Change detection threshold       → inferenceController.js (line ~65)
└─ Add new cameras                  → monitoring/page.tsx (line ~35, dummyVideos)
```

## 🎯 Common Customizations

### Increase Inference Speed
```typescript
// In monitoring/page.tsx, line 120:
setInterval(() => {
  captureFrameForInference(videoId, cameraId)
}, 250)  // Change 500 to 250 for 4 FPS
```

### Change Panic Threshold
```javascript
// In inferenceController.js, line 65:
const panicThreshold = 0.6;  // Change from 0.5 to 0.6
panicDetected = confidence > panicThreshold;
```

### Add New Camera
```typescript
// In monitoring/page.tsx, dummyVideos array:
{
  id: 4,
  title: "Emergency Exit",
  src: "https://your-video-url",
  location: "East Wing",
  status: "Live",
  cameraId: "cam_004",
}
```

### Skip Frame for Better Performance
```javascript
// In inferenceController.js:
if (frameCount++ % 2 !== 0) return; // Process every 2nd frame
```

## 🔐 Security Notes

- Camera IDs should be validated against event
- Frame data cleared from memory after processing
- API endpoints should require authentication
- MongoDB should have access controls
- Python subprocess runs with minimal permissions
- Consider rate limiting: 10 requests/second per camera

## 📞 Support

For issues:
1. Check TESTING_GUIDE.md → Common Issues section
2. Review console logs (browser DevTools + terminal)
3. Verify all services running (Backend, Frontend, MongoDB)
4. Check Python dependencies installed
5. Ensure model file exists and is readable

---

**Created**: January 2024  
**Last Updated**: January 2024  
**Version**: 1.0.0
