const bcrypt = require('bcryptjs');
const User = require('../models/user');
const error = require('../utils/errorStatusCodes');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.json(users))
    .catch(() => res.status(error.DEFAULT_ERROR).send({ message: 'Произошла ошибка.' }));
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(error.INCORRECT_INPUT_ERROR).send({ message: 'Передан некорректный id при поиске профиля.' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(error.NOT_FOUND_ERROR).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(error.DEFAULT_ERROR).send({ message: 'Произошла ошибка.' });
      }
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).json(user.toJSON()))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(error.INCORRECT_INPUT_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(error.DEFAULT_ERROR).send({ message: 'Произошла ошибка.' });
      }
    });
};

const editProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(error.INCORRECT_INPUT_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(error.NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.status(error.DEFAULT_ERROR).send({ message: 'Произошла ошибка.' });
      }
    });
};

const editAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(error.INCORRECT_INPUT_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(error.NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.status(error.DEFAULT_ERROR).send({ message: 'Произошла ошибка.' });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  editProfile,
  editAvatar,
};
