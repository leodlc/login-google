// src/componentes/PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../controlador/AuthController';

const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoute;
