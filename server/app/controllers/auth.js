const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { httpError } = require('../helpers/handleError');
const mysqlDb = require('../../config/mysql'); // renombrado
const { db: firestoreDb, admin } = require('../../config/firebase'); // renombrado
const Usuario = require('../models/usuario');

function generarIdEntero() {
  return Math.floor(100000 + Math.random() * 900000);
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const query = `
      SELECT * FROM USUARIO
      WHERE USERNAME_USUARIO = ? OR CORREO_USUARIO = ?
      LIMIT 1
    `;
    const [rows] = await mysqlDb.query(query, [username, username]);

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


const loginConGoogle = async (req, res) => {
  try {
    const { email, nombre, foto } = req.body;

    if (!email || !nombre) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Verificar si el usuario ya existe por correo
    const [rows] = await mysqlDb.query(
      'SELECT * FROM USUARIO WHERE CORREO_USUARIO = ? LIMIT 1',
      [email]
    );

    let usuario;

    if (rows.length === 0) {
      // Generar nuevo ID entero único (simple, verifica colisión)
      let nuevoID;
      let idExiste = true;

      while (idExiste) {
        nuevoID = generarIdEntero();
        const [resId] = await mysqlDb.query('SELECT 1 FROM USUARIO WHERE ID_USUARIO = ? LIMIT 1', [nuevoID]);
        if (resId.length === 0) {
          idExiste = false;
        }
      }

      const nuevoUsuario = new Usuario({
        ID_USUARIO: nuevoID,
        NOMBRE_USUARIO: nombre,
        USERNAME_USUARIO: email.split('@')[0],
        CORREO_USUARIO: email,
        CONTRASENIA_USUARIO: '', // Sin contraseña (login Google)
        IMG_URL_USUARIO: foto || null,
      });

      const insertQuery = `
        INSERT INTO USUARIO (ID_USUARIO, NOMBRE_USUARIO, USERNAME_USUARIO, CORREO_USUARIO, CONTRASENIA_USUARIO, IMG_URL_USUARIO)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await mysqlDb.query(insertQuery, [
        nuevoUsuario.ID_USUARIO,
        nuevoUsuario.NOMBRE_USUARIO,
        nuevoUsuario.USERNAME_USUARIO,
        nuevoUsuario.CORREO_USUARIO,
        nuevoUsuario.CONTRASENIA_USUARIO,
        nuevoUsuario.IMG_URL_USUARIO
      ]);

      // Guardar en Firestore con el mismo ID
      await firestoreDb.collection('usuarios').doc(nuevoUsuario.ID_USUARIO.toString()).set({
        nombre: nuevoUsuario.NOMBRE_USUARIO,
        username: nuevoUsuario.USERNAME_USUARIO,
        correo: nuevoUsuario.CORREO_USUARIO,
        imgUrl: nuevoUsuario.IMG_URL_USUARIO,
        creadoEn: admin.firestore.FieldValue.serverTimestamp(),
      });

      usuario = nuevoUsuario;

    } else {
      usuario = new Usuario(rows[0]);

      // Actualizar datos en Firestore (merge para no sobreescribir campos existentes)
      await firestoreDb.collection('usuarios').doc(usuario.ID_USUARIO.toString()).set({
        nombre: usuario.NOMBRE_USUARIO,
        username: usuario.USERNAME_USUARIO,
        correo: usuario.CORREO_USUARIO,
        imgUrl: usuario.IMG_URL_USUARIO,
        actualizadoEn: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: usuario.ID_USUARIO, username: usuario.USERNAME_USUARIO },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { CONTRASENIA_USUARIO, ...usuarioSinPass } = usuario;

    res.json({
      message: 'Inicio de sesión con Google exitoso',
      token,
      usuario: usuarioSinPass,
    });

  } catch (e) {
    console.error('Error en loginConGoogle:', e);
    httpError(res, e);
  }
};

module.exports = { login, loginConGoogle };
