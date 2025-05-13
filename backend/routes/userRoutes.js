const express = require('express');
const userRoutes = express.Router();
const {
    loginUser,
    signupUser,
    verifyUser,
    resetPassword,
    resetPasswordConfirmation
} = require('../controllers/userControllers');
const { authenticate } = require('../middlewares/authMiddleware');

userRoutes.post('/signup', signupUser);
userRoutes.post('/login', loginUser);
userRoutes.post('/verify', authenticate, verifyUser);
userRoutes.post('/reset', resetPassword);
userRoutes.post('/reset-password-confirmation', authenticate, resetPasswordConfirmation);

module.exports = userRoutes;