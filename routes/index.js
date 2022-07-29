const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');

router.get('/', indexController.getIndex);
router.get('/register', indexController.getRegister);
router.get('/logout', indexController.getLogout);
router.post('/login', indexController.postUser);
router.post('/register', indexController.postRegister);

module.exports = router;