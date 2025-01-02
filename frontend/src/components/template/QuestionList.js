import React from 'react';
import QuestionItem from './QuestionItem';

const QuestionList = ({ questions, isEditing, onQuestionChange, onAddQuestion }) => {
  return (
    <div className="questions-section">
      {isEditing ? (
        <>
          {questions.map((question, index) => (
            <QuestionItem
              key={index}
              question={question}
              index={index}
              onChange={onQuestionChange}
            />
          ))}
          <button onClick={onAddQuestion}>Add Question</button>
        </>
      ) : (
        <>
          {questions.map((question, index) => (
            <div key={index} className="question-display">
              <h3>Question {index + 1}</h3>
              <p>{question.text}</p>
              <p>Type: {question.type}</p>
              <p>{question.isRequired ? 'Required' : 'Optional'}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default QuestionList; 