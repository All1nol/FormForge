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
  getTemplateAggregation,
  getPopularTemplates
} from '../controllers/template/index.js';

const router = express.Router();

router.route('/')
  .get(getTemplates)
  .post(protect, createTemplate);

router.get('/popular', getPopularTemplates);

router.route('/:id')
  .get(getTemplateById)
  .put(protect, updateTemplate)
  .delete(protect, deleteTemplate);

router.route('/:id/submit')
  .post(protect, submitTemplateForm);

router.route('/:id/submissions')
  .get(protect, getTemplateSubmissions);

// Add this new route
router.route('/:id/aggregation')
  .get(protect, getTemplateAggregation);

export default router;