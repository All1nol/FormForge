import TemplateCard from '../components/TemplateCard';
import { useState, useEffect } from 'react';
import api from '../services/api.js';
// import TagCloud from '../components/TagCloud.js';
const MainPage = () => {
  const [templates, setTemplates] = useState([]);
  const [popularTemplates, setPopularTemplates] = useState([]);
  const [isAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    // Fetch latest templates
    const fetchTemplates = async () => {
      try {
        const result = await api.getTemplates();
        setTemplates(result.data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    // Fetch top 5 most popular templates
    const fetchPopularTemplates = async () => {
      try {
        const result = await api.getPopularTemplates();
        setPopularTemplates(result.data);
      } catch (error) {
        console.error('Error fetching popular templates:', error);
      }
    };

    fetchTemplates();
    fetchPopularTemplates();
  }, []);

  return (
    <div>
      <h1>Gallery of Latest Templates</h1>
      <div className="gallery">
        {templates.map((template) => (
          <TemplateCard 
            key={template._id} 
            template={template} 
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
      <h2>Top 5 Popular Templates</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Author</th>
            <th>Forms Filled</th>
          </tr>
        </thead>
        <tbody>
          {popularTemplates.map((template) => (
            <tr key={template._id}>
              <td>{template.title}</td>
              <td>{template.createdBy?.name || 'Unknown'}</td>
              <td>{template.filledFormsCount || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <TagCloud /> */}
    </div>
  );
};

export default MainPage;
