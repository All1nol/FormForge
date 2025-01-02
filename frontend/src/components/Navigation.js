import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-[#0D0D0F] border-b border-cyber-purple/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-cyber-pink via-cyber-purple to-cyber-pink bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              FormForge
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  to="/user" 
                  className="text-gray-400 hover:text-cyber-pink transition-colors px-3 py-2"
                >
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="text-gray-400 hover:text-cyber-pink transition-colors px-3 py-2"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="bg-[#1A1A1F] hover:bg-[#252A34] px-4 py-2 rounded-lg 
                           border border-cyber-pink/50 hover:border-cyber-pink
                           text-gray-300 hover:text-white
                           transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="bg-cyber-purple/20 hover:bg-cyber-purple/30 px-6 py-2 rounded-lg 
                           text-cyber-purple hover:text-white border border-cyber-purple
                           transition-all duration-300 hover:shadow-neon"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-cyber-pink/20 hover:bg-cyber-pink/30 px-6 py-2 rounded-lg 
                           text-cyber-pink hover:text-white border border-cyber-pink
                           transition-all duration-300 hover:shadow-neon"
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