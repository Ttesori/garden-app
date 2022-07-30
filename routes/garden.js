const express = require('express');
const router = express.Router();
const gardenController = require('../controllers/garden');

router.get('/', gardenController.getIndex);

module.exports = router;