// src/controlador/AuthController.js
import axios from 'axios';
import config from '../config';

export const login = async (username, password) => {
  const response = await axios.post(`${config.SERVER_URL}/auth/login`, {
    username,
    password,
  });
  return response.data;
};

export const loginConGoogle = async (googleUser) => {
  // Puedes ajustar los campos según los que uses en tu backend
  const { email, displayName, photoURL, uid } = googleUser;

  const response = await axios.post(`${config.SERVER_URL}/auth/google-login`, {
    email,
    nombre: displayName,
    foto: photoURL,
    uid,
  });

  return response.data; // { token, usuario }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
};

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};
