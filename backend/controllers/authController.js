import User from '../models/User.js';
import Gate from '../models/Gate.js';
import Event from '../models/Event.js';
import { generateQRCode } from '../utils/qrAndCrowd.js';

export const registerUser = async (req, res) => {
    try {
        const { name, phone, email, gate, zone, timeSlot, eventId } = req.body;

        // Validate event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user already registered
        const existingUser = await User.findOne({ phone, eventId });
        if (existingUser) {
            return res.status(400).json({ message: 'User already registered for this event' });
        }

        // Generate QR Code
        const { qrCode, qrImage } = await generateQRCode(phone, eventId);

        // Create new user
        const newUser = new User({
            name,
            phone,
            email,
            gate,
            zone,
            timeSlot,
            qrCode,
            eventId,
        });

        await newUser.save();

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                phone: newUser.phone,
                gate: newUser.gate,
                zone: newUser.zone,
                qrCode: newUser.qrCode,
                qrImage,
            },
        });
    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getUserByPhone = async (req, res) => {
    try {
        const { phone, eventId } = req.query;

        if (!phone || !eventId) {
            return res.status(400).json({ message: 'Phone and eventId are required' });
        }

        const user = await User.findOne({ phone, eventId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            user,
        });
    } catch (error) {
        console.error('Get User Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getRegistrationHistory = async (req, res) => {
    try {
        const { phone, eventId } = req.query;

        if (!phone) {
            return res.status(400).json({ message: 'Phone is required' });
        }

        const registrations = await User.find({ phone }).select('-qrCode');

        return res.status(200).json({
            registrations,
        });
    } catch (error) {
        console.error('Registration History Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
