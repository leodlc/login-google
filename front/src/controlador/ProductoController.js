// src/controlador/ProductoController.js
import axios from 'axios';
import config from '../config';

const API_BASE_URL = `${config.SERVER_URL}/producto`;

export const obtenerProductos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
};

export const crearProducto = async (producto) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/crearProducto`, producto);
    return response.data;
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};

export const actualizarProducto = async (id, campos) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${id}`, campos);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

export const eliminarProducto = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};
