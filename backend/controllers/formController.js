import asyncHandler from 'express-async-handler';
import Form from '../models/Form.js';
import Template from '../models/Template.js';

// @desc    Get form by ID
// @route   GET /api/forms/:id
// @access  Private
const getFormById = asyncHandler(async (req, res) => {
  const form = await Form.findById(req.params.id)
    .populate('user', 'name email')
    .populate('template')
    .lean();

  if (!form) {
    res.status(404);
    throw new Error('Form not found');
  }

  // Check if user is authorized to view this form
  const template = await Template.findById(form.template);
  if (template.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this form');
  }

  res.json(form);
});

export { getFormById };
