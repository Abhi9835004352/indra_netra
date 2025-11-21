# file: create_model.py
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

# Define a robust LSTM architecture for temporal anomaly detection
def create_panic_model():
    model = Sequential([
        # Input: 30 time steps, 2 features (Motion Energy, Flux of Count)
        LSTM(64, return_sequences=True, input_shape=(30, 2)),
        Dropout(0.2),
        LSTM(32, return_sequences=False),
        Dropout(0.2),
        Dense(16, activation='relu'),
        Dense(1, activation='sigmoid') # Output probability (0=Normal, 1=Panic)
    ])
    
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    
    # Generate dummy data just to initialize and save the structure
    X_dummy = np.random.random((100, 30, 2))
    y_dummy = np.random.randint(0, 2, 100)
    
    model.fit(X_dummy, y_dummy, epochs=1, verbose=0)
    model.save("panic_lstm_model.h5")
    print("✅ 'panic_lstm_model.h5' created successfully.")

if __name__ == "__main__":
    create_panic_model()