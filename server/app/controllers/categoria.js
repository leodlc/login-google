const db = require('../../config/mysql');
const Categoria = require('../models/categoria');

const getAllCategorias = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM CATEGORIA');
    // Opcional: mapear a objetos Categoria
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

module.exports = {
  getAllCategorias,
  crearCategoria
};
