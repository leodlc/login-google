import React, { useState } from 'react';
import { auth, provider, signInWithPopup } from '../firebase';
import { loginConGoogle } from '../controlador/AuthController';
import GoogleIcon from '@mui/icons-material/Google';
import ValidatedInput from '../componentes/ValidatedInput';
import { Backdrop, CircularProgress } from '@mui/material';



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
  const regexUsername = /[a-zA-Z0-9@._-]/; // sin flags globales
  const regexPassword = /[\w@.-]/;         // sin flags globales
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setCargando(true);

    const erroresVal = validarLogin(formulario);
    if (Object.keys(erroresVal).length > 0) {
      setErrores(erroresVal);
      setCargando(false);
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
    } finally {
      setCargando(false);
    }
  };


  {cargando && (
    <Backdrop
      open={true}
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )}


  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={4} sx={{ padding: 4, width: 350 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleSubmit}>
          <ValidatedInput
            label="Usuario o Correo"
            name="username"
            value={formulario.username}
            onChange={handleChange}
            placeholder="Ingresa tu usuario o correo"
            regexPermitido={regexUsername}
            error={errores.username}
            setError={setErrores}
          />
            <ValidatedInput
              label="Contraseña"
              name="password"
              type="password"
              value={formulario.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              regexPermitido={regexPassword}
              error={errores.password}
              setError={setErrores}
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
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={async () => {
              setCargando(true);
              try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;

                const data = await loginConGoogle(user);
                localStorage.setItem('token', data.token);
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
                navigate('/dashboard');
              } catch (error) {
                console.error('Error con Google Login:', error);
                setMensaje('Fallo al iniciar sesión con Google');
              } finally {
                setCargando(false);
              }
            }}
            sx={{ mt: 2 }}
          >
            Iniciar con Google
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
