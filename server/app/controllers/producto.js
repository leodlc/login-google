// app/controllers/producto.js
const Producto = require('../models/producto');
const db = require('../../config/mysql');

const getAllProductos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM PRODUCTO');
    const productos = rows.map(row => new Producto(row));
    res.json({ data: productos });
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

const crearProducto = async (req, res) => {
  try {
    const productoData = req.body;
    const nuevoProducto = new Producto(productoData);

    const query = `
      INSERT INTO PRODUCTO 
      (ID_PRODUCTO, ID_CATEGORIA, NOMBRE_PRODUCTO, DESCRIPCION_PRODUCTO, PRECIO_PRODUCTO, IMG_URL_PRODUCTO, IVA_PRODUCTO)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      nuevoProducto.ID_PRODUCTO,
      nuevoProducto.ID_CATEGORIA,
      nuevoProducto.NOMBRE_PRODUCTO,
      nuevoProducto.DESCRIPCION_PRODUCTO,
      nuevoProducto.PRECIO_PRODUCTO,
      nuevoProducto.IMG_URL_PRODUCTO,
      nuevoProducto.IVA_PRODUCTO
    ]);

    res.status(201).json({ message: 'Producto creado', insertId: result.insertId });
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// Actualizar parcialmente un producto (PATCH)
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const camposActualizar = req.body;

    // Construir dinámicamente la query de actualización
    const campos = Object.keys(camposActualizar);
    const valores = Object.values(camposActualizar);

    if (campos.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }

    const setString = campos.map(campo => `${campo} = ?`).join(', ');
    const query = `UPDATE PRODUCTO SET ${setString} WHERE ID_PRODUCTO = ?`;
    valores.push(id);

    const [result] = await db.query(query, valores);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// Eliminar un producto (DELETE)
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM PRODUCTO WHERE ID_PRODUCTO = ?';
    const [result] = await db.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

module.exports = {
  getAllProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
