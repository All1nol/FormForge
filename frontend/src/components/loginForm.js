import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      navigate('/user');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-cyber-gray rounded-xl p-8 shadow-lg border border-cyber-purple/30">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyber-pink to-cyber-purple bg-clip-text text-transparent">
          Login
        </h2>
        
        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyber-pink hover:text-cyber-purple transition-colors">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
