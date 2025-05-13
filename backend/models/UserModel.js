const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username is required']
    },
    email: {
        type: String,
        required: [true, 'emailId is required'],
        unique: [true, 'emailId should be unique']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    verificationCode: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: Date,
    updatedAt: Date
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

module.exports = mongoose.model('User', UserSchema);