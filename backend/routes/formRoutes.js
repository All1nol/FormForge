import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getFormById } from '../controllers/formController.js';

const router = express.Router();

router.get('/:id', protect, getFormById);

export default router;
