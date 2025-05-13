const otpGenerator = require('otp-generator');
const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AppMessages = require('../utils/appMessages');
const {
    STATUS_BAD_REQUEST,
    STATUS_OK,
    STATUS_INTERNAL_SERVER_ERROR,
    UNAUTHORIZED,
    EMAIL_SUB,
    RESET_PASSWORD_EMAIL_SUB
} = require('../utils/constants');

const {
    sendEmail
} = require('../utils/emailSender');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

const emailBody = (otp) => {
    return `<h3>Your OTP for verification is: ${otp}</h3>`;
}

const resetPasswordEmailBody = (otp) => {
    return `<h3>Your OTP for password reset is: ${otp}</h3>`;
}

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const signupUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if(!username || !email || !password) {
            return res.status(STATUS_BAD_REQUEST).json({ success: false, msg: 'Invalid Credentials', data: null });
        }
        const existingUser = await UserModel.findOne({ email });
        if(existingUser) {
            const isVerified = existingUser.isVerified;
            if (isVerified) {
                return res
                .status(STATUS_BAD_REQUEST)
                .json({ success: false, msg: AppMessages.EMAIL_REGISTERED_AND_VERIFIED, data: null });
            } else {
                const id = existingUser._id;
                await UserModel.findByIdAndDelete(id);
            }
        }
        const verificationCode = otpGenerator.generate(6, {
            specialChars: false
        });
        await sendEmail(email, EMAIL_SUB, emailBody(verificationCode));
        const user = await UserModel.create({ username, email, password, verificationCode });
        const token = createToken(user._id);
        res
        .status(STATUS_OK)
        .json({ success: true, msg: AppMessages.VERIFICATION_OTP_SENT, data: { email, username, token } });
    } catch (error) {
        res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .json({ success: false, msg: 'Some Error Occurred', data: null });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(STATUS_BAD_REQUEST).json({success: false, msg: 'Invalid credentials', data: null});
        }
        const user = await UserModel.findOne({ email });
        if(!user) {
            return res
            .status(UNAUTHORIZED)
            .json({success: false, msg: 'Invalid credentials', data: null});
        }
        if(!user.isVerified) {
            res
            .status(STATUS_BAD_REQUEST)
            .json({ success: false, msg: AppMessages.EMAIL_NOT_VERIFIED, data: null });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            return res
            .status(STATUS_BAD_REQUEST)
            .json({success: false, msg: 'Invalid credentials.', data: null});
        }
        const token = createToken(user._id);
        res
        .status(STATUS_OK)
        .json({ success: true, msg: 'Logged in successfully', data: { email, username: user.username, token } });
    } catch (error) {
        res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .json({ success: false, msg: 'Some Error Occurred', data: null });
    }
}

const verifyUser = async (req, res) => {
    try {
        const { otp } = req.body;
        if(otp !== req.user.verificationCode) {
            return res
            .status(STATUS_BAD_REQUEST)
            .json({
                success: false, msg: 'OTP is incorrect', data: null
            });
        }
        await UserModel.findByIdAndUpdate(req.user._id, { isVerified: true }, { new: true });
        const token = createToken(req.user._id);
        res
        .status(STATUS_OK)
        .json({ success: true, msg: AppMessages.VERIFIED_SUCCESSFULLY, data: { email: req.user.email, username: req.user.username, token } })
    } catch (error) {
        res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .json({ success: false, msg: 'Some error occurred', data: null });
    }
}

const resetPassword = async (req, res) => {
    try {
        let { email } = req.body;
        if(!email) {
            return res
            .status(STATUS_BAD_REQUEST)
            .json({ success: false, msg: 'Invalid credentials', data: null });
        }
        let user = await UserModel.findOne({ email });
        if(!user) {
            return res
            .status(STATUS_BAD_REQUEST)
            .json({ success: false, msg: 'Invalid credentials', data: null });
        }
        if(!user.isVerified) {
            return res
            .status(STATUS_BAD_REQUEST)
            .json({ success: false, msg: AppMessages.EMAIL_NOT_VERIFIED, data: null });
        }
        const token = createToken(user._id);
        const verificationCode = otpGenerator.generate(6, {
            specialChars: false
        });
        await UserModel.findOneAndUpdate({email}, { verificationCode });
        await sendEmail(email, RESET_PASSWORD_EMAIL_SUB, resetPasswordEmailBody(verificationCode));
        res.status(STATUS_OK).json({ success: true, msg: AppMessages.PASSWORD_RESET_OTP_SENT, data: {
            email, token
        } });
    } catch (error) {
        res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .json({ success: false, msg: 'Some error occurred', data: null });
    }
}

const resetPasswordConfirmation = async (req, res) => {
    try {
        const { otp, password } = req.body;
        let user = req.user;
        if(otp !== user.verificationCode) {
            return res.status(STATUS_BAD_REQUEST).json({
                success: false, msg: 'Invalid Credentials', data: null
            });
        }
        const hashedPassword = await hashPassword(password);
        user = await UserModel.findByIdAndUpdate(user._id, { password: hashedPassword }, { new: true });
        res
        .status(STATUS_OK)
        .json({success: true, msg: AppMessages.PASSWORD_RESET_SUCCESSFULL, data: {
            username: user.username, email: user.email
        }});
    } catch (error) {
        res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .json({ success: false, msg: 'Some error occurred', data: null });
    }
}

module.exports = {
    loginUser,
    signupUser,
    verifyUser,
    resetPassword,
    resetPasswordConfirmation
}