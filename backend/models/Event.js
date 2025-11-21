import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    totalCapacity: {
        type: Number,
        required: true,
    },
    safeLimit: {
        type: Number,
        required: true,
    },
    zones: {
        type: [String],
        default: ['A', 'B', 'C'],
    },
    gates: [{
        gateId: String,
        zoneName: String,
        capacity: Number,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
