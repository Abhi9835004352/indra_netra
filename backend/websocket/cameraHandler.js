export const setupCameraWebSocket = (io) => {
  const cameraNamespace = io.of('/ws/camera');

  cameraNamespace.on('connection', (socket) => {
    console.log(`✅ Camera stream connected: ${socket.id}`);

    socket.on('join_camera', (cameraId) => {
      socket.join(`camera-${cameraId}`);
      console.log(`Client ${socket.id} joined camera ${cameraId}`);
    });

    socket.on('leave_camera', (cameraId) => {
      socket.leave(`camera-${cameraId}`);
      console.log(`Client ${socket.id} left camera ${cameraId}`);
    });

    socket.on('frame_data', (data) => {
      // Broadcast frame to all clients watching this camera
      cameraNamespace.to(`camera-${data.cameraId}`).emit('frame', {
        frame: data.frame,
        timestamp: data.timestamp,
      });
    });

    socket.on('detection_result', (data) => {
      // Broadcast detection result
      cameraNamespace.to(`camera-${data.cameraId}`).emit('detection', {
        detection: {
          panic_detected: data.panic_detected,
          confidence: data.confidence,
        },
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('disconnect', () => {
      console.log(`❌ Camera stream disconnected: ${socket.id}`);
    });
  });

  return cameraNamespace;
};
