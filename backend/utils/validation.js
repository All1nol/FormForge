export const validateTemplateFields = (title, description, questions) => {
  const errors = [];
  if (!title) errors.push('Title is required');
  if (!description) errors.push('Description is required');
  if (!Array.isArray(questions) || questions.length === 0) {
    errors.push('At least one question is required');
  }
  return errors;
};

export const validateResponseAnswers = (template, answers) => {
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
  return errors;
};
