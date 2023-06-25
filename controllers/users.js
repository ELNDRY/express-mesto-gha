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

  User.create({ name, about, avatar })
    .then((user) => res.json(user))
    .catch((err) => res.status(500).send({ message: err.message }));
}

module.exports = {
  getUsers,
  getUser,
  createUser,
};
