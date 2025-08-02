export const validarUsuario = (usuario) => {
  const errores = {};

  if (!usuario.ID_USUARIO || isNaN(usuario.ID_USUARIO)) {
    errores.ID_USUARIO = 'El ID debe ser un número válido';
  }
  if (!usuario.NOMBRE_USUARIO || usuario.NOMBRE_USUARIO.trim() === '') {
    errores.NOMBRE_USUARIO = 'El nombre es obligatorio';
  }
  if (!usuario.USERNAME_USUARIO || usuario.USERNAME_USUARIO.trim() === '') {
    errores.USERNAME_USUARIO = 'El nombre de usuario es obligatorio';
  }
  if (!usuario.CORREO_USUARIO || !usuario.CORREO_USUARIO.includes('@')) {
    errores.CORREO_USUARIO = 'Correo electrónico inválido';
  }
  if (!usuario.CONTRASENIA_USUARIO || usuario.CONTRASENIA_USUARIO.length < 6) {
    errores.CONTRASENIA_USUARIO = 'La contraseña debe tener al menos 6 caracteres';
  }
  // IMG_URL_USUARIO es opcional, no valido aquí

  return errores;
};
