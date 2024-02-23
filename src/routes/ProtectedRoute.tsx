import React from 'react';
import { Navigate } from 'react-router-dom';
import LayoutSystem from 'containers/Layout';
interface ProtectedProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedProps) => {
  const isLoggin: boolean = true;

  return isLoggin ? (
    <LayoutSystem>{children}</LayoutSystem>
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;
function getLocalToken(): boolean {
  throw new Error('Function not implemented.');
}
