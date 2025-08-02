const db = require('../../config/mysql');
const Categoria = require('../models/categoria');

const getAllCategorias = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM CATEGORIA');
    const categorias = rows.map(row => new Categoria(row));
    res.json({ data: categorias });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

const crearCategoria = async (req, res) => {
  try {
    const { ID_CATEGORIA, NOMBRE_CATEGORIA, DESCRIPCION_CATEGORIA } = req.body;

    if (!ID_CATEGORIA || !NOMBRE_CATEGORIA) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const query = `
      INSERT INTO CATEGORIA (ID_CATEGORIA, NOMBRE_CATEGORIA, DESCRIPCION_CATEGORIA)
      VALUES (?, ?, ?)
    `;

    const [result] = await db.query(query, [
      ID_CATEGORIA,
      NOMBRE_CATEGORIA,
      DESCRIPCION_CATEGORIA || null
    ]);

    res.status(201).json({ message: 'Categoría creada', insertId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};

const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { NOMBRE_CATEGORIA, DESCRIPCION_CATEGORIA } = req.body;

    if (!NOMBRE_CATEGORIA && !DESCRIPCION_CATEGORIA) {
      return res.status(400).json({ error: 'No hay datos para actualizar' });
    }

    const query = `
      UPDATE CATEGORIA
      SET NOMBRE_CATEGORIA = COALESCE(?, NOMBRE_CATEGORIA),
          DESCRIPCION_CATEGORIA = COALESCE(?, DESCRIPCION_CATEGORIA)
      WHERE ID_CATEGORIA = ?
    `;

    const [result] = await db.query(query, [
      NOMBRE_CATEGORIA || null,
      DESCRIPCION_CATEGORIA || null,
      id
    ]);

    res.json({ message: 'Categoría actualizada', affectedRows: result.affectedRows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
};

const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM CATEGORIA WHERE ID_CATEGORIA = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json({ message: 'Categoría eliminada', affectedRows: result.affectedRows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};

const verificarProductosPorCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'SELECT COUNT(*) AS cantidad FROM PRODUCTO WHERE ID_CATEGORIA = ?';
    const [rows] = await db.query(query, [id]);

    const cantidad = rows[0].cantidad;
    const tieneProductos = cantidad > 0;

    res.json({ tieneProductos });
  } catch (error) {
    console.error('Error al verificar productos por categoría:', error);
    res.status(500).json({ error: 'Error al verificar productos por categoría' });
  }
};


module.exports = {
  getAllCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  verificarProductosPorCategoria
};
