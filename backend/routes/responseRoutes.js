import express from 'express';
import {createResponse,getResponsesByTemplate,updateResponse,deleteResponse } from '../controllers/responseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createResponse);
router.get('/template/:templateId', protect, getResponsesByTemplate);
router.put('/:id', protect, updateResponse);
router.delete('/:id', protect, deleteResponse);

export default router;
