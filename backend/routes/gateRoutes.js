import express from 'express';
import { checkIn, getGateStats, getGateDetail } from '../controllers/gateController.js';
import { validateCheckInInput } from '../middleware/validation.js';

const router = express.Router();

// Create gate routes
export const createGateRoutes = (io) => {
    router.post('/checkin', validateCheckInInput, (req, res) => checkIn(req, res, io));
    router.get('/stats', getGateStats);
    router.get('/detail', getGateDetail);

    return router;
};

export default router;
