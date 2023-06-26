const express = require('express');
const controller = require('../controllers/users');

const router = express.Router();

router.get('/users/:userId', controller.getUser);
router.get('/users', controller.getUsers);
router.post('/users', controller.createUser);
router.patch('/users/me', controller.editProfile);
router.patch('/users/me/avatar', controller.editAvatar);

module.exports = router;
