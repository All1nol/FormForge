import asyncHandler from 'express-async-handler';
import Template from '../../models/Template.js';
import mongoose from 'mongoose';

export const getTemplateById = asyncHandler(async (req, res) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidObjectId) {
    res.status(404);
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