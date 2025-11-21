import mongoose from 'mongoose';

const gateSchema = new mongoose.Schema({
  gateId: {
    type: String,
    required: true,
    unique: true,
  },
  gateName: {
    type: String,
    required: true,
  },
  zoneName: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  currentCount: {
    type: Number,
    default: 0,
  },
  totalEntered: {
    type: Number,
    default: 0,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Gate = mongoose.model('Gate', gateSchema);
export default Gate;
