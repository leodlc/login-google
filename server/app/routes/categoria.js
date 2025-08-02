const express = require('express');
const router = express.Router();
const { getAllCategorias, crearCategoria } = require('../controllers/categoria');

router.get('/', getAllCategorias);
router.post('/crearCategoria', crearCategoria);

module.exports = router;
