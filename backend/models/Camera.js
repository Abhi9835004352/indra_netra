import mongoose from 'mongoose';

const cameraSchema = new mongoose.Schema({
  cameraId: {
    type: String,
    required: true,
    unique: true,
  },
  cameraName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  streamUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Live', 'Offline', 'Maintenance'],
    default: 'Live',
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  lastDetectionTime: {
    type: Date,
    default: null,
  },
  panicDetectionHistory: [
    {
      timestamp: Date,
      panicDetected: Boolean,
      confidence: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Camera = mongoose.model('Camera', cameraSchema);
export default Camera;
