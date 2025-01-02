import React from 'react';

const DeleteTemplateModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-cyber-gray rounded-xl p-8 max-w-md w-full border border-cyber-purple/30 shadow-neon">
          <h3 className="text-2xl font-bold mb-4 text-cyber-pink">
            Delete Template
          </h3>
          
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete this template? This action cannot be undone.
          </p>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-cyber-purple 
                       hover:bg-cyber-blue/30 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg 
                       transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteTemplateModal; 