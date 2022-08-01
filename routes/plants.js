const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plant');
const { ensureAuth } = require('../middleware/auth');

router.get('/new', ensureAuth, plantController.newPlant);
router.post('/new', ensureAuth, plantController.createPlant);
router.get('/:id', ensureAuth, plantController.viewPlant);
router.delete('/:id', ensureAuth, plantController.deletePlant);
router.post('/:id', ensureAuth, plantController.updatePlant);

module.exports = router;