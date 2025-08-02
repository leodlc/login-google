const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Obtener el nombre del archivo JSON desde la variable de entorno
const serviceAccountPath = path.resolve(__dirname, process.env.ARCHIVO_CUENTA_SERVICIO);

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { admin, db };
