import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const userRole = localStorage.getItem('userRole');
  const token = localStorage.getItem('token');

  if (!token || (role && userRole !== role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 