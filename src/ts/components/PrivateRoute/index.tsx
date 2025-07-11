import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

export const PrivateRoute = ({ isAuthenticated, children }: PrivateRouteProps) => (isAuthenticated ? children : <Navigate to="/" />);
