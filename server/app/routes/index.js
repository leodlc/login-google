const express = require('express');
const router = express.Router();
const fs = require('fs');
const pathRouter = `${__dirname}`;
const removeExtension = (fileName) => fileName.split('.').shift();

fs.readdirSync(pathRouter).filter((file) => {
  const fileWithoutExt = removeExtension(file);
  if (fileWithoutExt === 'index') return;

  console.log(`Intentando cargar ruta: ${fileWithoutExt}`);
  const routeModule = require(`./${fileWithoutExt}`);
  console.log(`Tipo exportado por ${fileWithoutExt}:`, typeof routeModule);

  if (!routeModule || typeof routeModule !== 'function' && typeof routeModule.use !== 'function') {
    console.error(`ERROR: El archivo ${fileWithoutExt}.js no exporta un router válido de Express.`);
    process.exit(1);  // Finalizar para evitar confusión
  }

  router.use(`/${fileWithoutExt}`, routeModule);
  console.log(`Carga exitosa de ruta: ${fileWithoutExt}`);
});

router.get('*', (req, res) => {
  res.status(404).send({ error: 'No se ha encontrado la ruta' });
});

module.exports = router;
