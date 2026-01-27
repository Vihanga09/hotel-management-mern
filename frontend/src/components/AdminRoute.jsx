import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.isAdmin === true ? children : <Navigate to="/login" />;
}

export default AdminRoute;
