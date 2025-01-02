import asyncHandler from 'express-async-handler';
import Template from '../../models/Template.js';

export const getTemplates = asyncHandler(async (req, res) => {
  const templates = await Template.find({ accessType: 'all' })
    .populate('user', 'name email');
  res.json(templates);
});

export const getPopularTemplates = asyncHandler(async (req, res) => {
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

  const transformedTemplates = templates.map(template => ({
    ...template,
    user: template.user ? { name: template.user.name } : { name: 'Anonymous' }
  }));

  res.json(transformedTemplates);
}); 