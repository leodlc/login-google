const httpError = (res, error) => {
  res.status(500).json({ error: error.message || 'Error interno del servidor' });
};

module.exports = { httpError };
