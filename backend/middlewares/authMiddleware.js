const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');

const {
    STATUS_BAD_REQUEST,
    STATUS_INTERNAL_SERVER_ERROR
} = require('../utils/constants');

const authenticate = async (req, res, next) => {
    try {
        let token = null;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token) {
            return res
            .status(STATUS_BAD_REQUEST)
            .json({ success: false, msg: 'Auth token is missing or is invalid' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await UserModel.findById(decoded._id);
        next();
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ success: false, msg: 'Some error occurred', data: null });
    }
}

module.exports = {
    authenticate
}