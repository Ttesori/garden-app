const express = require('express');
const router = express.Router();
const gardenController = require('../controllers/garden');
const { ensureAuth } = require('../middleware/auth');

router.get('/', ensureAuth, gardenController.getIndex);

module.exports = router;