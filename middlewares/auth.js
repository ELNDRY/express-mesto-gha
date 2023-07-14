const jwt = require('jsonwebtoken');
const error = require('../utils/errorStatusCodes');
const { jwtSecret } = require('../config/authConfig');

// eslint-disable-next-line consistent-return
const authVerifier = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(error.UNAUTHORIZED_ERROR)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (err) {
    return res
      .status(error.UNAUTHORIZED_ERROR)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};

module.exports = authVerifier;
