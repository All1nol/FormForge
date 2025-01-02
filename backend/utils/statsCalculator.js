export const calculateNumberStats = (numbers) => {
  const validNumbers = numbers
    .map(Number)
    .filter(n => !isNaN(n));

  if (validNumbers.length === 0) return null;

  return {
    average: (validNumbers.reduce((a, b) => a + b, 0) / validNumbers.length).toFixed(2),
    min: Math.min(...validNumbers),
    max: Math.max(...validNumbers),
    count: validNumbers.length,
    distribution: validNumbers.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {})
  };
};

export const calculateCategoryStats = (values) => {
  const frequency = values.reduce((acc, curr) => {
    const value = String(curr).trim();
    if (value) {
      acc[value] = (acc[value] || 0) + 1;
    }
    return acc;
  }, {});

  if (Object.keys(frequency).length === 0) return null;

  const sortedEntries = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1]);

  return {
    mostCommon: sortedEntries[0][0],
    frequency,
    count: values.length,
    percentages: Object.entries(frequency).reduce((acc, [value, count]) => {
      acc[value] = ((count / values.length) * 100).toFixed(1) + '%';
      return acc;
    }, {})
  };
}; 