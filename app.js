const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6498733a9e78158f9484dd02', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена.' });
});

mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.listen(3000);
