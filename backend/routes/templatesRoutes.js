import express from 'express';
import { 
  getTemplates, 
  getPopularTemplates,
  getTemplateById,
  createTemplate, 
  updateTemplate, 
  deleteTemplate,
  addComment
} from '../controllers/templateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getTemplates);
router.get('/popular', getPopularTemplates);
router.get('/:id', getTemplateById);

// Protected routes
router.post('/', protect, createTemplate);
router.put('/:id', protect, updateTemplate);
router.delete('/:id', protect, deleteTemplate);
router.post('/:id/comments', protect, addComment);

export default router;
