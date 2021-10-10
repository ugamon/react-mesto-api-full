const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { dataFormatter } = require('../utils/dataFormatter');
const AuthError = require('../errors/auth-err');
const NotFoundError = require('../errors/not-found-err');
const DuplicateError = require('../errors/duplicate-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User
    .findOne({ email }).select('+password')
    .then((userData) => {
      if (!userData) {
        // return Promise.reject(new Error('Неправильные почта или пароль'));
        throw new NotFoundError();
      }
      return bcrypt.compare(password, userData.password)
        .then((matched) => {
          if (!matched) {
            // return Promise.reject(new Error('Неправильные почта или пароль'));
            throw new AuthError();
          }
          const token = jwt.sign(
            { _id: userData._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
            { expiresIn: '7d' }, // токен будет просрочен через 7дней после создания
          );
          res.send({ token });
        });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      avatar: req.body.avatar,
      about: req.body.about,
    }))
    .then(({
      email, name, avatar, about,
    }) => dataFormatter(res, {
      email, name, avatar, about,
    }))
    .catch(() => {
      next(new DuplicateError());
    });
};

module.exports.currentUser = (req, res, next) => {
  User
    .find({ _id: req.user._id })
    .orFail(() => {
      // const error = new MangooseError('Lookup to id failed');
      // throw error;
      throw new NotFoundError();
    })
    .then((userData) => dataFormatter(res, userData))
    .catch(next);
};

module.exports.getAllUsers = (req, res, next) => {
  User
    .find()
    .then((userData) => dataFormatter(res, userData))
    .catch(next);
};

module.exports.findUser = (req, res, next) => {
  User
    .find({ _id: req.params.userId })
    .orFail(() => {
      // const error = new MangooseError('Lookup to id failed');
      // throw error;
      throw new NotFoundError();
    })
    .then((userData) => dataFormatter(res, userData))
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true, upsert: false },
    )
    .orFail(() => {
      // const error = new MangooseError('Lookup to id failed');
      // throw error;
      throw new NotFoundError();
    })
    .then((userData) => dataFormatter(res, userData))
    .catch(next);
};

module.exports.updateProfileAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true, upsert: false },
    )
    .orFail(() => {
      // const error = new MangooseError('Lookup to id failed');
      // throw error;
      throw new NotFoundError();
    })
    .then((userData) => dataFormatter(res, userData))
    .catch(next);
};
