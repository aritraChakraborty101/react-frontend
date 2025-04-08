import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles, role }) => {
  console.log('ProtectedRoute: User Role:', role); // Debugging
  console.log('ProtectedRoute: Allowed Roles:', allowedRoles); // Debugging

  if (!role) {
    return <Navigate to="/" />;
  }

  return allowedRoles.includes(role) ? children : <Navigate to="/" />;
};

export default ProtectedRoute;