const express = require('express');

const router = express.Router();

const controller = require('../controllers/users');

router.post('/signup', controller.createUser);
router.post('/signin', controller.login);

module.exports = router;
