import cv2
from ultralytics import YOLO
import json
from collections import defaultdict

model = YOLO("yolov10m.pt")

def process_webcam():
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Could not open webcam")
        return
    
    # Track unique objects by class
    tracked_ids = defaultdict(set)
    output_file = "detections.json"
    frame_count = 0
    
    while True:
        ret, frame = cap.read()
        
        if not ret:
            print("Error reading frame")
            break
        
        # Run YOLOv10 inference with tracking
        results = model.track(frame, conf=0.5, persist=True)
        
        # Annotate frame with bounding boxes and scores
        annotated_frame = results[0].plot()
        
        # Track unique IDs per class
        if len(results[0].boxes) > 0:
            for box in results[0].boxes:
                class_id = int(box.cls)
                class_name = model.names[class_id]
                track_id = int(box.id) if box.id is not None else None
                
                if track_id is not None:
                    tracked_ids[class_name].add(track_id)
        
        # Display frame with detections
        cv2.imshow("YOLOv10 Live Detection", annotated_frame)
        
        frame_count += 1
        print(f"Frame {frame_count} processed", end='\r')
        
        # Press 'q' to quit
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()
    
    # Save unique counts to JSON
    output_data = {
        "total_frames": frame_count,
        "unique_instances": {class_name: len(ids) for class_name, ids in tracked_ids.items()}
    }
    
    with open(output_file, 'w') as f:
        json.dump(output_data, f, indent=2)
    
    print(f"\nDetections saved to {output_file}")
    print(json.dumps(output_data, indent=2))

if __name__ == "__main__":
    process_webcam()