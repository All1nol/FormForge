import asyncHandler from 'express-async-handler';
import Template from '../models/Template.js';
import Form from '../models/Form.js';
import mongoose from 'mongoose';

// @desc    Create a new template
// @route   POST /api/templates
// @access  Private
const createTemplate = asyncHandler(async (req, res) => {
  const { title, description, questions, accessType, allowedUsers } = req.body;

  const template = await Template.create({
    user: req.user._id,
    title,
    description,
    questions,
    accessType: accessType || 'all',
    allowedUsers: allowedUsers || []
  });

  res.status(201).json(template);
});

// @desc    Get all templates
// @route   GET /api/templates
// @access  Public
const getTemplates = asyncHandler(async (req, res) => {
  const templates = await Template.find({ accessType: 'all' })
    .populate('user', 'name email');
  res.json(templates);
});

// @desc    Get popular templates
// @route   GET /api/templates/popular
// @access  Public
const getPopularTemplates = asyncHandler(async (req, res) => {
  const templates = await Template.aggregate([
    {
      $lookup: {
        from: 'forms',
        localField: '_id',
        foreignField: 'template',
        as: 'submissions'
      }
    },
    {
      $addFields: {
        submissionCount: { $size: '$submissions' }
      }
    },
    {
      $sort: { submissionCount: -1 }
    },
    {
      $limit: 10
    }
  ]);

  res.json(templates);
});

// @desc    Get template by ID
// @route   GET /api/templates/:id
// @access  Public/Private (depends on template access settings)
const getTemplateById = asyncHandler(async (req, res) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidObjectId) {
    res.status(400);
    throw new Error('Invalid template ID');
  }

  const template = await Template.findById(req.params.id)
    .populate('user', 'name email');

  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }

  if (template.accessType === 'specific' && 
      !template.allowedUsers.includes(req.user?._id) && 
      template.user.toString() !== req.user?._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this template');
  }

  res.json(template);
});

// @desc    Update template
// @route   PUT /api/templates/:id
// @access  Private
const updateTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }

  if (template.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this template');
  }

  const updatedTemplate = await Template.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedTemplate);
});

// @desc    Delete template
// @route   DELETE /api/templates/:id
// @access  Private
const deleteTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);
  console.log('Template found:', template);
  if (!template) {
    res.status(404);
    throw new Error('Template not found');
}
  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }

  if (template.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this template');
  }

  await Template.deleteOne({_id: req.params.id});
  await Form.deleteMany({ template: template._id });

  res.json({ message: 'Template removed' });
});

// @desc    Get template submissions
// @route   GET /api/templates/:id/submissions
// @access  Private
const getTemplateSubmissions = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }

  if (template.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view submissions');
  }

  const submissions = await Form.find({ template: template._id })
    .populate('user', 'name email')
    .sort('-createdAt');

  res.json(submissions);
});

// @desc    Submit form for template
// @route   POST /api/templates/:id/submit
// @access  Private
const submitTemplateForm = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }

  const { answers } = req.body;

  // Validate required questions
  template.questions.forEach(question => {
    if (question.isRequired && !answers[question._id]) {
      res.status(400);
      throw new Error(`Question "${question.text}" is required`);
    }
  });

  const form = await Form.create({
    template: template._id,
    user: req.user._id,
    answers
  });

  res.status(201).json(form);
});

export {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  getTemplateSubmissions,
  submitTemplateForm,
  getPopularTemplates
};
