import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const LoginRegister = ({ initialIsRegister }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(!initialIsRegister);
  
  // Reset isLogin when path changes
  useEffect(() => {
    const isRegisterPath = location.pathname === '/register';
    setIsLogin(!isRegisterPath);
  }, [location.pathname]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        const response = await api.login({ email, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.role);
        window.location.href = response.data.role === 'admin' ? '/admin' : '/user';
      } else {
        const response = await api.register({ name, email, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.role);
        window.location.href = '/user';
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Toggle function now updates URL
  const toggleForm = () => {
    const newPath = isLogin ? '/register' : '/login';
    navigate(newPath);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-cyber-gray w-full max-w-md rounded-xl p-8 border border-cyber-purple/30 mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyber-pink to-cyber-purple bg-clip-text text-transparent">
          {isLogin ? 'Welcome Back' : 'Join FormForge'}
        </h1>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6 border border-red-500/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-cyber-blue border border-cyber-purple rounded-lg p-3 
                         text-white focus:outline-none focus:ring-2 focus:ring-cyber-pink 
                         focus:border-transparent transition-all duration-300"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-cyber-blue border border-cyber-purple rounded-lg p-3 
                       text-white focus:outline-none focus:ring-2 focus:ring-cyber-pink 
                       focus:border-transparent transition-all duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-cyber-blue border border-cyber-purple rounded-lg p-3 
                       text-white focus:outline-none focus:ring-2 focus:ring-cyber-pink 
                       focus:border-transparent transition-all duration-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyber-purple hover:bg-opacity-80 py-3 rounded-lg 
                     transition-all duration-300 shadow-neon-hover disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <button
          onClick={toggleForm}
          className="w-full mt-4 text-gray-400 hover:text-cyber-pink transition-colors"
        >
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default LoginRegister;
