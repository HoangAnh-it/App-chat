const CustomError = require('./CustomError');
const { StatusCodes } = require('http-status-codes');

class UnauthenticatedError extends CustomError {
    constructor(name, message) {
        super(name, message);
        this.status = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = UnauthenticatedError;
