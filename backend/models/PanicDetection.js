import mongoose from 'mongoose';

const panicDetectionSchema = new mongoose.Schema({
  cameraId: {
    type: String,
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  panicDetected: {
    type: Boolean,
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  frameData: {
    type: String, // Base64 encoded frame
    default: null,
  },
  motionEnergy: {
    type: Number,
    default: 0,
  },
  fluxOfCount: {
    type: Number,
    default: 0,
  },
  alertCreated: {
    type: Boolean,
    default: false,
  },
  alertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alert',
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const PanicDetection = mongoose.model('PanicDetection', panicDetectionSchema);
export default PanicDetection;
