const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const BadRequestError = require('../errors/BadRequestError');
const controller = require('../controllers/cards');

const router = express.Router();

router.get('/cards', controller.getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required.custom((link) => {
      if (!validator.isURL(link, { require_protocol: true })) {
        throw new BadRequestError('Некорректная ссылка');
      }
      return link;
    }),
  }),
}), controller.createCard);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), controller.deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), controller.likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), controller.dislikeCard);

module.exports = router;
