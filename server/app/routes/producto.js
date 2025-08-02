// app/routes/producto.js
const express = require('express');
const router = express.Router();
const { getAllProductos, crearProducto, actualizarProducto, eliminarProducto } = require('../controllers/producto');

router.get('/', getAllProductos);
router.post('/crearProducto', crearProducto);
router.patch('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

module.exports = router;
