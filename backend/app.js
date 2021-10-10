const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { celebrate, Joi, isCelebrateError } = require('celebrate');
const { linkRegex, emailRegex } = require('./utils/regexDict');
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {});
app.use(express.json());
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2),
    avatar: Joi.string().pattern(linkRegex),
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardRouter);
app.use(() => {
  throw new NotFoundError();
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const { message } = err;
  if (isCelebrateError(err)) {
    res.status(400).send({ message: 'Неправильные данные в запросе' });
  } else {
    res.status(status).send({ message: message || 'Произошла ошибка на сервере' });
  }
  next();
});

app.listen(3000);
