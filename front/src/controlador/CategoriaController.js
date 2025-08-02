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
