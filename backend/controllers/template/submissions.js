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
  console.log('Request body:', req.body);
  console.log('Template ID:', req.params.id);

  const template = await Template.findById(req.params.id);
  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }

  const { answers } = req.body;
  console.log('Received answers:', answers);

  // Validate answers
  if (!answers || typeof answers !== 'object') {
    res.status(400);
    throw new Error('Invalid answers format');
  }

  // Ensure at least one answer is provided
  if (Object.keys(answers).length === 0) {
    res.status(400);
    throw new Error('At least one answer is required');
  }

  // Validate required questions
  if (req.user.role !== 'admin') {
    template.questions.forEach(question => {
      if (question.isRequired && !answers[question._id]) {
        res.status(400);
        throw new Error(`Question "${question.text}" is required`);
      }
    });
  }

  // Create form with answers
  const formData = {
    template: template._id,
    user: req.user._id,
    answers: new Map(Object.entries(answers))
  };

  console.log('Creating form with data:', formData);
  const form = await Form.create(formData);

  // Return populated form
  const populatedForm = await Form.findById(form._id)
    .populate('template', 'title description questions')
    .populate('user', 'name email')
    .lean();

  // Convert Map to object for response
  if (populatedForm.answers instanceof Map) {
    populatedForm.answers = Object.fromEntries(populatedForm.answers);
  }

  res.status(201).json(populatedForm);
}); 