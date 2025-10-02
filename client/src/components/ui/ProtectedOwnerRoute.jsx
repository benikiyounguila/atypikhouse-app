import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../providers/UserProvider';

const ProtectedOwnerRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'owner') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedOwnerRoute; 