// controllers/usuario.js

const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const { httpError } = require('../helpers/handleError');
const db = require('../../config/mysql');



const listarUsuarios = async (req, res) => {
  try {
    const query = 'SELECT ID_USUARIO, NOMBRE_USUARIO, USERNAME_USUARIO, CORREO_USUARIO, IMG_URL_USUARIO FROM USUARIO';
    const [usuarios] = await db.query(query);

    res.json({ data: usuarios.map(user => new Usuario(user)) });
  } catch (error) {
    console.error('Error listarUsuarios:', error);
    httpError(res, error);
  }
};

const crearUsuario = async (req, res) => {
  try {
    const {
      ID_USUARIO,
      NOMBRE_USUARIO,
      USERNAME_USUARIO,
      CORREO_USUARIO,
      CONTRASENIA_USUARIO,
      IMG_URL_USUARIO
    } = req.body;

    if (!NOMBRE_USUARIO || !USERNAME_USUARIO || !CONTRASENIA_USUARIO) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(CONTRASENIA_USUARIO, saltRounds);

    const nuevoUsuario = new Usuario({
      ID_USUARIO,
      NOMBRE_USUARIO,
      USERNAME_USUARIO,
      CORREO_USUARIO,
      CONTRASENIA_USUARIO: hashedPassword,
      IMG_URL_USUARIO
    });

    const query = `
      INSERT INTO USUARIO 
        (ID_USUARIO, NOMBRE_USUARIO, USERNAME_USUARIO, CORREO_USUARIO, CONTRASENIA_USUARIO, IMG_URL_USUARIO)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.query(query, [
      nuevoUsuario.ID_USUARIO,
      nuevoUsuario.NOMBRE_USUARIO,
      nuevoUsuario.USERNAME_USUARIO,
      nuevoUsuario.CORREO_USUARIO,
      nuevoUsuario.CONTRASENIA_USUARIO,
      nuevoUsuario.IMG_URL_USUARIO
    ]);

    res.status(201).json({ message: 'Usuario creado correctamente' });
  } catch (error) {
    console.error('Error crearUsuario:', error);
    httpError(res, error);
  }
};

module.exports = {
  listarUsuarios,
  crearUsuario,
};
