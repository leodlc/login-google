const express = require('express');
const router = express.Router();
const {
  getAllCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  verificarProductosPorCategoria
} = require('../controllers/categoria');

router.get('/', getAllCategorias);
router.post('/crearCategoria', crearCategoria);
router.patch('/:id', actualizarCategoria);
router.delete('/:id', eliminarCategoria);

router.get('/:id/validarProductos', verificarProductosPorCategoria);

module.exports = router;
