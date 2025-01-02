import asyncHandler from 'express-async-handler';
import Template from '../../models/Template.js';
import Form from '../../models/Form.js';

const calculateNumberStats = (numbers) => {
  if (numbers.length === 0) return null;
  
  return {
    average: (numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(2),
    min: Math.min(...numbers),
    max: Math.max(...numbers),
    count: numbers.length,
    distribution: numbers.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {})
  };
};

const calculateCategoryStats = (answers, totalSubmissions) => {
  console.log('Calculating stats:', { answers, totalSubmissions });

  const frequency = answers.reduce((acc, curr) => {
    const value = String(curr).trim();
    if (value) {
      acc[value] = (acc[value] || 0) + 1;
    }
    return acc;
  }, {});

  const responseCount = answers.filter(answer => answer && answer.trim()).length;
  const responseRate = totalSubmissions > 0 
    ? ((responseCount / totalSubmissions) * 100).toFixed(1)
    : '0.0';

  const sortedEntries = Object.entries(frequency)
    .sort(([, a], [, b]) => b - a);

  console.log('Stats calculated:', { 
    responseCount, 
    responseRate, 
    frequency, 
    totalSubmissions 
  });

  return {
    responseRate,
    commonAnswers: sortedEntries.slice(0, 3).map(([value]) => value),
    frequency,
    count: responseCount,
    totalSubmissions
  };
};

export const getTemplateAggregation = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }

  const submissions = await Form.find({ template: template._id })
    .populate('user', 'name email')
    .lean();

  const totalSubmissions = submissions.length;
  console.log('Total submissions found:', totalSubmissions);

  const aggregatedResults = {
    questionStats: {}
  };

  template.questions.forEach(question => {
    console.log('Processing question:', question.text);

    const answers = submissions
      .map(submission => submission.answers[question._id])
      .filter(answer => answer !== undefined);

    console.log('Answers found for question:', answers.length);

    const stats = calculateCategoryStats(answers, totalSubmissions);

    aggregatedResults.questionStats[question._id] = {
      responseRate: stats.responseRate,
      commonAnswers: stats.commonAnswers,
      totalResponses: stats.count,
      totalSubmissions: stats.totalSubmissions
    };
  });

  aggregatedResults.completionRate = totalSubmissions > 0 
    ? '100.0' 
    : '0.0';

  aggregatedResults.totalSubmissions = totalSubmissions;

  console.log('Final aggregated results:', aggregatedResults);
  res.json(aggregatedResults);
}); 