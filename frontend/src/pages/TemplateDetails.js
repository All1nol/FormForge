import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const TemplateDetails = () => {
  const { id } = useParams(); // Template ID from the URL
  const [template, setTemplate] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchTemplateDetails = async () => {
      const result = await api.getTemplateById(id);
      setTemplate(result.data);
      setComments(result.data.comments || []);
    };

    fetchTemplateDetails();
  }, [id]);

  const handleAddComment = async (comment) => {
    const updatedComments = await api.addCommentToTemplate(id, comment);
    setComments(updatedComments.data);
  };

  return (
    <div>
      {template ? (
        <>
          <h1>{template.name}</h1>
          <p>{template.description}</p>
          <h3>Questions:</h3>
          <ul>
            {template.questions.map((question) => (
              <li key={question._id}>{question.text}</li>
            ))}
          </ul>
          <h3>Comments:</h3>
          <ul>
            {comments.map((comment) => (
              <li key={comment._id}>{comment.text}</li>
            ))}
          </ul>
          <button onClick={() => handleAddComment('New Comment!')}>Add Comment</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TemplateDetails;
