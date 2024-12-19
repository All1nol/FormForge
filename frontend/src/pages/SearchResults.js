import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

const SearchResults = () => {
  const query = new URLSearchParams(useLocation().search).get('query'); // Extract query from URL
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      const result = await api.searchTemplates(query);
      setResults(result.data);
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      <ul>
        {results.map((template) => (
          <li key={template._id}>
            <a href={`/template/${template._id}`}>{template.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
