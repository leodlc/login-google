// src/pages/Categorias.jsx
import React, { useEffect, useState } from 'react';
import { obtenerCategorias, crearCategoria } from '../controlador/CategoriaController';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: '', descripcion: '' });

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

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setNuevaCategoria({ nombre: '', descripcion: '' });
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({ ...prev, [name]: value }));
  };

  const handleCrearCategoria = async () => {
    if (!nuevaCategoria.nombre.trim()) return;

    const categoria = {
      ID_CATEGORIA: Math.floor(Math.random() * 1000000),
      NOMBRE_CATEGORIA: nuevaCategoria.nombre.trim(),
      DESCRIPCION_CATEGORIA: nuevaCategoria.descripcion.trim()
    };

    try {
      await crearCategoria(categoria);
      await cargarCategorias();
      handleCloseModal();
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      alert('No se pudo crear la categoría. Intenta nuevamente.');
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">Categorías</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
          Añadir Categoría
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Buscar categoría"
        variant="outlined"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        sx={{ mb: 3, maxWidth: 400 }}
      />

      <Grid container spacing={2}>
        {categoriasFiltradas.map((cat) => (
          <Grid item xs={12} sm={6} md={4} key={cat.ID_CATEGORIA}>
            <Card>
              <CardHeader title={cat.NOMBRE_CATEGORIA} />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {cat.DESCRIPCION_CATEGORIA}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Nueva Categoría</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            fullWidth
            name="nombre"
            value={nuevaCategoria.nombre}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            name="descripcion"
            value={nuevaCategoria.descripcion}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleCrearCategoria} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Categorias;
