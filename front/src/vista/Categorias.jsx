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
  Typography,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ValidatedInput from '../componentes/ValidatedInput';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [errores, setErrores] = useState({});
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: '', descripcion: '' });

  // Regex
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

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setNuevaCategoria({ nombre: '', descripcion: '' });
    setErrores({});
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'descripcion' && value.length > 250) {
      return; // Bloquea escribir más de 250 caracteres
    }

    setNuevaCategoria((prev) => ({ ...prev, [name]: value }));
  };

  const handleCrearCategoria = async () => {
    if (!nuevaCategoria.nombre.trim()) {
      alert('El nombre de la categoría es obligatorio.');
      return;
    }

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

      <ValidatedInput
        label="Buscar categoría"
        name="busqueda"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        regexPermitido={/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/}
        placeholder="Buscar..."
        setError={setErrores}
        error={errores.busqueda}
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
          <Button onClick={handleCrearCategoria} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Categorias;
