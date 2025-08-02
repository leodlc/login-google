import React, { useEffect, useState } from 'react';
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  verificarProductosPorCategoria
} from '../controlador/CategoriaController';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ValidatedInput from '../componentes/ValidatedInput';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [errores, setErrores] = useState({});
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: '', descripcion: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const regexDescripcion = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,:;()\-_\s]+$/;

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    const data = await obtenerCategorias();
    setCategorias(data);
  };

  const categoriasFiltradas = categorias.filter(categoria =>
    categoria.NOMBRE_CATEGORIA.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleOpenModal = (categoria = null) => {
    if (categoria) {
      setNuevaCategoria({
        nombre: categoria.NOMBRE_CATEGORIA,
        descripcion: categoria.DESCRIPCION_CATEGORIA || ''
      });
      setEditandoId(categoria.ID_CATEGORIA);
    } else {
      setNuevaCategoria({ nombre: '', descripcion: '' });
      setEditandoId(null);
    }
    setErrores({});
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setNuevaCategoria({ nombre: '', descripcion: '' });
    setErrores({});
    setEditandoId(null);
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'descripcion' && value.length > 250) return;
    setNuevaCategoria(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardarCategoria = async () => {
    if (!nuevaCategoria.nombre.trim()) {
      alert('El nombre de la categoría es obligatorio.');
      return;
    }

    const categoria = {
      NOMBRE_CATEGORIA: nuevaCategoria.nombre.trim(),
      DESCRIPCION_CATEGORIA: nuevaCategoria.descripcion.trim(),
    };

    try {
      if (editandoId) {
        await actualizarCategoria(editandoId, categoria);
      } else {
        categoria.ID_CATEGORIA = Math.floor(Math.random() * 1000000);
        await crearCategoria(categoria);
      }
      await cargarCategorias();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      alert('No se pudo guardar la categoría.');
    }
  };

  const handleEliminarCategoria = async (id) => {
    const tieneProductos = await verificarProductosPorCategoria(id);
    if (tieneProductos) {
      setSnackbar({
        open: true,
        message: 'Esta categoría no puede eliminarse porque tiene productos asociados.',
        severity: 'error',
      });
      return;
    }

    try {
      await eliminarCategoria(id);
      await cargarCategorias();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      alert('No se pudo eliminar la categoría.');
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">Categorías</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
          Añadir Categoría
        </Button>
      </Box>

      <ValidatedInput
        label="Buscar categoría"
        name="busqueda"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        regexPermitido={regexNombre}
        placeholder="Buscar..."
        setError={setErrores}
        error={errores.busqueda}
      />

      <Grid container spacing={2}>
        {categoriasFiltradas.map((cat) => (
          <Grid item xs={12} sm={6} md={4} key={cat.ID_CATEGORIA}>
            <Card
              sx={{
                height: 220,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 2,
                boxShadow: 3,
                position: 'relative'
              }}
            >
              <CardHeader
                title={cat.NOMBRE_CATEGORIA}
                titleTypographyProps={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                action={
                  <>
                    <IconButton onClick={() => handleOpenModal(cat)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleEliminarCategoria(cat.ID_CATEGORIA)}><DeleteIcon /></IconButton>
                  </>
                }
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}
                >
                  {cat.DESCRIPCION_CATEGORIA || 'Sin descripción'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>{editandoId ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
        <DialogContent>
          <ValidatedInput
            label="Nombre"
            name="nombre"
            value={nuevaCategoria.nombre}
            onChange={handleInputChange}
            regexPermitido={regexNombre}
            placeholder="Nombre de la categoría"
            error={errores.nombre}
            setError={setErrores}
          />
          <ValidatedInput
            label="Descripción (máx. 250 caracteres)"
            name="descripcion"
            value={nuevaCategoria.descripcion}
            onChange={handleInputChange}
            regexPermitido={regexDescripcion}
            placeholder="Descripción"
            error={errores.descripcion}
            setError={setErrores}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleGuardarCategoria} variant="contained">
            {editandoId ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Categorias;
