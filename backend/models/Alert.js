import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
    zone: {
        type: String,
        required: true,
    },
    alertType: {
        type: String,
        enum: ['CROWD_SURGE', 'EVACUATION', 'DANGER', 'WARNING'],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    riskLevel: {
        type: String,
        enum: ['GREEN', 'YELLOW', 'RED'],
        required: true,
    },
    crowdCount: {
        type: Number,
        required: true,
    },
    threshold: {
        type: Number,
        required: true,
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    acknowledged: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;
