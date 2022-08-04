const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const profileController = require('../controllers/profile');

router.get('/', ensureAuth, profileController.getProfile);
router.post('/', ensureAuth, profileController.postProfile);
router.get('/reset', ensureGuest, profileController.getReset);
router.post('/reset', ensureGuest, profileController.postReset);
router.get('/reset/:id', ensureGuest, profileController.getResetPwd);
router.post('/reset/:id', ensureGuest, profileController.postResetPwd);

module.exports = router;