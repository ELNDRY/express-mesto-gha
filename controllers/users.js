const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.json(users))
    .catch((err) => res.status(500).send({ message: err.message }));
}

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => res.status(500).send({ message: err.message }));
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  const { userId } = req.params;

  User.create({ name, about, avatar })
    .then((user) => res.json(user))
    .catch((err) => res.status(500).send({ message: err.message }));
}

const editProfile = (req, res) => {
  const {name, about} = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, {name, about}, {new: true, runValidators: true, upsert: true})
  .orFail()
  .then((user) => res.json(user))
  .catch((err) => res.status(500).send({ message: err.message }));
}

const editAvatar = (req, res) => {
  const {avatar} = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, {avatar}, {new: true, runValidators: true, upsert: true})
  .orFail()
  .then((user) => res.json(user))
  .catch((err) => res.status(500).send({ message: err.message }));
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  editProfile,
  editAvatar
};
