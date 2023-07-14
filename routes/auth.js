const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const BadRequestError = require('../errors/BadRequestError');

const router = express.Router();

const controller = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().required().custom((link) => {
      if (!validator.isURL(link, { require_protocol: true })) {
        throw new BadRequestError('Некорректная ссылка');
      }
      return link;
    }),
    email: Joi.string().required.email(),
    password: Joi.string().required(),
  }),
}), controller.createUser);

router.post('/signin', controller.login);

module.exports = router;
