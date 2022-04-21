const nodemailer = require('nodemailer');
const { CustomError, NotFoundError } = require('../error');

const sendEmail = (userEmail, password, recipients, subject, message, service) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        service: service,
        auth: {
            user: userEmail,
            pass: password,
            // clientId: process.env.GOOGLE_CLIENT_ID,
            // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }
    });

    const mailOptions = {
        from: userEmail,
        to: recipients,
        subject: subject,
        text: message,
    };
    
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                reject('error');
            } else if (!info) {
                reject('Cannot find user');
            } else {
                resolve(info);
            }
        });
    })
}

module.exports = sendEmail;
