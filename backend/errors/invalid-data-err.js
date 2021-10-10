class InvalidDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.message = 'Переданы некорректные данные в метод создания карточки, пользователя, обновления аватара пользователя и профиля';
  }
}

module.exports = InvalidDataError;
