import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

export const generateQRCode = async (userId, eventId) => {
    try {
        const qrData = {
            userId,
            eventId,
            timestamp: Date.now(),
            unique: uuidv4(),
        };

        const qrString = JSON.stringify(qrData);
        const qrImage = await QRCode.toDataURL(qrString);

        return {
            qrCode: qrString,
            qrImage,
        };
    } catch (error) {
        console.error('QR Generation Error:', error);
        throw error;
    }
};

export const calculateRiskLevel = (occupancyPercentage) => {
    if (occupancyPercentage <= 75) {
        return 'GREEN';
    } else if (occupancyPercentage <= 90) {
        return 'YELLOW';
    } else {
        return 'RED';
    }
};

export const calculateOccupancyPercentage = (detectedCount, capacity) => {
    if (capacity === 0) return 0;
    return (detectedCount / capacity) * 100;
};
