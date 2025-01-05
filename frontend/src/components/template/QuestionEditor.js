import React, { useState } from 'react';

const QuestionEditor = ({ template, onSave, onCancel, isAdmin }) => {
  const [questions, setQuestions] = useState([...template.questions]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', type: 'text', isRequired: false }]);
  };

  const handleRemoveQuestion = (index) => {
    if (isAdmin || questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="mt-6 space-y-6">
      {questions.map((question, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Question {index + 1}
              </h3>
              <div className="flex items-center space-x-2">
                {isAdmin && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveQuestion(index)}
                    className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <input
              type="text"
              value={question.text}
              onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
              placeholder="Question text"
              className="border rounded p-2 w-full"
            />
            <select
              value={question.type}
              onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="boolean">Yes/No</option>
            </select>
            <label>
              <input
                type="checkbox"
                checked={question.isRequired}
                onChange={(e) => handleQuestionChange(index, 'isRequired', e.target.checked)}
              />
              Required
            </label>
          </div>
        </div>
      ))}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={handleAddQuestion}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          Add Question
        </button>
        <div className="space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave({ ...template, questions })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionEditor;
