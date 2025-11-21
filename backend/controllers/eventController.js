import Event from '../models/Event.js';
import Gate from '../models/Gate.js';

export const createEvent = async (req, res) => {
    try {
        const { name, totalCapacity, safeLimit, zones, gates } = req.body;

        if (!name || !totalCapacity) {
            return res.status(400).json({ message: 'Name and totalCapacity are required' });
        }

        const newEvent = new Event({
            name,
            totalCapacity,
            safeLimit: safeLimit || Math.ceil(totalCapacity * 0.85),
            zones: zones || ['A', 'B', 'C'],
            gates: gates || [],
        });

        await newEvent.save();
        console.log('New event created:', newEvent);
        return res.status(201).json({
            message: 'Event created successfully',
            event: newEvent,
        });
    } catch (error) {
        console.error('Create Event Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        return res.status(200).json({
            event,
        });
    } catch (error) {
        console.error('Get Event Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });

        return res.status(200).json({
            events,
        });
    } catch (error) {
        console.error('Get All Events Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const createGate = async (req, res) => {
    try {
        const { gateId, gateName, zoneName, capacity, eventId } = req.body;

        if (!gateId || !gateName || !zoneName || !capacity || !eventId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if gate already exists
        const existingGate = await Gate.findOne({ gateId, eventId });
        if (existingGate) {
            return res.status(400).json({ message: 'Gate already exists for this event' });
        }

        const newGate = new Gate({
            gateId,
            gateName,
            zoneName,
            capacity,
            eventId,
        });

        await newGate.save();

        return res.status(201).json({
            message: 'Gate created successfully',
            gate: newGate,
        });
    } catch (error) {
        console.error('Create Gate Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getGates = async (req, res) => {
    try {
        const { eventId } = req.params;

        if (!eventId) {
            return res.status(400).json({ message: 'EventId is required' });
        }

        const gates = await Gate.find({ eventId });

        return res.status(200).json({
            gates,
        });
    } catch (error) {
        console.error('Get Gates Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
