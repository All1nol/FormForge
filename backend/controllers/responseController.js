import asyncHandler from 'express-async-handler';
import Response from '../models/Response.js';
import Template from '../models/Template.js';


export const createResponse = asyncHandler(async (req, res) => {
  const { templateId, answers } = req.body;

  const template = await Template.findById(templateId);
  if (!template) {
    res.status(404).json({ message: 'Template not found' });
    return;
  }
//validate
  const errors = [];
  template.questions.forEach((question) => {
    const answer = answers.find((a) => a.questionLabel === question.label);
    if (question.isRequired && (!answer || answer.answer === undefined || answer.answer === null)) {
      errors.push(`Answer for '${question.label}' is required.`);
    }
    if (answer && typeof answer.answer !== question.type) {
      errors.push(
        `Answer for '${question.label}' should be of type '${question.type}' but received '${typeof answer.answer}'.`
      );
    }
  });

  if (errors.length > 0) {
    res.status(400).json({ message: 'Validation errors', errors });
    return;
  }

  const response = new Response({
    template: templateId,
    user: req.user.id, 
    answers,
  });

  await response.save();
  res.status(201).json(response);
});

export const getResponsesByTemplate = asyncHandler(async (req, res) => {
const {templateId}= req.params;
const responses = await Response.find({template: templateId}).populate('user','name email');
if (!responses || responses.length ===0) {
    res.status(404).json({message: 'No responses found for this template'});
    return;
}
res.status(200).json(responses);
});


export const updateResponse = asyncHandler(async (req, res) => {
    const{answers} =req.body; 
    
    const response= await Response.findById(req.params.id);

    if(!response){
        res.status(404).json({message: 'Response not found'});
        return;
    }

    if(response.user.toString() !== req.user.id){
        res.status(403).json({message: 'Not authorized to update this response'});
        return;
    }
    
    response.answers= answers || response.answers;
    await response.save();
});

export const deleteResponse = asyncHandler(async(req,res)=> {
    const response = await Response.findById(req.params.id);

    if(!response){
        res.status(404).json({message: 'Response not found'});
        return;
    }

    if(response.user.toString() !== req.user.id){
        res.status(403).json({message: 'Not authorized to delete this response'});
        return;
    }

    await response.remove();
    res.status(200).json({message: 'Response deleted successfully'});
});