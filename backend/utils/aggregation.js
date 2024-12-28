// backend/utils/aggregation.js
export const aggregateResponses = (responses) => {
    const results = {};
  
    responses.forEach(response => {
      response.answers.forEach(answer => {
        const { questionId, answer: value } = answer;
  
        if (!results[questionId]) {
          results[questionId] = {
            count: 0,
            total: 0,
            values: []
          };
        }
  
        results[questionId].count += 1;
        results[questionId].total += typeof value === 'number' ? value : 0;
        results[questionId].values.push(value);
      });
    });
  
    // Calculate averages and other metrics
    for (const questionId in results) {
      results[questionId].average = results[questionId].total / results[questionId].count || 0;
    }
  
    return results;
  };