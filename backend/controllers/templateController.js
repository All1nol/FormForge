import { ExplainVerbosity } from 'mongodb';
import Template from '../models/Template.js';

export const getTemplates = async (req, res, next) => {
  try {
    const templates = await Template.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(templates);
  } catch (error) {
    next(error);
  }
};

export const getPopularTemplates = async (req, res, next) => {
  try {
    const templates = await Template.find()
      .populate('createdBy', 'name')
      .sort({ filledFormsCount: -1 })
      .limit(5);
    res.status(200).json(templates);
  } catch (error) {
    next(error);
  }
};

export const getTemplateById = async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('comments.user', 'name');
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    res.status(200).json(template);
  } catch (error) {
    next(error);
  }
};

export const createTemplate = async (req, res, next) => {
  const { title, description, questions } = req.body;
  try {
    const template = new Template({
      title,
      description,
      questions,
      createdBy: req.user.id, // Populated by the protect middleware
    });
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    next(error);
  }
};

export const updateTemplate = async (req, res, next) => {
 const {title,description,questions} = req.body;
 try{
  const template = await Template.findById(req.params.id);
  if(!template){
    return res.status(404).json({messahe: 'Template not found'});
  }
  if(template.createdBy.toString() !== req.user.id){
    return res.status(403).json({message: 'Not authrized to update this template'}); 
   }
   template.title = title|| template.title;
   template.description = description || template.description;
   template.questions = questions || template.questions;
  
  await template.save();


  res.status(200).json(template)
  }catch (error){
    next(error);
  };
};

export const deleteTemplate = async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    if (template.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this template' });
    }

    await template.remove();
    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    template.comments.push({
      user: req.user.id,
      text: req.body.text
    });

    await template.save();
    
    const updatedTemplate = await Template.findById(req.params.id)
      .populate('comments.user', 'name');
    
    res.status(200).json(updatedTemplate.comments);
  } catch (error) {
    next(error);
  }
};
