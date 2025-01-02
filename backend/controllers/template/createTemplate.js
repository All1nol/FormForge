import asyncHandler from 'express-async-handler';
import Template from '../../models/Template.js';

export const createTemplate = asyncHandler(async (req, res) => {
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