import User from '../models/User.js';
import Gate from '../models/Gate.js';
import Event from '../models/Event.js';

export const checkIn = async (req, res, io) => {
    try {
        const { qrCode, eventId } = req.body;

        if (!qrCode || !eventId) {
            return res.status(400).json({ message: 'QR code and eventId are required' });
        }

        // Find user by QR code
        const user = await User.findOne({ qrCode, eventId });
        if (!user) {
            return res.status(404).json({ message: 'Invalid QR code' });
        }

        // Check if already checked in
        if (user.checkedIn) {
            return res.status(400).json({ message: 'User already checked in' });
        }

        // Update user check-in status
        user.checkedIn = true;
        user.checkedInTime = new Date();
        await user.save();

        // Increment gate count
        const gate = await Gate.findOne({ gateId: user.gate, eventId });
        if (gate) {
            gate.currentCount += 1;
            gate.totalEntered += 1;
            await gate.save();

            // Broadcast entry count update via WebSocket
            if (io) {
                io.emit('entry_count', {
                    gate: gate.gateId,
                    zone: gate.zoneName,
                    currentCount: gate.currentCount,
                    totalEntered: gate.totalEntered,
                    timestamp: new Date(),
                });
            }
        }

        return res.status(200).json({
            message: 'Check-in successful',
            user: {
                id: user._id,
                name: user.name,
                gate: user.gate,
                zone: user.zone,
                checkedInTime: user.checkedInTime,
            },
        });
    } catch (error) {
        console.error('Check-in Error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getGateStats = async (req, res) => {
    try {
        const { eventId } = req.query;

        if (!eventId) {
            return res.status(400).json({ message: 'EventId is required' });
        }

        const gates = await Gate.find({ eventId });
        const totalCheckedIn = await User.countDocuments({ eventId, checkedIn: true });
        const totalRegistered = await User.countDocuments({ eventId });

        const stats = {
            totalRegistered,
            totalCheckedIn,
            gates: gates.map(gate => ({
                gateId: gate.gateId,
                gateName: gate.gateName,
                zoneName: gate.zoneName,
                capacity: gate.capacity,
                currentCount: gate.currentCount,
                totalEntered: gate.totalEntered,
                occupancyPercentage: ((gate.currentCount / gate.capacity) * 100).toFixed(2),
            })),
        };

        return res.status(200).json(stats);
    } catch (error) {
        console.error('Gate Stats Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getGateDetail = async (req, res) => {
    try {
        const { gateId, eventId } = req.query;

        if (!gateId || !eventId) {
            return res.status(400).json({ message: 'GateId and eventId are required' });
        }

        const gate = await Gate.findOne({ gateId, eventId });
        if (!gate) {
            return res.status(404).json({ message: 'Gate not found' });
        }

        const usersAtGate = await User.find({ gate: gateId, eventId });

        return res.status(200).json({
            gate: {
                gateId: gate.gateId,
                gateName: gate.gateName,
                zoneName: gate.zoneName,
                capacity: gate.capacity,
                currentCount: gate.currentCount,
                totalEntered: gate.totalEntered,
            },
            users: usersAtGate,
        });
    } catch (error) {
        console.error('Gate Detail Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
