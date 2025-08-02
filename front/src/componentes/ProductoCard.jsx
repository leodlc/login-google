import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  IconButton,
  Stack,
  Avatar,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductoCard = ({ producto, onEditar, onEliminar }) => {
  const imagen = producto.IMG_URL_PRODUCTO || 'https://via.placeholder.com/300x200?text=Sin+Imagen';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 2,
        boxShadow: 3,
        p: 2,
      }}
    >
      <CardHeader
        avatar={<Avatar>{producto.NOMBRE_PRODUCTO.charAt(0)}</Avatar>}
        title={producto.NOMBRE_PRODUCTO}
        titleTypographyProps={{ fontSize: '1.1rem', fontWeight: 'bold' }}
        sx={{ pb: 0 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          component="img"
          src={imagen}
          alt={producto.NOMBRE_PRODUCTO}
          sx={{
            width: '100%',
            height: 200,
            objectFit: 'cover',
            borderRadius: 2,
            mb: 1,
          }}
        />
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {producto.DESCRIPCION_PRODUCTO || 'Sin descripción'}
        </Typography>
        <Typography variant="body1" fontWeight="bold" mb={0.5}>
          Precio: ${producto.PRECIO_PRODUCTO}
        </Typography>
        <Typography variant="body2">
          IVA: {producto.IVA_PRODUCTO ? 'Sí' : 'No'}
        </Typography>
      </CardContent>
      <Divider />
      <Box mt={1} display="flex" justifyContent="space-between">
        <IconButton color="primary" onClick={() => onEditar(producto)}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={() => onEliminar(producto.ID_PRODUCTO)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

export default ProductoCard;
