const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { httpError } = require('../helpers/handleError');
const db = require('../../config/mysql');
const Usuario = require('../models/usuario');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const query = `
      SELECT * FROM USUARIO
      WHERE USERNAME_USUARIO = ? OR CORREO_USUARIO = ?
      LIMIT 1
    `;
    const [rows] = await db.query(query, [username, username]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuario = new Usuario(rows[0]);

    const isMatch = await bcrypt.compare(password, usuario.CONTRASENIA_USUARIO);
    if (!isMatch) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: usuario.ID_USUARIO, username: usuario.USERNAME_USUARIO },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { CONTRASENIA_USUARIO, ...usuarioSinPass } = usuario;

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      usuario: usuarioSinPass
    });

  } catch (e) {
    console.error("Error en login:", e);
    httpError(res, e);
  }
};

module.exports = { login };
