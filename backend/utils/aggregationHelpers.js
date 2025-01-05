const aggregateNumbers = (answers) => {
  if (!answers || answers.length === 0) return null;
  
  const numbers = answers.map(Number).filter(n => !isNaN(n));
  if (numbers.length === 0) return null;

  return {
    type: 'number',
    average: numbers.reduce((a, b) => a + b, 0) / numbers.length,
    min: Math.min(...numbers),
    max: Math.max(...numbers),
    count: numbers.length
  };
};

const aggregateText = (answers) => {
  if (!answers || answers.length === 0) return null;
  
  const frequencies = answers.reduce((acc, answer) => {
    const key = String(answer).trim();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return {
    type: 'text',
    frequencies,
    count: answers.length
  };
};

module.exports = { aggregateNumbers, aggregateText }; 