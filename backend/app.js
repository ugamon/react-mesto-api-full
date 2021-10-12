const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { celebrate, Joi, isCelebrateError } = require('celebrate');
const { emailRegex } = require('./utils/regexDict');
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {});
// cors middleware
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
  allowedHeaders: ['*'],
}));
// json body middleware
app.use(express.json());
// logger middleware
app.use(requestLogger);
// pm2 healthcheck
app.get('/api/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/api/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().required(),
  }),
}), login);

app.post('/api/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('/api/users', auth, usersRouter);
app.use('/api/cards', auth, cardRouter);
app.use((req, res, next) => {
  next(new NotFoundError());
});
// error logger middleware
app.use(errorLogger);
// general error middleware
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const { message } = err;
  if (isCelebrateError(err)) {
    res.status(400).send({ message: 'Celebrate error' });
  } else {
    res.status(status).send({ message: message || 'Произошла ошибка на сервере' });
  }
  next();
});

app.listen(3000);
