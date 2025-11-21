import sys
import json
import numpy as np
import cv2
from io import BytesIO

def extract_motion_energy(frame):
    """Calculate optical flow magnitude (motion energy)"""
    if len(frame.shape) == 3:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    else:
        gray = frame
    
    # Compute Laplacian for edge detection (proxy for motion)
    laplacian = cv2.Laplacian(gray, cv2.CV_64F)
    motion_energy = np.sum(np.abs(laplacian)) / (gray.shape[0] * gray.shape[1])
    
    return float(motion_energy)

def extract_flux_of_count(frame):
    """Calculate crowd density approximation"""
    if len(frame.shape) == 3:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    else:
        gray = frame
    
    # Use morphological operations to estimate crowd density
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 127, 255, cv2.THRESH_BINARY)
    
    # Count connected components as approximation of people
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    flux_of_count = len(contours)
    
    return float(flux_of_count)

try:
    # Get frame path from command line argument
    if len(sys.argv) < 2:
        raise ValueError("Frame path not provided")
    
    frame_path = sys.argv[1]
    frame = cv2.imread(frame_path)
    
    if frame is None:
        raise ValueError(f"Could not read frame from {frame_path}")
    
    # Extract features
    motion_energy = extract_motion_energy(frame)
    flux_of_count = extract_flux_of_count(frame)
    
    # Output as JSON
    result = {
        "motionEnergy": motion_energy,
        "fluxOfCount": flux_of_count
    }
    
    print(json.dumps(result))
    
except Exception as e:
    print(json.dumps({"error": str(e), "motionEnergy": 0, "fluxOfCount": 0}), file=sys.stderr)
    sys.exit(1)
