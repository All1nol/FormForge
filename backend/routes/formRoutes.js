import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getFormById } from '../controllers/formController.js';

const router = express.Router();

// Protected routes
router.route('/:id')
  .get(protect, getFormById);

export default router;
