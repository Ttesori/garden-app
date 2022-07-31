const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');
const { ensureGuest } = require('../middleware/auth');

router.get('/', ensureGuest, indexController.getIndex);
router.get('/register', ensureGuest, indexController.getRegister);
router.get('/logout', indexController.getLogout);
router.post('/login', indexController.postUser);
router.post('/register', indexController.postRegister);

module.exports = router;