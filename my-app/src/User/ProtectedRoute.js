import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ( { children }) => {
  // const navigate = useNavigate();
  const isAuthenticated = Cookies.get('token') != null;
if (isAuthenticated) {
  return children;
};

return <Navigate to="/classes" />;
};

export default ProtectedRoute;
