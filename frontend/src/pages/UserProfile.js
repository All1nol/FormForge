import React, { useState } from 'react';
import api from '../api'; // Assuming you have an API utility for making requests

const UserProfile = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.createSalesforceAccount(userInfo);
      console.log('Account created successfully:', response.data);
      // Optionally, you can close the form or show a success message
      setIsFormOpen(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>User Profile</h1>
      <button onClick={() => setIsFormOpen(true)}>Create Salesforce Account</button>

      {isFormOpen && (
        <form onSubmit={handleSubmit}>
          <h2>Create Salesforce Account</h2>
          {error && <div className="error-message">{error}</div>}
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={userInfo.firstName}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={userInfo.lastName}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userInfo.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={userInfo.phone}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={userInfo.company}
            onChange={handleInputChange}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      )}
    </div>
  );
};

export default UserProfile; 