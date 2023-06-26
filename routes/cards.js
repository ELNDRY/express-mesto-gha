const express = require('express');
const controller = require('../controllers/cards')
const router = express.Router();

router.get('/cards', controller.getCards);
router.post('/cards', controller.createCard);
router.delete('/cards/:cardId', controller.deleteCard);
router.put('/cards/:cardId/likes', controller.likeCard);
router.delete('/cards/:cardId/likes', controller.dislikeCard);

module.exports = router;
