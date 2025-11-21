import express from 'express';
import { createEvent, getEvent, getAllEvents, createGate, getGates } from '../controllers/eventController.js';
import { validateEventCreationInput, validateGateCreationInput } from '../middleware/validation.js';

const router = express.Router();

router.post('/', validateEventCreationInput, createEvent);
router.get('/:eventId', getEvent);
router.get('/', getAllEvents);

router.post('/:eventId/gate', validateGateCreationInput, createGate);
router.get('/:eventId/gates', getGates);

export default router;
