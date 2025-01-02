const ErrorMessage = ({ message }) => {
  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center p-4">
      <div className="bg-cyber-gray p-8 rounded-xl border border-red-500/50 max-w-md w-full">
        <div className="flex items-center justify-center mb-4">
          <svg 
            className="w-12 h-12 text-red-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-center text-red-500 mb-2">Error</h3>
        <p className="text-gray-300 text-center">{message}</p>
      </div>
    </div>
  );
}; 