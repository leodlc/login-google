import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import ValidatedInput from '../componentes/ValidatedInput';
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

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Regex para validar caracteres por campo
  const regexNombre = /^[a-zA-Z\s]*$/;
  const regexUsername = /^[a-zA-Z0-9._-]*$/;
  const regexPassword = /^[a-zA-Z0-9@._-]*$/;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Validación del formato completo de email (más estricto)
  const validarEmail = (email) => {
    // Debe tener texto antes del @, solo un @, dominio y terminar en .com
    const emailRegex = /^[^\s@]+@[^\s@]+\.[cC][oO][mM]$/;
    // Esto permite solo un punto antes del ".com" y termina en .com
    // Puedes hacerlo más estricto según necesidades
    return emailRegex.test(email);
  };

  // Validación contraseña (por ejemplo mínimo 6 caracteres y solo caracteres permitidos)
  const validarContrasena = (contrasena) => {
    if (contrasena.length < 6) return false;
    // Ya filtramos caracteres no permitidos en el input, aquí solo verificar longitud
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setErrores({});
    setCargando(true);

    // Validar campos
    const nuevosErrores = {};

    if (!formData.NOMBRE_USUARIO.trim()) {
      nuevosErrores.NOMBRE_USUARIO = 'El nombre es obligatorio';
    } else if (!regexNombre.test(formData.NOMBRE_USUARIO)) {
      nuevosErrores.NOMBRE_USUARIO = 'Solo se permiten letras y espacios';
    }

    if (!formData.USERNAME_USUARIO.trim()) {
      nuevosErrores.USERNAME_USUARIO = 'El nombre de usuario es obligatorio';
    } else if (!regexUsername.test(formData.USERNAME_USUARIO)) {
      nuevosErrores.USERNAME_USUARIO = 'Caracteres inválidos en nombre de usuario';
    }

    if (!formData.CORREO.trim()) {
      nuevosErrores.CORREO = 'El correo es obligatorio';
    } else if (!validarEmail(formData.CORREO)) {
      nuevosErrores.CORREO = 'Correo no es válido o no termina en .com';
    }

    if (!formData.CONTRASENA) {
      nuevosErrores.CONTRASENA = 'La contraseña es obligatoria';
    } else if (!validarContrasena(formData.CONTRASENA)) {
      nuevosErrores.CONTRASENA = 'Contraseña inválida (mínimo 6 caracteres)';
    }

    // No validamos URL (puede estar vacío o cualquier cosa)

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      setCargando(false);
      return;
    }

    try {
      // Comprobar si username ya existe
      const usuarios = await obtenerUsuarios();
      const usernameExiste = usuarios.some(
        u => u.USERNAME_USUARIO.toLowerCase() === formData.USERNAME_USUARIO.toLowerCase()
      );

      if (usernameExiste) {
        setError('El nombre de usuario ya existe, elige otro.');
        setCargando(false);
        return;
      }

      // Preparar datos para enviar
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
      setCargando(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={4} sx={{ padding: 4, width: 400 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Registro de Usuario
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          <ValidatedInput
            label="Nombre completo"
            name="NOMBRE_USUARIO"
            value={formData.NOMBRE_USUARIO}
            onChange={handleChange}
            regexPermitido={regexNombre}
            error={errores.NOMBRE_USUARIO}
            setError={setErrores}
            placeholder="Solo letras y espacios"
            required
          />
          <ValidatedInput
            label="Nombre de usuario"
            name="USERNAME_USUARIO"
            value={formData.USERNAME_USUARIO}
            onChange={handleChange}
            regexPermitido={regexUsername}
            error={errores.USERNAME_USUARIO}
            setError={setErrores}
            placeholder="Letras, números, punto, guion bajo o medio"
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
            error={!!errores.CORREO}
            helperText={errores.CORREO}
            required
          />
          <ValidatedInput
            label="Contraseña"
            name="CONTRASENA"
            type="password"
            value={formData.CONTRASENA}
            onChange={handleChange}
            regexPermitido={regexPassword}
            error={errores.CONTRASENA}
            setError={setErrores}
            placeholder="Mínimo 6 caracteres"
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
            disabled={cargando}
            endIcon={cargando && <CircularProgress size={20} />}
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
