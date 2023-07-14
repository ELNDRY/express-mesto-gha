require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const authRouter = require('./routes/auth');
const authVerifier = require('./middlewares/auth');

const PORT = process.env.PORT || 3000;

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // limit each IP to 100 requests per 'window' - per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6498733a9e78158f9484dd02', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(limiter);

app.use('/', authRouter);
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена.' });
});

mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.listen(PORT);
