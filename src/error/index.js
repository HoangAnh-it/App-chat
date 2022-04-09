const CustomError = require('./CustomError');
const NotFoundError = require('./NotFound');
const BadRequestError = require('./BadRequest');
const UnauthenticatedError = require('./Unauthenticated');
const ConflictError = require('./ConflictError');

module.exports = {
    CustomError,
    NotFoundError,
    BadRequestError,
    UnauthenticatedError,
    ConflictError,
}
