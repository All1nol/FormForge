import asyncHandler from 'express-async-handler';
import Form from '../models/Form.js';

// @desc    Get form by ID
// @route   GET /api/forms/:id
// @access  Private
export const getFormById = asyncHandler(async (req, res) => {
  const form = await Form.findById(req.params.id)
    .populate('template', 'title description questions')
    .lean();

  if (!form) {
    res.status(404);
    throw new Error('Form not found');
  }

  // Check if the user is authorized to view this form
  if (form.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this form');
  }

  res.json(form);
});
