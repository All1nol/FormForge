import { useEffect, useState } from 'react';
import api from '../services/api';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    fetchUsers();
  }, []);

  const handleBlockUnblock = async (userId, action) => {
    try {
      if (action === 'block') await api.blockUser(userId);
      if (action === 'unblock') await api.unblockUser(userId);
      const updatedUsers = await api.getUsers();
      setUsers(updatedUsers.data);
      setError(null);
    } catch (error) {
      setError(`Failed to ${action} user. Please try again.`);
      console.error(`Failed to ${action} user:`, error);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleBlockUnblock(user._id, 'block')}>Block</button>
                <button onClick={() => handleBlockUnblock(user._id, 'unblock')}>Unblock</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
