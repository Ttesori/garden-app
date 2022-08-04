const express = require('express');
const router = express.Router();
const gardenController = require('../controllers/garden');
const plantController = require('../controllers/plant');
const { ensureAuth } = require('../middleware/auth');

router.get('/', ensureAuth, gardenController.getIndex);
router.get('/new', ensureAuth, gardenController.newGarden);
router.post('/new', ensureAuth, gardenController.postGarden);
router.get('/:id', ensureAuth, gardenController.singleGarden);
router.delete('/:id', ensureAuth, gardenController.deleteGarden);
router.post('/:id', ensureAuth, gardenController.updateGarden);
router.get('/plants/new', ensureAuth, plantController.newPlant);
router.post('/plants/new', ensureAuth, plantController.createPlant);
router.post('/:id/archive', ensureAuth, gardenController.archiveGarden);

module.exports = router;