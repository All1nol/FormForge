import React from 'react';

const QuestionViewer = ({ template, onEdit }) => {
  return (
    <div className="mt-6 space-y-6">
      {template.questions.map((question, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Question {index + 1}
              </h3>
              <p className="mt-2 text-gray-700">{question.text}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm ${
                question.type === 'text' ? 'bg-blue-100 text-blue-800' :
                question.type === 'number' ? 'bg-green-100 text-green-800' :
                question.type === 'date' ? 'bg-purple-100 text-purple-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {question.type}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                question.isRequired ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {question.isRequired ? 'Required' : 'Optional'}
              </span>
            </div>
          </div>
        </div>
      ))}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onEdit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Edit Questions
        </button>
      </div>
    </div>
  );
};

export default QuestionViewer;