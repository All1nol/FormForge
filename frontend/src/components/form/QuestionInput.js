const QuestionInput = ({ question, value, onChange, required }) => {
  switch (question.type) {
    case 'text':
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(question._id, e.target.value)}
          required={required}
          className="form-control"
        />
      );
    
    case 'number':
      return (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(question._id, e.target.value)}
          required={required}
          className="form-control"
        />
      );
    
    case 'boolean':
      return (
        <select
          value={value || ''}
          onChange={(e) => onChange(question._id, e.target.value)}
          required={required}
          className="form-control"
        >
          <option value="">Select...</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    
    case 'date':
      return (
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(question._id, e.target.value)}
          required={required}
          className="form-control"
        />
      );
    
    default:
      return null;
  }
};

export default QuestionInput; 