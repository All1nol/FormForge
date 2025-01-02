import React from 'react';

const QuestionItem = ({ question, index, onChange }) => {
  return (
    <div className="question-item">
      <input
        type="text"
        value={question.text}
        onChange={(e) => onChange(index, 'text', e.target.value)}
        placeholder="Question text"
      />
      <select
        value={question.type}
        onChange={(e) => onChange(index, 'type', e.target.value)}
      >
        <option value="text">Text</option>
        <option value="number">Number</option>
        <option value="boolean">Yes/No</option>
      </select>
      <label>
        <input
          type="checkbox"
          checked={question.isRequired}
          onChange={(e) => onChange(index, 'isRequired', e.target.checked)}
        />
        Required
      </label>
    </div>
  );
};

export default QuestionItem; 