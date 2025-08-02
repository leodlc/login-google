// src/componentes/PrivateRoute.jsx para rutas privadas
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../controlador/AuthController';

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

export default PrivateRoute;
