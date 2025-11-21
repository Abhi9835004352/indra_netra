# Verification & Testing Guide

## ✅ Pre-Launch Checklist

### Backend Setup
```bash
# 1. Verify multer installation
cd backend
npm list multer
# Should output: multer@1.4.5-lts.1 (or higher)

# 2. Verify all routes exist
grep -r "inferenceRoutes\|cameraHandler" backend/

# 3. Check MongoDB connection
# Ensure MongoDB is running:
mongod

# 4. Verify Python scripts exist
ls -la model/*.py
# Should have:
# - extract_features.py
# - run_inference.py
# - process_frame.py
```

### Frontend Setup
```bash
# 1. Verify monitoring page exists
ls -la frontend/app/admin/monitoring/page.tsx

# 2. Check for required imports
grep -r "AlertTriangle\|Activity\|Video" frontend/app/admin/monitoring/page.tsx

# 3. Verify UI components available
grep -r "import.*Card" frontend/app/admin/monitoring/page.tsx
```

### Model Files
```bash
# 1. Verify LSTM model exists
ls -lh model/panic_lstm_model.h5
# Should be several MB in size

# 2. Test Python environment
python -c "import tensorflow; import cv2; import numpy; print('✅ All imports OK')"

# 3. Test model loading
python -c "from tensorflow.keras.models import load_model; m = load_model('model/panic_lstm_model.h5'); print('✅ Model loads OK')"
```

## 🧪 Testing the Implementation

### Test 1: API Health Check
```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Test health endpoint
curl http://localhost:5001/health
# Expected: {"status":"✅ Backend is running"}
```

### Test 2: Create Test Camera Record
```bash
curl -X POST http://localhost:5001/api/inference/history/test \
  -H "Content-Type: application/json" \
  -d '{}'
# Should return empty array []
```

### Test 3: Send Test Frame
```bash
# Create a small test image first
# Then send it:
curl -X POST http://localhost:5001/api/inference/lstm-panic-detect \
  -F "frame=@test_frame.jpg" \
  -F "camera_id=cam_test" \
  -F "event_id=test_event"

# Expected response:
# {
#   "panic_detected": false,
#   "confidence": 0.45,
#   "timestamp": "2024-01-20T...",
#   "detection_id": "..."
# }
```

### Test 4: Frontend Live Mode
```bash
# Terminal 3: Start frontend
cd frontend && npm run dev

# Open browser: http://localhost:3000/admin/monitoring
# 1. Toggle "liveEnable" checkbox ON
# 2. Verify videos load
# 3. Watch for detection updates
# 4. Check browser console for errors
```

### Test 5: Database Verification
```bash
# Connect to MongoDB
mongosh

# Check database
use indra_netra
db.panicdetections.find().limit(5)
db.cameras.find().limit(5)
db.alerts.find().limit(5)
```

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot find module 'multer'"
```bash
# Solution:
cd backend
npm install multer
npm install  # Full reinstall if needed
```

### Issue 2: Python scripts return "file not found"
```bash
# Solution: Check paths are absolute
# In inferenceController.js, verify:
const MODEL_PATH = path.resolve('../model/panic_lstm_model.h5');
const PYTHON_SCRIPT_PATH = path.resolve('../model/extract_features.py');

# Correct to:
import.meta.url  // ESM module URL
```

### Issue 3: "CORS error" in frontend
```javascript
// Solution: Already configured in backend
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
}));
```

### Issue 4: Videos not showing in monitoring page
```typescript
// Check:
1. Video URLs are accessible (test in browser)
2. Frontend API URL is correct
3. Camera.js model has correct cameraId
4. Ensure HAVE_ENOUGH_DATA state in video element
```

### Issue 5: Detection not updating
```bash
# Check:
1. liveEnable toggle is ON
2. Canvas refs are properly assigned
3. setInterval running (check DevTools Performance)
4. Network tab shows POST requests to /api/inference
5. Check backend console for Python errors
```

### Issue 6: Python "module not found" errors
```bash
# Verify installations:
pip list | grep -i tensorflow
pip list | grep -i opencv
pip list | grep numpy

# Reinstall if needed:
pip install tensorflow opencv-python numpy

# Test imports:
python -c "import cv2; import tensorflow; print('OK')"
```

## 📊 Performance Testing

### Test Backend Response Time
```bash
time curl -X POST http://localhost:5001/api/inference/lstm-panic-detect \
  -F "frame=@test_frame.jpg" \
  -F "camera_id=cam_001" \
  -F "event_id=evt_001"

# Expected: 200-500ms total
# - Frame upload: 50-100ms
# - Feature extraction: 100-200ms
# - LSTM inference: 50-150ms
# - DB write: 10-50ms
```

### Test Multiple Concurrent Requests
```bash
# Use Apache Bench
ab -n 100 -c 10 -p frame_data.txt \
  -T multipart/form-data \
  http://localhost:5001/api/inference/lstm-panic-detect

# Should handle 10 concurrent requests without errors
```

### Monitor Memory Usage
```bash
# Node.js process memory
node --max-old-space-size=4096 backend/server.js

# Python process memory (in system monitor)
# Watch for memory leaks in extraction/inference loops
```

## 🔍 Debugging Steps

### Enable Verbose Logging
```javascript
// In inferenceController.js, add:
console.log('📍 Frame received for camera:', camera_id);
console.log('🎨 Feature extraction started');
console.log('🧠 LSTM inference running');
console.log('💾 Saving to database');
```

### Frontend Console Debugging
```typescript
// Add to monitoring/page.tsx:
console.log('📡 Detection update:', {
  videoId,
  panicDetected,
  confidence,
  timestamp: new Date().toISOString()
});
```

### Python Debug Output
```python
# In extract_features.py:
import sys
print(f"DEBUG: Received frame bytes: {len(frame_bytes)}", file=sys.stderr)
print(f"DEBUG: Motion energy: {motion_energy}", file=sys.stderr)
print(f"DEBUG: Flux of count: {flux_of_count}", file=sys.stderr)
```

## 📈 Expected Behavior

### Startup Sequence
1. Backend starts → MongoDB connects ✅
2. Frontend loads → Connects to backend ✅
3. Monitoring page renders → Shows 3 dummy cameras ✅
4. Videos load → Play dummy videos ✅
5. Toggle liveEnable ON → Starts inference ✅
6. Every 500ms → Canvas captures frame ✅
7. Frame POSTs to backend ✅
8. Response shows confidence score ✅
9. UI updates with status ✅

### Live Behavior
- Canvas refreshes every 500ms
- Detection results update in real-time
- Confidence scores show 0.0-1.0 range
- Panic indicator turns red when > 0.5
- Fullscreen shows alert overlay
- Status filtering works immediately
- No errors in console

## ✨ Success Indicators

✅ All three cameras visible
✅ Videos play in grid and fullscreen
✅ liveEnable toggle works
✅ Detection updates show in real-time
✅ Confidence scores display 0.0-1.0 format
✅ Panic/Normal status updates correctly
✅ No console errors or warnings
✅ API responses under 500ms
✅ Database records created for each detection
✅ Alerts auto-created for high confidence
✅ Status filter shows/hides cameras

## 🚀 Production Readiness

Before deploying to production:

- [ ] Model file accessible and properly loaded
- [ ] Python environment configured correctly
- [ ] MongoDB backups enabled
- [ ] Error logging configured
- [ ] Rate limiting added to API
- [ ] Authentication on inference endpoint
- [ ] Camera IDs validated
- [ ] Frame resolution optimized
- [ ] Inference timeout set (e.g., 5 seconds)
- [ ] Alert notification system configured
- [ ] Load testing completed
- [ ] Security audit passed

---

**Last Updated**: January 2024
**Status**: Ready for Testing
