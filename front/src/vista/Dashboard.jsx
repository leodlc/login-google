import React, { useState } from 'react';
import {
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Divider,
  Avatar,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

import Productos from './Productos';
import Categorias from './Categorias';
import { logout } from '../controlador/AuthController';

const drawerWidth = 240;

function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('productos');
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const cerrarSesion = () => {
    logout();
    navigate('/');
  };

  const nombre = usuario?.NOMBRE_USUARIO || 'Usuario';
  const correo = usuario?.CORREO_USUARIO || '';
  const imagenUrl = usuario?.IMG_URL_USUARIO;

  const drawer = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Info del usuario */}
      <Box display="flex" flexDirection="column" alignItems="center" p={2}>
        <Avatar
          src={imagenUrl || ''}
          alt={nombre}
          sx={{ width: 80, height: 80, mb: 1 }}
        >
          {!imagenUrl && nombre.charAt(0)}
        </Avatar>
        <Typography variant="h6">{nombre}</Typography>
        <Typography variant="body2" color="textSecondary">{correo}</Typography>
      </Box>

      <Divider />

      {/* Navegación */}
      <List>
        <ListItem
          button
          selected={selectedSection === 'productos'}
          onClick={() => setSelectedSection('productos')}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#e3f2fd',
            },
            ...(selectedSection === 'productos' && {
              backgroundColor: '#bbdefb',
            }),
          }}
        >
          <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
          <ListItemText primary="Productos" />
        </ListItem>

        <ListItem
          button
          selected={selectedSection === 'categorias'}
          onClick={() => setSelectedSection('categorias')}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#e3f2fd',
            },
            ...(selectedSection === 'categorias' && {
              backgroundColor: '#bbdefb',
            }),
          }}
        >
          <ListItemIcon><CategoryIcon /></ListItemIcon>
          <ListItemText primary="Categorías" />
        </ListItem>
      </List>


      {/* Espaciador */}
      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      {/* Cerrar sesión */}
      <List>
        <ListItem
          button
          onClick={cerrarSesion}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#ffebee',
              color: '#d32f2f',
              '& .MuiListItemIcon-root': {
                color: '#d32f2f',
              },
            },
          }}
        >
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Cerrar sesión" />
        </ListItem>
      </List>

    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Responsive Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Drawer fijo en desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Contenido principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {selectedSection === 'productos' && <Productos />}
        {selectedSection === 'categorias' && <Categorias />}
      </Box>
    </Box>
  );
}

export default Dashboard;
