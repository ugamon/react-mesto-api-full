class NotFoundError extends Error {
  constructor() {
    super();
    this.statusCode = 404;
    this.message = 'Карточка или пользователь не найден, или был запрошен несуществующий роут';
  }
}

module.exports = NotFoundError;
