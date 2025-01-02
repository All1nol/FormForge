const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cyber-black">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-cyber-purple rounded-full animate-spin border-t-transparent"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-cyber-pink rounded-full animate-pulse opacity-50"></div>
      </div>
    </div>
  );
}; 