import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: false,
    },
    gate: {
        type: String,
        required: true,
    },
    zone: {
        type: String,
        required: true,
    },
    timeSlot: {
        type: String,
        required: false,
    },
    qrCode: {
        type: String,
        unique: true,
        required: true,
    },
    checkedIn: {
        type: Boolean,
        default: false,
    },
    checkedInTime: {
        type: Date,
        required: false,
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

const User = mongoose.model('User', userSchema);
export default User;
