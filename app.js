const express = require('express');
const mongoose = require('mongoose')

const app = express();
app.get('/', (request, response, next) => {
  response.send('<h2>Привет Express!</h2>');

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb')
app.listen(3000);
