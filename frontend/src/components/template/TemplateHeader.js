import React from 'react';

const TemplateHeader = ({ template, onEdit, onDelete, showEditButton }) => {
  return (
    <div className="mb-8 p-8 bg-cyber-gray rounded-xl border border-cyber-purple/30">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyber-pink to-cyber-purple bg-clip-text text-transparent">
            {template.title}
          </h1>
          <p className="text-gray-300 max-w-2xl">{template.description}</p>
        </div>
        {showEditButton && (
          <div className="flex gap-4">
            <button
              onClick={onEdit}
              className="bg-cyber-purple hover:bg-opacity-80 px-6 py-3 rounded-lg 
                       transition-all duration-300 shadow-neon-hover flex items-center space-x-2"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                />
              </svg>
              <span>Edit Template</span>
            </button>
            <button
              onClick={onDelete}
              className="bg-cyber-pink hover:bg-opacity-80 px-6 py-3 rounded-lg 
                       transition-all duration-300 shadow-neon-hover flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Delete Template</span>
            </button>
          </div>
        )}
      </div>
      <div className="mt-6 flex space-x-4 text-sm text-gray-400">
        <div>Created: {new Date(template.createdAt).toLocaleDateString()}</div>
        <div>By: {template.user?.name || 'Anonymous'}</div>
      </div>
    </div>
  );
};

export default TemplateHeader; 