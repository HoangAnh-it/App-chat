const CustomApiError = require('./CustomApiError');
const {StatusCodes} = require('http-status-codes');

class NotFound extends CustomApiError {
    constructor(message) {
        super(message, StatusCodes.NOT_FOUND);
    }
}

module.exports = NotFound;
