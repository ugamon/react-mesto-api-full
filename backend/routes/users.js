const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { linkRegex } = require('../utils/regexDict');
const {
  getAllUsers, findUser, updateProfile, updateProfileAvatar, currentUser,
} = require('../controllers/users');

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(linkRegex),
  }),
}), updateProfileAvatar);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2),
  }),
}), updateProfile);

usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), findUser);

usersRouter.get('/me', currentUser);
usersRouter.get('/', getAllUsers);

module.exports = usersRouter;
