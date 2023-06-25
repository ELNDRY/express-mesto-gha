const express = require('express');
const controller = require('../controllers/cards')
const router = express.Router();

router.get('/cards', controller.getCards);
router.post('/cards', controller.createCard);
router.delete('/cards/:cardId', controller.deleteCard);

module.exports = router;
