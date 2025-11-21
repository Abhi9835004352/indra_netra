import sys
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model

MODEL_PATH = "panic_lstm_model.h5"

try:
    # Load input data from stdin
    input_data = sys.stdin.read()
    data = json.loads(input_data)
    
    motion_energy = np.array(data['motion_energy'], dtype=np.float32)
    flux_of_count = np.array(data['flux_of_count'], dtype=np.float32)
    
    # Normalize features
    motion_energy = (motion_energy - motion_energy.mean()) / (motion_energy.std() + 1e-7)
    flux_of_count = (flux_of_count - flux_of_count.mean()) / (flux_of_count.std() + 1e-7)
    
    # Stack features: (30, 2)
    X = np.stack([motion_energy, flux_of_count], axis=1)
    X = X.reshape(1, 30, 2)  # Add batch dimension
    
    # Load model and run inference
    model = load_model(MODEL_PATH)
    prediction = model.predict(X, verbose=0)
    
    confidence = float(prediction[0][0])
    panic_detected = confidence > 0.5
    
    result = {
        "panic_detected": bool(panic_detected),
        "confidence": confidence,
        "threshold": 0.5
    }
    
    print(json.dumps(result))
    
except Exception as e:
    # Return safe default on error
    result = {
        "panic_detected": False,
        "confidence": 0.5,
        "error": str(e)
    }
    print(json.dumps(result), file=sys.stderr)
    sys.exit(1)
