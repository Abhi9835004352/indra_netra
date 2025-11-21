import cv2
import numpy as np
from collections import deque, defaultdict
from ultralytics import YOLO
from sahi import AutoDetectionModel
from sahi.predict import get_sliced_prediction
from sahi.utils.cv import visualize_object_predictions

# --- CONFIGURATION ---
VIDEO_PATH = r"D:\indra_netra\model\vid.mp4"
MODEL_PATH = r"D:\indra_netra\model\yolov10m.pt"
OUTPUT_PATH = r"D:\indra_netra\model\op.mp4"


# TUNING PARAMETERS
CONF_THRESHOLD = 0.25
PANIC_ENERGY_THRESH = 3.5  # Optical Flow Speed > 3.5 = Running
PANIC_FLUX_THRESH = 10     # > 10 people entering/leaving per second = Rush

class CrowdTracker:
    def __init__(self):
        # Load Standard YOLO for Tracking (SAHI doesn't support tracking IDs easily)
        # We will use standard YOLO with high resolution inference for tracking
        self.model = YOLO(MODEL_PATH)
        
        # State Variables
        self.unique_ids = set()       # Store all unique IDs seen
        self.current_ids = set()      # IDs in the current frame
        self.prev_gray = None
        self.history_flux = deque(maxlen=30) 
        
    def get_motion_energy(self, frame):
        """Calculates kinetic energy (speed of movement)."""
        small = cv2.resize(frame, (320, 320))
        gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
        
        if self.prev_gray is None:
            self.prev_gray = gray
            return 0.0
            
        flow = cv2.calcOpticalFlowFarneback(self.prev_gray, gray, None, 0.5, 3, 15, 3, 5, 1.2, 0)
        mag, _ = cv2.cartToPolar(flow[..., 0], flow[..., 1])
        self.prev_gray = gray
        
        # Filter low-speed noise (mag < 2)
        valid_motion = mag[mag > 2.0]
        if len(valid_motion) == 0: return 0.0
        return np.mean(valid_motion)

    def process_frame(self, frame):
        # 1. TRACKING (Get Unique IDs)
        # persist=True is required for tracking
        # classes=0 ensures we only track 'person'
        results = self.model.track(frame, persist=True, verbose=False, classes=0, conf=CONF_THRESHOLD)
        
        current_count = 0
        annotated_frame = frame.copy()
        
        if results[0].boxes.id is not None:
            # Extract IDs and Boxes
            ids = results[0].boxes.id.int().cpu().tolist()
            boxes = results[0].boxes.xyxy.cpu()
            
            self.current_ids = set(ids)
            self.unique_ids.update(ids) # Add new IDs to total count
            current_count = len(self.current_ids)
            
            # Draw Boxes & IDs
            annotated_frame = results[0].plot(labels=False, font_size=1.0)

        # 2. PANIC LOGIC (Physics-Based)
        motion_energy = self.get_motion_energy(frame)
        
        # Calculate Flux (Rate of new people appearing/disappearing)
        if len(self.history_flux) > 0:
            prev_c = self.history_flux[-1]
            flux = abs(current_count - prev_c)
        else:
            flux = 0
        self.history_flux.append(current_count)

        # 3. DETERMINE STATUS
        status = "NORMAL"
        color = (0, 255, 0)
        
        is_running = motion_energy > PANIC_ENERGY_THRESH
        is_rushing = flux > PANIC_FLUX_THRESH

        if is_running and is_rushing:
            status = "!!! PANIC: STAMPEDE DETECTED !!!"
            color = (0, 0, 255) # Red
        elif is_running:
            status = "WARNING: HIGH SPEED (RUNNING)"
            color = (0, 165, 255) # Orange
        elif is_rushing:
            status = "WARNING: SUDDEN INFLUX"
            color = (255, 255, 0) # Yellow

        return annotated_frame, len(self.unique_ids), current_count, motion_energy, status, color

def main():
    tracker = CrowdTracker()
    cap = cv2.VideoCapture(VIDEO_PATH)
    
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    out = cv2.VideoWriter(OUTPUT_PATH, cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))

    print(f"Processing {width}x{height} video...")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret: break

        # Run Pipeline
        vis_frame, total_unique, curr_count, energy, status, status_color = tracker.process_frame(frame)
        
        # --- HUD Visualization (SMALLER) ---
        # 1. Smaller Black Box (adjusted height and width)
        cv2.rectangle(vis_frame, (0, 0), (350, 110), (0, 0, 0), -1)
        
        # 2. Smaller Text (Font Scale 0.6 instead of 1.0)
        font_scale = 0.6
        thickness = 1
        spacing = 25  # Vertical space between lines
        start_y = 30
        
        cv2.putText(vis_frame, f"Live Count: {curr_count}", (15, start_y), 
                   cv2.FONT_HERSHEY_SIMPLEX, font_scale, (255, 255, 255), thickness)
        
        cv2.putText(vis_frame, f"Total Unique: {total_unique}", (15, start_y + spacing), 
                   cv2.FONT_HERSHEY_SIMPLEX, font_scale, (255, 255, 255), thickness)
                   
        cv2.putText(vis_frame, f"Energy: {energy:.2f}", (15, start_y + spacing*2), 
                   cv2.FONT_HERSHEY_SIMPLEX, font_scale, (255, 255, 255), thickness)
                   
        # Status slightly bolder
        cv2.putText(vis_frame, f"{status}", (15, start_y + spacing*3), 
                   cv2.FONT_HERSHEY_TRIPLEX, 0.5, status_color, 1)

        out.write(vis_frame)
        print(f"Unique: {total_unique} | Live: {curr_count} | Energy: {energy:.2f} | Status: {status}")

    cap.release()
    out.release()
    print(f"Saved to {OUTPUT_PATH}")

if __name__ == "__main__":
    main()

if __name__ == "__main__":
    main()