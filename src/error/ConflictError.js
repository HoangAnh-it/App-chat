const CustomError = require('./CustomError');
const { StatusCodes } = require('http-status-codes');

class ConflictError extends CustomError {
    constructor(name, message) {
        super(name, message);
        this.status = StatusCodes.CONFLICT;
    }
}

module.exports = ConflictError;
