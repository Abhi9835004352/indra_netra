// Input validation middleware
export const validateRegisterInput = (req, res, next) => {
    const { name, phone, gate, zone, eventId } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ message: 'Valid name is required' });
    }

    if (!phone || typeof phone !== 'string' || !/^\d{10}$/.test(phone)) {
        return res.status(400).json({ message: 'Valid 10-digit phone number is required' });
    }

    if (!gate || typeof gate !== 'string') {
        return res.status(400).json({ message: 'Valid gate ID is required' });
    }

    if (!zone || typeof zone !== 'string') {
        return res.status(400).json({ message: 'Valid zone is required' });
    }

    if (!eventId || typeof eventId !== 'string') {
        return res.status(400).json({ message: 'Valid eventId is required' });
    }

    next();
};

export const validateCheckInInput = (req, res, next) => {
    const { qrCode, eventId } = req.body;

    if (!qrCode || typeof qrCode !== 'string') {
        return res.status(400).json({ message: 'Valid QR code is required' });
    }

    if (!eventId || typeof eventId !== 'string') {
        return res.status(400).json({ message: 'Valid eventId is required' });
    }

    next();
};

export const validateCrowdDetectionInput = (req, res, next) => {
    const { zone, detectedCount, eventId } = req.body;

    if (!zone || typeof zone !== 'string') {
        return res.status(400).json({ message: 'Valid zone is required' });
    }

    if (detectedCount === undefined || typeof detectedCount !== 'number' || detectedCount < 0) {
        return res.status(400).json({ message: 'Valid detectedCount (non-negative number) is required' });
    }

    if (!eventId || typeof eventId !== 'string') {
        return res.status(400).json({ message: 'Valid eventId is required' });
    }

    next();
};

export const validateEventCreationInput = (req, res, next) => {
    const { name, totalCapacity } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ message: 'Valid event name is required' });
    }

    if (!totalCapacity || typeof totalCapacity !== 'number' || totalCapacity <= 0) {
        return res.status(400).json({ message: 'Valid totalCapacity (positive number) is required' });
    }

    next();
};

export const validateGateCreationInput = (req, res, next) => {
    const { gateId, gateName, zoneName, capacity, eventId } = req.body;

    if (!gateId || typeof gateId !== 'string') {
        return res.status(400).json({ message: 'Valid gateId is required' });
    }

    if (!gateName || typeof gateName !== 'string') {
        return res.status(400).json({ message: 'Valid gateName is required' });
    }

    if (!zoneName || typeof zoneName !== 'string') {
        return res.status(400).json({ message: 'Valid zoneName is required' });
    }

    if (!capacity || typeof capacity !== 'number' || capacity <= 0) {
        return res.status(400).json({ message: 'Valid capacity (positive number) is required' });
    }

    if (!eventId || typeof eventId !== 'string') {
        return res.status(400).json({ message: 'Valid eventId is required' });
    }

    next();
};
