const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plant');
const { ensureAuth } = require('../middleware/auth');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get('/new', ensureAuth, plantController.newPlant);
router.post('/new', ensureAuth, plantController.createPlant);
router.get('/:id', ensureAuth, plantController.viewPlant);
router.delete('/:id', ensureAuth, plantController.deletePlant);
router.post('/:id', ensureAuth, upload.array("post_file"), plantController.updatePlant);

module.exports = router;