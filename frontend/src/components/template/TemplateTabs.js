import React from 'react';

const TemplateTabs = ({ activeTab, tabs, onTabChange }) => {
  return (
    <div className="flex space-x-1 bg-cyber-gray p-1 rounded-lg mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex-1 py-3 px-6 rounded-lg transition-all duration-300
            ${activeTab === tab.id 
              ? 'bg-cyber-purple text-white shadow-neon' 
              : 'text-gray-400 hover:text-white hover:bg-cyber-blue/30'}
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TemplateTabs; 