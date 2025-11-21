import express from 'express';
import multer from 'multer';
import {
  lstmPanicDetect,
  getDetectionHistory,
  getDetectionStats,
  clearBuffer,
} from '../controllers/inferenceController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST: Run LSTM panic detection on a frame
router.post('/lstm-panic-detect', upload.single('frame'), lstmPanicDetect);

// GET: Detection history for a camera
router.get('/history/:camera_id', getDetectionHistory);

// GET: Detection statistics for an event
router.get('/stats/:event_id', getDetectionStats);

// DELETE: Clear temporal buffer for a camera
router.delete('/clear-buffer/:camera_id', clearBuffer);

export default router;
