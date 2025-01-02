import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const result = await api.getUsers();
      setUsers(result.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to fetch users. Please try again later.');
    }
  };

  const handleBlockUnblock = async (userId, action) => {
    try {
      if (action === 'block') {
        await api.blockUser(userId);
      } else {
        await api.unblockUser(userId);
      }
      await fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || `Failed to ${action} user`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyber-pink to-cyber-purple bg-clip-text text-transparent">
        Admin Panel
      </h1>
      <div className="bg-cyber-gray rounded-xl p-6 shadow-lg border border-cyber-purple/30">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-cyber-purple">
              <tr>
                <th className="text-left py-4 px-6">Name</th>
                <th className="text-left py-4 px-6">Email</th>
                <th className="text-left py-4 px-6">Role</th>
                <th className="text-left py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr 
                  key={user._id}
                  className="border-b border-cyber-gray/30 hover:bg-cyber-blue/30 transition-colors"
                >
                  <td className="py-4 px-6">{user.name}</td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      user.role === 'admin' 
                        ? 'bg-cyber-pink/20 text-cyber-pink' 
                        : 'bg-cyber-purple/20 text-cyber-purple'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBlockUnblock(user._id, 'block')}
                        className="bg-cyber-pink/20 hover:bg-cyber-pink/30 px-4 py-2 rounded-lg
                                 text-cyber-pink border border-cyber-pink
                                 transition-all duration-300 hover:shadow-neon"
                      >
                        Block
                      </button>
                      <button
                        onClick={() => handleBlockUnblock(user._id, 'unblock')}
                        className="bg-cyber-purple/20 hover:bg-cyber-purple/30 px-4 py-2 rounded-lg
                                 text-cyber-purple border border-cyber-purple
                                 transition-all duration-300 hover:shadow-neon"
                      >
                        Unblock
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
