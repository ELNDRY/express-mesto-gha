const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const controller = require('../controllers/users');

const URLregEx = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/;

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().required().regex(URLregEx),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), controller.createUser);

router.post('/signin', controller.login);

module.exports = router;
