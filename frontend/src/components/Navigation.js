import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-cyber-black/95 backdrop-blur-sm border-b border-cyber-purple/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-cyber-pink via-cyber-purple to-cyber-pink 
                         bg-clip-text text-transparent hover:opacity-80 transition-opacity
                         hover:scale-105 transform duration-300"
            >
              FormForge
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to="/user" 
                  className="text-white hover:text-cyber-pink transition-colors px-3 py-2
                           hover:scale-105 transform duration-300"
                >
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="text-white hover:text-cyber-pink transition-colors px-3 py-2
                             hover:scale-105 transform duration-300"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="bg-cyber-gray hover:bg-cyber-blue px-4 py-2 rounded-lg 
                           border border-cyber-pink/50 hover:border-cyber-pink
                           text-white hover:text-cyber-pink
                           transition-all duration-300 hover:shadow-neon
                           hover:scale-105 transform"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="bg-cyber-purple/20 hover:bg-cyber-purple/30 px-6 py-2 rounded-lg 
                           text-white border border-cyber-purple
                           transition-all duration-300 hover:shadow-neon
                           hover:scale-105 transform"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-cyber-pink/20 hover:bg-cyber-pink/30 px-6 py-2 rounded-lg 
                           text-white border border-cyber-pink
                           transition-all duration-300 hover:shadow-neon
                           hover:scale-105 transform"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 