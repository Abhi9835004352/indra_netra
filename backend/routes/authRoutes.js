import express from 'express';
import { registerUser, getUserByPhone, getRegistrationHistory } from '../controllers/authController.js';
import { validateRegisterInput } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegisterInput, registerUser);
router.get('/user', getUserByPhone);
router.get('/registration-history', getRegistrationHistory);

export default router;
