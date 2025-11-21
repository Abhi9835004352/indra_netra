import express from 'express';
import {
    receiveCrowdDetection,
    getCrowdMetrics,
    getLatestCrowdState,
    getAlerts,
    acknowledgeAlert
} from '../controllers/crowdController.js';
import { validateCrowdDetectionInput } from '../middleware/validation.js';

const router = express.Router();

// Create crowd routes
export const createCrowdRoutes = (io) => {
    router.post('/detect', validateCrowdDetectionInput, (req, res) => receiveCrowdDetection(req, res, io));
    router.get('/metrics', getCrowdMetrics);
    router.get('/latest', getLatestCrowdState);
    router.get('/alerts', getAlerts);
    router.post('/alert-acknowledge', acknowledgeAlert);

    return router;
};

export default router;
