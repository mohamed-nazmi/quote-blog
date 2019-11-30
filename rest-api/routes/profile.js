const express = require('express');

const profileController = require('../controllers/profile');

const router = express.Router();

router.get('/profile/:username', profileController.getProfileInfoByUsername);

module.exports = router;