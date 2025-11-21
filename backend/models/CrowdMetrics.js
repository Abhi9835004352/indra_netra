import mongoose from 'mongoose';

const crowdMetricsSchema = new mongoose.Schema({
  zone: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  detectedCount: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  occupancyPercentage: {
    type: Number,
    required: true,
  },
  riskLevel: {
    type: String,
    enum: ['GREEN', 'YELLOW', 'RED'],
    default: 'GREEN',
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const CrowdMetrics = mongoose.model('CrowdMetrics', crowdMetricsSchema);
export default CrowdMetrics;
