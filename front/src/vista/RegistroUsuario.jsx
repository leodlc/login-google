import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import { registrarUsuario, obtenerUsuarios } from '../controlador/RegistroUsuarioController';
import { useNavigate } from 'react-router-dom';

const RegistroUsuario = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    NOMBRE_USUARIO: '',
    USERNAME_USUARIO: '',
    CORREO: '',
    CONTRASENA: '',
    IMAGEN_URL: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false); // ⬅️ nuevo estado

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setCargando(true); // ⬅️ empieza la carga

    try {
      const usuarios = await obtenerUsuarios();
      const usernameExiste = usuarios.some(
        u => u.USERNAME_USUARIO.toLowerCase() === formData.USERNAME_USUARIO.toLowerCase()
      );

      if (usernameExiste) {
        setError('El nombre de usuario ya existe, elige otro.');
        setCargando(false); // ⬅️ termina la carga en error
        return;
      }

      const usuarioParaEnviar = {
        NOMBRE_USUARIO: formData.NOMBRE_USUARIO,
        USERNAME_USUARIO: formData.USERNAME_USUARIO,
        CORREO_USUARIO: formData.CORREO,
        CONTRASENIA_USUARIO: formData.CONTRASENA,
        IMG_URL_USUARIO: formData.IMAGEN_URL || null,
      };

      const response = await registrarUsuario(usuarioParaEnviar);
      setMensaje(response.message || 'Usuario registrado exitosamente');
      setFormData({
        NOMBRE_USUARIO: '',
        USERNAME_USUARIO: '',
        CORREO: '',
        CONTRASENA: '',
        IMAGEN_URL: '',
      });

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.error || 'Error al registrar el usuario');
    } finally {
      setCargando(false); // ⬅️ termina la carga al final
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={4} sx={{ padding: 4, width: 400 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Registro de Usuario
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre completo"
            name="NOMBRE_USUARIO"
            value={formData.NOMBRE_USUARIO}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Nombre de usuario"
            name="USERNAME_USUARIO"
            value={formData.USERNAME_USUARIO}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Correo electrónico"
            name="CORREO"
            type="email"
            value={formData.CORREO}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Contraseña"
            name="CONTRASENA"
            type="password"
            value={formData.CONTRASENA}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="URL de Imagen (opcional)"
            name="IMAGEN_URL"
            value={formData.IMAGEN_URL}
            onChange={handleChange}
            margin="normal"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={cargando} // ⬅️ deshabilitar mientras se carga
            endIcon={cargando && <CircularProgress size={20} />} // ⬅️ spinner opcional
          >
            {cargando ? 'Registrando...' : 'Registrarse'}
          </Button>
        </form>

        {mensaje && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {mensaje}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default RegistroUsuario;
