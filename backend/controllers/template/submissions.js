import asyncHandler from 'express-async-handler';
import Template from '../../models/Template.js';
import Form from '../../models/Form.js';

export const getTemplateSubmissions = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }

  if (template.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.json([]);
  }

  const submissions = await Form.find({ template: template._id })
    .populate('user', 'name email')
    .sort('-submittedAt')
    .lean();

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

export const submitTemplateForm = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }

  const { answers } = req.body;

  // Skip required field validation for admin users
  if (req.user.role !== 'admin') {
    template.questions.forEach(question => {
      if (question.isRequired && !answers[question._id]) {
        res.status(400);
        throw new Error(`Question "${question.text}" is required`);
      }
    });
  }

  const form = await Form.create({
    template: template._id,
    user: req.user._id,
    answers
  });

  res.status(201).json(form);
}); 