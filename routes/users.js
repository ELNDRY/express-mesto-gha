const express = require('express');
const controller = require('../controllers/users');

const router = express.Router();

router.get('/users', controller.getUsers);
router.get('/users/me', controller.getUserMe);
router.get('/users/:userId', controller.getUser);
router.patch('/users/me', controller.editProfile);
router.patch('/users/me/avatar', controller.editAvatar);

module.exports = router;
