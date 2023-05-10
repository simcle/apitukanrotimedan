const nodemailer = require('nodemailer');

const sendEmail = async (data) => {
    let transporter = nodemailer.createTransport({
        host: 'mail.tukangrotimedan.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'admin@tukangrotimedan.com', // generated ethereal user
          pass: 'tTXl?$p*z=FB', // generated ethereal password
        },
    });
    return await transporter.sendMail(data)
}

module.exports = sendEmail