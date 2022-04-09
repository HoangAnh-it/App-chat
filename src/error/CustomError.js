const { StatusCodes } = require('http-status-codes');

class CustomError extends Error {
    constructor(name, message) {
        super(message);
        this.name = name;
        this.status = StatusCodes.INTERNAL_SERVER_ERROR;
    }
}

module.exports = CustomError;
