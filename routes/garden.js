const express = require('express');
const { route } = require('.');
const router = express.Router();
const gardenController = require('../controllers/garden');
const { ensureAuth } = require('../middleware/auth');

router.get('/', ensureAuth, gardenController.getIndex);
router.get('/profile', ensureAuth, gardenController.getProfile);
router.post('/profile', ensureAuth, gardenController.postProfile);

module.exports = router;