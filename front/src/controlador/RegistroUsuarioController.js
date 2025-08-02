import axios from 'axios';
import config from '../config';

/**
 * Genera un número entero aleatorio de 6 dígitos.
 */
const generarIdAleatorio = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

/**
 * Obtiene todos los IDs actuales de usuarios.
 */
const obtenerIdsExistentes = async () => {
  try {
    const response = await axios.get(`${config.SERVER_URL}/usuario`);
    return response.data.data.map(usuario => usuario.ID_USUARIO);
  } catch (error) {
    throw { error: 'Error al obtener usuarios existentes' };
  }
};

/**
 * Genera un ID único que no esté en la lista de existentes.
 */
const generarIdUnico = async () => {
  const idsExistentes = await obtenerIdsExistentes();
  let nuevoId;

  do {
    nuevoId = generarIdAleatorio();
  } while (idsExistentes.includes(nuevoId));

  return nuevoId;
};

export const obtenerUsuarios = async () => {
  try {
    const response = await axios.get(`${config.SERVER_URL}/usuario`);
    return response.data.data; // Lista completa de usuarios
  } catch (error) {
    throw { error: 'Error al obtener usuarios' };
  }
};


/**
 * Registra un nuevo usuario con un ID único generado.
 */
export const registrarUsuario = async (usuarioData) => {
  try {
    const idUnico = await generarIdUnico();
    const usuarioConId = { ...usuarioData, ID_USUARIO: idUnico };

    const response = await axios.post(`${config.SERVER_URL}/usuario/crearUsuario`, usuarioConId);
    return response.data; // { message: "Usuario creado correctamente" }
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Error de conexión con el servidor' };
  }
};
