// src/modelos/LoginModel.js

export const validarLogin = ({ username, password }) => {
  const errores = {};

  if (!username || username.length < 3) {
    errores.username = 'El usuario debe tener al menos 3 caracteres';
  }

  if (!password || password.length < 6) {
    errores.password = 'La contraseña debe tener al menos 6 caracteres';
  }

  return errores;
};
