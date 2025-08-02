// app/models/usuario.js

/**
 * DTO del Usuario
 * Define la estructura del objeto que representa un usuario
 */

class Usuario {
  constructor({
    ID_USUARIO,
    NOMBRE_USUARIO,
    USERNAME_USUARIO,
    CORREO_USUARIO,
    CONTRASENIA_USUARIO,
    IMG_URL_USUARIO
  }) {
    this.ID_USUARIO = ID_USUARIO;
    this.NOMBRE_USUARIO = NOMBRE_USUARIO;
    this.USERNAME_USUARIO = USERNAME_USUARIO;
    this.CORREO_USUARIO = CORREO_USUARIO;
    this.CONTRASENIA_USUARIO = CONTRASENIA_USUARIO;
    this.IMG_URL_USUARIO = IMG_URL_USUARIO;
  }
}

module.exports = Usuario;
