const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers, findUser, updateProfile, updateProfileAvatar, currentUser,
} = require('../controllers/users');
const { isUrl } = require('../utils/urlValidator');

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

usersRouter.get('/me', currentUser);
usersRouter.get('/', getAllUsers);

usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum(),
  }),
}), findUser);

module.exports = usersRouter;
