const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { jwtSecret, saltLength } = require('../config/authConfig');
const NotFoundError = require('../errors/NotFoundError');
const AlreadyExistsError = require('../errors/AlreadyExistsError');
const BadRequestError = require('../errors/BadRequestError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.json(users))
    .catch((err) => next(err));
};

const getUserMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Пользователь не найден.');
      } else if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      } else {
        next(err);
      }
    });
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан некорректный id при поиске профиля.');
      } else if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, saltLength || 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).json(user.toJSON()))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при регистрации.'));
      } else if (err.code === 11000) {
        next(new AlreadyExistsError('Пользователь с данным e-mail уже существует.'));
      } else {
        next(err);
      }
    });
};

const editProfile = (req, res, next) => {
  User.findByIdAndUpdate({
    userId: req.user._id,
    name: req.body.name,
    about: req.body.about,
  }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении профиля.');
      } else if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else {
        next(err);
      }
    });
};

const editAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении аватара.');
      } else if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '6h' });
      res.cookie('jwt', token, {
        maxAge: 60 * 60 * 1000 * 24 * 7,
        httpOnly: true,
      })
        .status(200)
        .send({ message: 'Успешная авторизация.' });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  editProfile,
  editAvatar,
  login,
  getUserMe,
};
