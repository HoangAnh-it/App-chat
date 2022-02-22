const CustomApiError = require('./CustomApiError');
const { StatusCodes } = require('http-status-codes');

class Unauthorized extends CustomApiError {
    constructor(message) {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}

module.exports = Unauthorized;
