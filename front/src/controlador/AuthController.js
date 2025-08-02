// src/controlador/AuthController.js
import axios from 'axios';
import config from '../config';

export const login = async (username, password) => {
  const response = await axios.post(`${config.SERVER_URL}/auth/login`, {
    username,
    password,
  });
  return response.data; // { message, token, usuario }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
};

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};
