const STATUS_OK = 200;
const STATUS_INTERNAL_SERVER_ERROR = 500;
const STATUS_BAD_REQUEST = 400;
const STATUS_BAD_REQUEST_MSG = 'Bad Request';
const UNAUTHORIZED = 401;
const UNAUTHORIZED_MSG = 'Unauthorized';
const STATUS_NOT_FOUND = 404;
const STATUS_NOT_FOUND_MESSAGE = 'Not Found';
const STATUS_OK_MSG = 'OK';
const USER_BASE_PATH = '/api/users';
const EXPENSE_BASE_PATH = '/api/expenses';
const EMAIL_SUB='Expense Tracker Verification';
const RESET_PASSWORD_EMAIL_SUB='Reset Password. Expense Tracker'

module.exports = {
    STATUS_OK,
    STATUS_INTERNAL_SERVER_ERROR,
    STATUS_BAD_REQUEST,
    STATUS_BAD_REQUEST_MSG,
    UNAUTHORIZED,
    UNAUTHORIZED_MSG,
    STATUS_NOT_FOUND,
    STATUS_NOT_FOUND_MESSAGE,
    STATUS_OK_MSG,
    USER_BASE_PATH,
    EXPENSE_BASE_PATH,
    EMAIL_SUB,
    RESET_PASSWORD_EMAIL_SUB
}