const usersRouter = require('express').Router({ strict: true });
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers, updateProfile, updateProfileAvatar, currentUser, findUser,
} = require('../controllers/users');
const { isUrl } = require('../utils/urlValidator');

usersRouter.get('/me', currentUser);

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(isUrl),
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
    userId: Joi.string().alphanum(),
  }),
}), findUser);

usersRouter.get('/', getAllUsers);

module.exports = usersRouter;
