import axios from 'axios';
import config from '../config';

const API_BASE_URL = `${config.SERVER_URL}/categoria`;

export const obtenerCategorias = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return [];
  }
};

export const crearCategoria = async (categoria) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/crearCategoria`, categoria);
    return response.data;
  } catch (error) {
    console.error('Error al crear categoría:', error);
    throw error;
  }
};

export const actualizarCategoria = async (id, categoria) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${id}`, categoria);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar categoría con ID ${id}:`, error);
    throw error;
  }
};

export const eliminarCategoria = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar categoría con ID ${id}:`, error);
    throw error;
  }
};

export const verificarProductosPorCategoria = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}/validarProductos`);
    return response.data.tieneProductos; // true o false
  } catch (error) {
    console.error(`Error al validar productos de la categoría ${id}:`, error);
    return false;
  }
};

