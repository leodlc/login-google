import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Link,
  Paper,
} from '@mui/material';
import { login } from '../controlador/AuthController';
import { validarLogin } from '../modelos/LoginModel';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formulario, setFormulario] = useState({ username: '', password: '' });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    const erroresVal = validarLogin(formulario);
    if (Object.keys(erroresVal).length > 0) {
      setErrores(erroresVal);
      return;
    }

    try {
      const data = await login(formulario.username, formulario.password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      setMensaje('Inicio de sesión exitoso');
      navigate('/dashboard');
    } catch (error) {
      const mensajeError =
        error.response?.data?.error || 'Error inesperado en el login';
      setMensaje(mensajeError);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={4} sx={{ padding: 4, width: 350 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Usuario o Correo"
            name="username"
            value={formulario.username}
            onChange={handleChange}
            margin="normal"
            error={!!errores.username}
            helperText={errores.username}
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            name="password"
            value={formulario.password}
            onChange={handleChange}
            margin="normal"
            error={!!errores.password}
            helperText={errores.password}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Iniciar Sesión
          </Button>
        </form>

        {mensaje && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {mensaje}
          </Alert>
        )}

        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
          ¿No tienes una cuenta?{' '}
          <Link component="button" variant="body2" onClick={() => navigate('/registro')}>
            Regístrate aquí
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
