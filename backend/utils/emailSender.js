const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function sendEmail(to, sub, msg) {
    transporter.sendMail({
        to: to,
        subject: sub,
        html: msg
    });
};

module.exports = {
    sendEmail
};