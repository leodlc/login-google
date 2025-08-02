const express = require('express');
const router = express.Router();
const { listarUsuarios, crearUsuario } = require('../controllers/usuario');

router.get('/', listarUsuarios); // GET /api/1.0/usuario
router.post('/crearUsuario', crearUsuario);  // POST /api/1.0/usuario

module.exports = router;
