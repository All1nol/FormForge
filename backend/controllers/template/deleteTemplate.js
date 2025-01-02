import asyncHandler from 'express-async-handler';
import Template from '../../models/Template.js';
import Form from '../../models/Form.js';

export const deleteTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);
  
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