const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.json(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан некорректный id при поиске профиля.' });
      } if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(500).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(500).send({ message: err.message });
    });
};

const editProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true, upsert: true })
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      if (err === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(500).send({ message: err.message });
    });
};

const editAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true, upsert: true })
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      if (err === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else if (err === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  editProfile,
  editAvatar,
};
