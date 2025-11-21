import sys
import json
import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.models import load_model

MODEL_PATH = "panic_lstm_model.h5"

def preprocess_frame(frame):
    """Preprocess frame for feature extraction"""
    if len(frame.shape) == 3:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    else:
        gray = frame
    
    return gray

def extract_motion_energy(frame):
    """Calculate optical flow magnitude (motion energy)"""
    gray = preprocess_frame(frame)
    laplacian = cv2.Laplacian(gray, cv2.CV_64F)
    motion_energy = np.sum(np.abs(laplacian)) / (gray.shape[0] * gray.shape[1])
    return float(motion_energy)

def extract_flux_of_count(frame):
    """Calculate crowd density approximation"""
    gray = preprocess_frame(frame)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 127, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    flux_of_count = len(contours)
    return float(flux_of_count)

try:
    # Read frame from stdin
    frame_bytes = sys.stdin.buffer.read()
    frame_array = np.frombuffer(frame_bytes, dtype=np.uint8)
    frame = cv2.imdecode(frame_array, cv2.IMREAD_COLOR)
    
    if frame is None:
        raise ValueError("Could not decode frame")
    
    # Extract features
    motion_energy = extract_motion_energy(frame)
    flux_of_count = extract_flux_of_count(frame)
    
    # For now, use simple threshold
    # In production, accumulate 30 timesteps and use LSTM
    confidence = min(motion_energy / 100.0, 1.0)
    panic_detected = confidence > 0.7
    
    result = {
        "panic_detected": bool(panic_detected),
        "confidence": confidence,
        "motion_energy": motion_energy,
        "flux_of_count": flux_of_count
    }
    
    print(json.dumps(result))
    
except Exception as e:
    result = {
        "panic_detected": False,
        "confidence": 0.5,
        "error": str(e)
    }
    print(json.dumps(result), file=sys.stderr)
    sys.exit(1)
