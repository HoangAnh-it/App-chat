const nodemailer = require('nodemailer');
const { CustomError } = require('../error');

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

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                throw new CustomError('Error', 'Cannot send email!');
            } 
        });
    return true;
}

module.exports = sendEmail;
