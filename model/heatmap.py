import torch
import torch.nn as nn
import numpy as np
import cv2
import os
from torchvision import models

# --- CONFIGURATION ---
VIDEO_PATH = "/home/prasun/stempede/vid.mp4"
MODEL_PATH = "/home/prasun/stempede/partBmodel_best.pth.tar" 
OUTPUT_PATH = "/home/prasun/stempede/op.mp4"
DEVICE = 'cuda' if torch.cuda.is_available() else 'cpu'

# --- 1. DEFINE THE CSRNet ARCHITECTURE ---
class CSRNet(nn.Module):
    def __init__(self):
        super(CSRNet, self).__init__()
        self.frontend_feat = [64, 64, 'M', 128, 128, 'M', 256, 256, 256, 'M', 512, 512, 512]
        self.backend_feat  = [512, 512, 512, 256, 128, 64]
        self.frontend = make_layers(self.frontend_feat)
        self.backend = make_layers(self.backend_feat, in_channels=512, dilation=True)
        self.output_layer = nn.Conv2d(64, 1, kernel_size=1)

    def forward(self, x):
        x = self.frontend(x)
        x = self.backend(x)
        x = self.output_layer(x)
        return x

def make_layers(cfg, in_channels=3, batch_norm=False, dilation=False):
    layers = []
    for v in cfg:
        if v == 'M':
            layers += [nn.MaxPool2d(kernel_size=2, stride=2)]
        else:
            padding = v if dilation else 1
            kernel = nn.Conv2d(in_channels, v, kernel_size=3, padding=padding, dilation=padding if dilation else 1)
            layers += [kernel, nn.ReLU(inplace=True)]
            in_channels = v
    return nn.Sequential(*layers)

# --- 2. ANALYSIS ENGINE ---
class CrowdAnalyzer:
    def __init__(self, model_path):
        print(f"Initializing CSRNet on {DEVICE}...")
        self.model = CSRNet().to(DEVICE)
        self.prev_gray = None
        
        if os.path.exists(model_path):
            try:
                # --- FIX 1: Added weights_only=False ---
                # This allows loading older .pth files (like ShanghaiTech weights)
                checkpoint = torch.load(model_path, map_location=DEVICE, weights_only=False)
                
                if 'state_dict' in checkpoint:
                    self.model.load_state_dict(checkpoint['state_dict'])
                else:
                    self.model.load_state_dict(checkpoint)
                print("✅ Loaded Weights Successfully")
            except Exception as e:
                print(f"❌ Error loading weights: {e}")
                print("Running in UNTRAINED mode (Counts will be wrong!)")
        else:
            print(f"⚠️ WARNING: Weights file not found at {model_path}")
        
        self.model.eval()

    def analyze_frame(self, frame):
        # 1. DENSITY ESTIMATION (COUNTING)
        img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        img = img.astype(np.float32) / 255.0
        img = (img - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
        
        # --- FIX 2: Added .float() ---
        # Forces data to be 32-bit float to match the model weights
        x = torch.from_numpy(img).permute(2, 0, 1).unsqueeze(0).to(DEVICE).float()
        
        with torch.no_grad():
            density_map = self.model(x)
        
        density_map = density_map.squeeze().cpu().numpy()
        count = np.sum(density_map) 
        
        # 2. PANIC SCORE (MOTION * DENSITY)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        if self.prev_gray is None:
            self.prev_gray = gray
            return count, 0.0, "Initializing", (0,255,0), density_map
            
        flow = cv2.calcOpticalFlowFarneback(self.prev_gray, gray, None, 0.5, 3, 15, 3, 5, 1.2, 0)
        mag, _ = cv2.cartToPolar(flow[..., 0], flow[..., 1])
        
        h, w = density_map.shape
        mag_resized = cv2.resize(mag, (w, h))
        
        # Filter noise: only consider motion where density is > 0
        panic_energy = np.sum(mag_resized * density_map)
        
        if count < 1: count = 1
        risk_score = (panic_energy / count) * 10
        
        self.prev_gray = gray
        
        if risk_score > 5.0:
            status = "!!! PANIC !!!"
            color = (0, 0, 255)
        elif risk_score > 2.5:
            status = "High Activity"
            color = (0, 165, 255)
        else:
            status = "Normal"
            color = (0, 255, 0)
            
        return count, risk_score, status, color, density_map

# --- 3. MAIN ---
def main():
    analyzer = CrowdAnalyzer(MODEL_PATH)
    cap = cv2.VideoCapture(VIDEO_PATH)
    
    # Setup Writer
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    
    # Process at reduced resolution for speed, but output visualization
    process_w, process_h = 1024, 576 
    out = cv2.VideoWriter(OUTPUT_PATH, cv2.VideoWriter_fourcc(*'mp4v'), fps, (process_w, process_h))

    print("Starting Analysis...")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret: break
        
        frame = cv2.resize(frame, (process_w, process_h))
        
        # Analyze
        count, risk, status, color, density_map = analyzer.analyze_frame(frame)
        
        # Visualization
        density_norm = cv2.normalize(density_map, None, 0, 255, cv2.NORM_MINMAX, dtype=cv2.CV_8U)
        heatmap = cv2.applyColorMap(density_norm, cv2.COLORMAP_JET)
        heatmap = cv2.resize(heatmap, (process_w, process_h))
        
        overlay = cv2.addWeighted(frame, 0.6, heatmap, 0.4, 0)
        
        # Small Text HUD
        cv2.rectangle(overlay, (0, 0), (250, 100), (0, 0, 0), -1)
        cv2.putText(overlay, f"Count: {int(count)}", (15, 30), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
        cv2.putText(overlay, f"Panic Score: {risk:.2f}", (15, 60), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
        cv2.putText(overlay, f"{status}", (15, 90), 
                    cv2.FONT_HERSHEY_TRIPLEX, 0.5, color, 1)

        out.write(overlay)
        print(f"Count: {int(count)} | Risk: {risk:.2f} | {status}")

    cap.release()
    out.release()
    print(f"Saved to {OUTPUT_PATH}")

if __name__ == "__main__":
    main()