import mongoose from 'mongoose';
import CrowdMetrics from '../models/CrowdMetrics.js';
import Alert from '../models/Alert.js';
import Event from '../models/Event.js';
import { calculateRiskLevel, calculateOccupancyPercentage } from '../utils/qrAndCrowd.js';

export const receiveCrowdDetection = async (req, res, io) => {
    try {
        const { zone, detectedCount, eventId } = req.body;

        if (!zone || detectedCount === undefined || !eventId) {
            return res.status(400).json({
                message: 'Zone, detectedCount, and eventId are required'
            });
        }

        // Get event details
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Calculate capacity per zone
        const capacityPerZone = Math.ceil(event.totalCapacity / event.zones.length);

        // Calculate occupancy percentage and risk level
        const occupancyPercentage = calculateOccupancyPercentage(detectedCount, capacityPerZone);
        const riskLevel = calculateRiskLevel(occupancyPercentage);

        // Save crowd metrics
        const crowdMetrics = new CrowdMetrics({
            zone,
            count: detectedCount,
            detectedCount,
            capacity: capacityPerZone,
            occupancyPercentage: parseFloat(occupancyPercentage.toFixed(2)),
            riskLevel,
            eventId,
        });

        await crowdMetrics.save();

        // Create alert if risk level is YELLOW or RED
        if (riskLevel === 'YELLOW' || riskLevel === 'RED') {
            const alertType = riskLevel === 'RED' ? 'DANGER' : 'WARNING';
            const message = `Zone ${zone}: ${detectedCount} people detected. Occupancy: ${occupancyPercentage.toFixed(2)}%`;

            const alert = new Alert({
                zone,
                alertType,
                message,
                riskLevel,
                crowdCount: detectedCount,
                threshold: capacityPerZone,
                eventId,
            });

            await alert.save();

            // Emit alert via WebSocket
            if (io) {
                io.emit('alert_notification', {
                    zone,
                    alertType,
                    message,
                    riskLevel,
                    crowdCount: detectedCount,
                    timestamp: new Date(),
                });
            }
        }

        // Broadcast heatmap update
        if (io) {
            io.emit('heatmap_update', {
                zone,
                detectedCount,
                capacity: capacityPerZone,
                occupancyPercentage: parseFloat(occupancyPercentage.toFixed(2)),
                riskLevel,
                timestamp: new Date(),
            });
        }

        return res.status(200).json({
            message: 'Crowd detection received',
            data: {
                zone,
                detectedCount,
                capacity: capacityPerZone,
                occupancyPercentage: parseFloat(occupancyPercentage.toFixed(2)),
                riskLevel,
            },
        });
    } catch (error) {
        console.error('Crowd Detection Error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getCrowdMetrics = async (req, res) => {
    try {
        const { eventId, zone } = req.query;

        if (!eventId) {
            return res.status(400).json({ message: 'EventId is required' });
        }

        let query = { eventId };
        if (zone) {
            query.zone = zone;
        }

        const metrics = await CrowdMetrics.find(query).sort({ timestamp: -1 }).limit(100);

        return res.status(200).json({
            metrics,
        });
    } catch (error) {
        console.error('Get Crowd Metrics Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getLatestCrowdState = async (req, res) => {
    try {
        const { eventId } = req.query;

        if (!eventId) {
            return res.status(400).json({ message: 'EventId is required' });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Get latest metrics for each zone
        const latestMetrics = await CrowdMetrics.aggregate([
            { $match: { eventId: mongoose.Types.ObjectId(eventId) } },
            { $sort: { timestamp: -1 } },
            { $group: { _id: '$zone', doc: { $first: '$$ROOT' } } },
            { $replaceRoot: { newRoot: '$doc' } },
        ]);

        return res.status(200).json({
            crowdState: latestMetrics,
        });
    } catch (error) {
        console.error('Get Latest Crowd State Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAlerts = async (req, res) => {
    try {
        const { eventId, zone, acknowledged } = req.query;

        if (!eventId) {
            return res.status(400).json({ message: 'EventId is required' });
        }

        let query = { eventId };
        if (zone) {
            query.zone = zone;
        }
        if (acknowledged !== undefined) {
            query.acknowledged = acknowledged === 'true';
        }

        const alerts = await Alert.find(query).sort({ createdAt: -1 }).limit(50);

        return res.status(200).json({
            alerts,
        });
    } catch (error) {
        console.error('Get Alerts Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const acknowledgeAlert = async (req, res) => {
    try {
        const { alertId } = req.body;

        if (!alertId) {
            return res.status(400).json({ message: 'AlertId is required' });
        }

        const alert = await Alert.findByIdAndUpdate(
            alertId,
            { acknowledged: true },
            { new: true }
        );

        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        return res.status(200).json({
            message: 'Alert acknowledged',
            alert,
        });
    } catch (error) {
        console.error('Acknowledge Alert Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
