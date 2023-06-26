const Card = require('../models/card');
const error = require('../utils/errorStatusCodes');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(error.DEFAULT_ERROR).send({ message: 'Произошла ошибка.' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).json(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(error.INCORRECT_INPUT_ERROR).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(error.DEFAULT_ERROR).send({ message: 'Произошла ошибка.' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .orFail()
    .then((card) => res.status(200).json({ card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(error.INCORRECT_INPUT_ERROR).send({ message: 'Карточка с указанным _id не найдена.' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(error.NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(error.DEFAULT_ERROR).send({ message: 'Произошла ошибка.' });
      }
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((card) => res.json({ card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(error.INCORRECT_INPUT_ERROR).send({ message: 'Передан некорректный id для удаления карточки.' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(error.NOT_FOUND_ERROR).send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.status(error.DEFAULT_ERROR).send({ message: 'Произошла ошибка.' });
      }
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((card) => res.json({ card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(error.INCORRECT_INPUT_ERROR).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(error.NOT_FOUND_ERROR).send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.status(error.DEFAULT_ERROR).send({ message: 'Произошла ошибка.' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
