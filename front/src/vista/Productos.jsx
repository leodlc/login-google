// src/paginas/Productos.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controlador/ProductoController';
import { obtenerCategorias } from '../controlador/CategoriaController';
import ProductoCard from '../componentes/ProductoCard';
import ValidatedInput from '../componentes/ValidatedInput';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [errores, setErrores] = useState({});

  const [formProducto, setFormProducto] = useState({
    ID_CATEGORIA: '',
    NOMBRE_PRODUCTO: '',
    DESCRIPCION_PRODUCTO: '',
    PRECIO_PRODUCTO: '',
    IMG_URL_PRODUCTO: '',
    IVA_PRODUCTO: false,
  });

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const cargarProductos = async () => {
    const data = await obtenerProductos();
    setProductos(data);
  };

  const cargarCategorias = async () => {
    const data = await obtenerCategorias();
    setCategorias(data);
  };

  const productosFiltrados = productos.filter(p =>
    p.NOMBRE_PRODUCTO.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleOpenModal = () => {
    setModoEdicion(false);
    setFormProducto({
      ID_CATEGORIA: '',
      NOMBRE_PRODUCTO: '',
      DESCRIPCION_PRODUCTO: '',
      PRECIO_PRODUCTO: '',
      IMG_URL_PRODUCTO: '',
      IVA_PRODUCTO: false,
    });
    setErrores({});
    setOpenModal(true);
  };

  const handleEditarProducto = (producto) => {
    setModoEdicion(true);
    setProductoEditar(producto);
    setFormProducto({
      ...producto,
      PRECIO_PRODUCTO: producto.PRECIO_PRODUCTO.toString()
    });
    setErrores({});
    setOpenModal(true);
  };

  const handleEliminarProducto = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (!confirmar) return;

    try {
      await eliminarProducto(id);
      await cargarProductos();
    } catch (error) {
      alert('Error al eliminar el producto');
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setProductoEditar(null);
    setModoEdicion(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormProducto(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleGuardarProducto = async () => {
    if (
      !formProducto.NOMBRE_PRODUCTO.trim() ||
      !formProducto.ID_CATEGORIA ||
      !formProducto.PRECIO_PRODUCTO
    ) {
      alert('Por favor, completa los campos obligatorios: Nombre, Categoría y Precio');
      return;
    }

    const productoFormateado = {
      ...formProducto,
      PRECIO_PRODUCTO: parseFloat(formProducto.PRECIO_PRODUCTO),
    };

    try {
      if (modoEdicion && productoEditar) {
        await actualizarProducto(productoEditar.ID_PRODUCTO, productoFormateado);
      } else {
        productoFormateado.ID_PRODUCTO = Math.floor(Math.random() * 1000000);
        await crearProducto(productoFormateado);
      }

      await cargarProductos();
      handleCloseModal();
    } catch (error) {
      alert('Error al guardar el producto');
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">Productos</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
          Añadir Producto
        </Button>
      </Box>

      <ValidatedInput
        label="Buscar producto"
        name="busqueda"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por nombre"
        regexPermitido={/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]*$/}
        error={''}
        setError={() => {}}
      />

      <Grid container spacing={2} mt={1}>
        {productosFiltrados.map(producto => (
          <Grid item xs={12} sm={6} md={4} key={producto.ID_PRODUCTO}>
            <ProductoCard
              producto={producto}
              onEditar={handleEditarProducto}
              onEliminar={handleEliminarProducto}
            />
          </Grid>
        ))}
      </Grid>

      {/* Modal de Crear/Editar Producto */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>{modoEdicion ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Categoría</InputLabel>
            <Select
              name="ID_CATEGORIA"
              value={formProducto.ID_CATEGORIA}
              onChange={handleInputChange}
              label="Categoría"
              required
            >
              {categorias.map(cat => (
                <MenuItem key={cat.ID_CATEGORIA} value={cat.ID_CATEGORIA}>
                  {cat.NOMBRE_CATEGORIA}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ValidatedInput
            label="Nombre"
            name="NOMBRE_PRODUCTO"
            value={formProducto.NOMBRE_PRODUCTO}
            onChange={handleInputChange}
            placeholder="Nombre del producto"
            regexPermitido={/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]{0,100}$/}
            error={errores.NOMBRE_PRODUCTO}
            setError={setErrores}
          />

          <ValidatedInput
            label="Descripción"
            name="DESCRIPCION_PRODUCTO"
            value={formProducto.DESCRIPCION_PRODUCTO}
            onChange={handleInputChange}
            placeholder="Descripción detallada"
            regexPermitido={/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,\s]{0,500}$/}
            error={errores.DESCRIPCION_PRODUCTO}
            setError={setErrores}
          />

          <ValidatedInput
            label="Precio"
            name="PRECIO_PRODUCTO"
            value={formProducto.PRECIO_PRODUCTO}
            onChange={handleInputChange}
            placeholder="0.00"
            regexPermitido={/^[0-9.]{0,10}$/}
            error={errores.PRECIO_PRODUCTO}
            setError={setErrores}
            type="text"
          />

          <ValidatedInput
            label="URL Imagen"
            name="IMG_URL_PRODUCTO"
            value={formProducto.IMG_URL_PRODUCTO}
            onChange={handleInputChange}
            placeholder="http://imagen.jpg"
            regexPermitido={/^.{0,500}$/}
            error={errores.IMG_URL_PRODUCTO}
            setError={setErrores}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formProducto.IVA_PRODUCTO}
                onChange={handleInputChange}
                name="IVA_PRODUCTO"
              />
            }
            label="¿Aplica IVA?"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleGuardarProducto} variant="contained">
            {modoEdicion ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Productos;
