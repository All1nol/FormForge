import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  getTemplateSubmissions,
  submitTemplateForm,
  getPopularTemplates
} from '../controllers/templateController.js';

const router = express.Router();

router.route('/')
  .get(getTemplates)
  .post(protect, createTemplate);

router.get('/popular', getPopularTemplates);

router.route('/:id')
  .get(getTemplateById)
  .put(protect, updateTemplate)
  .delete(protect, deleteTemplate);

router.get('/:id/submissions', protect, getTemplateSubmissions);
router.post('/:id/submit', protect, submitTemplateForm);

export default router;
