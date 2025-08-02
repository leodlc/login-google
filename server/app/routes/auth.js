const express = require('express');
const router = express.Router();
const { login, loginConGoogle } = require('../controllers/auth');

router.post('/login', login);
router.post('/google-login', loginConGoogle);

module.exports = router;
