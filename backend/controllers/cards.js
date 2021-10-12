const Card = require('../models/card');
const { dataFormatter } = require('../utils/dataFormatter');
const PermissionDeniedError = require('../errors/permission-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((user) => dataFormatter(res, user))
    .catch(next);
};

module.exports.getAllCards = (req, res, next) => {
  Card
    .find()
    .then((cardList) => dataFormatter(res, cardList))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  //  todo: in the next sprint need to check the owner id
  Card
    .findOne({ _id: req.params.cardId })
    .orFail(() => {
      // const error = new MangooseError('Lookup to id failed');
      // throw error;
      throw new NotFoundError();
    })
    .then(({ owner }) => {
      if (owner.toHexString() !== req.user._id) {
        // throw new Error('Permission denied');
        throw new PermissionDeniedError();
      }
      Card
        .findByIdAndRemove({ _id: req.params.cardId })
        .then((cardData) => dataFormatter(res, cardData));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .orFail(() => {
      // const error = new MangooseError('Lookup to id failed');
      // throw error;
      throw new NotFoundError();
    })
    .then((cardData) => dataFormatter(res, cardData))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .orFail(() => {
      // const error = new MangooseError('Lookup to id failed');
      // throw error;
      throw new NotFoundError();
    })
    .then((cardData) => dataFormatter(res, cardData))
    .catch(next);
};
