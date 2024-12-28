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
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'creator'
      }
    },
    {
      $addFields: {
        submissionCount: { $size: '$submissions' },
        user: { $arrayElemAt: ['$creator', 0] }
      }
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        submissionCount: 1,
        'user.name': 1
      }
    },
    {
      $sort: { submissionCount: -1 }
    },
    {
      $limit: 10
    }
  ]);

  // Transform the results to ensure consistent user name handling
  const transformedTemplates = templates.map(template => ({
    ...template,
    user: template.user ? { name: template.user.name } : { name: 'Anonymous' }
  }));

  res.json(transformedTemplates);
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

  const submissions = await Form.find({ template: template._id })
    .populate('user', 'name email')
    .sort('-submittedAt')
    .lean();

  // Transform submissions to ensure proper format
  const transformedSubmissions = submissions.map(submission => ({
    _id: submission._id,
    user: submission.user ? { name: submission.user.name } : { name: 'Anonymous' },
    submittedAt: submission.submittedAt,
    answers: submission.answers instanceof Map ? 
      Object.fromEntries(submission.answers) : 
      submission.answers
  }));

  res.json(transformedSubmissions);
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

// @desc    Get template aggregation
// @route   GET /api/templates/:id/aggregation
// @access  Private
const getTemplateAggregation = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }

  if (template.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view aggregation');
  }

  const submissions = await Form.find({ template: template._id })
    .populate('user', 'name email')
    .lean();

  const aggregatedResults = {};

  template.questions.forEach(question => {
    const answers = submissions.map(submission => submission.answers[question._id])
      .filter(answer => answer !== null && answer !== undefined);

    if (answers.length === 0) return;

    switch (question.type) {
      case 'number':
        const numbers = answers
          .map(Number)
          .filter(n => !isNaN(n));

        if (numbers.length > 0) {
          aggregatedResults[question._id] = {
            average: (numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(2),
            min: Math.min(...numbers),
            max: Math.max(...numbers),
            count: numbers.length,
            distribution: numbers.reduce((acc, curr) => {
              acc[curr] = (acc[curr] || 0) + 1;
              return acc;
            }, {})
          };
        }
        break;

      case 'text':
      case 'boolean':
      case 'date':
        const frequency = answers.reduce((acc, curr) => {
          const value = String(curr).trim();
          if (value) {
            acc[value] = (acc[value] || 0) + 1;
          }
          return acc;
        }, {});

        if (Object.keys(frequency).length > 0) {
          const sortedEntries = Object.entries(frequency)
            .sort((a, b) => b[1] - a[1]);

          aggregatedResults[question._id] = {
            mostCommon: sortedEntries[0][0],
            frequency,
            count: answers.length,
            percentages: Object.entries(frequency).reduce((acc, [value, count]) => {
              acc[value] = ((count / answers.length) * 100).toFixed(1) + '%';
              return acc;
            }, {})
          };
        }
        break;
    }
  });

  res.json(aggregatedResults);
});

export {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  getTemplateSubmissions,
  submitTemplateForm,
  getPopularTemplates,
  getTemplateAggregation
};
