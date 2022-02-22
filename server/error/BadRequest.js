const CustomApiError = require('./CustomApiError');
const {StatusCodes} = require('http-status-codes');

class BadRequest extends CustomApiError {
    constructor(message) {
        super(message, StatusCodes.BAD_REQUEST);
    }
}

module.exports = BadRequest;
