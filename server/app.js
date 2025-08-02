require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8002;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());

// Cargar rutas
app.use('/api/rec', require('./app/routes'));

server.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Apagando el servidor...');
  server.close(() => {
    console.log('Servidor cerrado.');
    process.exit(0);
  });
});

