const express = require('express');
const controller = require('../controllers/users')
const router = express.Router();

router.get('/users/:userId', controller.getUser);
router.get('/users', controller.getUsers);
router.post('/users', controller.createUser);

module.exports = router;
