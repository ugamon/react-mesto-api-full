const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
  allowedHeaders: ['*'],
}));
app.use(express.json());
app.use(requestLogger);

// const allowedCors = [
//   'http://ugamon.nomoredomains.club',
//   'https://ugamon.nomoredomains.club',
//   'http://localhost:3000',
//   'http://localhost:3001',
// ];

// app.use((req, res, next) => {
//   const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
//   const requestHeaders = req.headers['access-control-request-headers'];
//   const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

//   // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
//   const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

//   // Если это предварительный запрос, добавляем нужные заголовки
//   if (method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//   }

//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//     res.end();
//   }
//   next();
// });

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

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardRouter);
app.use((req, res, next) => {
  next(new NotFoundError());
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
