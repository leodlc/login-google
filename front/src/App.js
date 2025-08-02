// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './vista/Login';
import Dashboard from './vista/Dashboard';
import RegistroUsuario from './vista/RegistroUsuario'; // Importa aquí
import PrivateRoute from './componentes/PrivateRoute';
import PublicRoute from './componentes/PublicRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/registro" element={
          <PublicRoute>
            <RegistroUsuario />
          </PublicRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
