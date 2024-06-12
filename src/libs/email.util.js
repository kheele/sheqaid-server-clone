
const nodemailer = require('nodemailer');

const smtpConfig = {
//    host: 'togepi.aserv.co.za', //komparevs.com',
//     host: "smtp-mail.outlook.com", //komparevs.com',
    host: "smtp.office365.com", //komparevs.com',
    port: 587, //465,
    secureConnection: false,
//        secure: true, // use SSL 
    auth: {
        user: 'no-reply@sheqsolve.com',
        pass: 'Gac03614'
    },
    tls: {
        ciphers: 'SSLv3'
    }
};

const transporter = nodemailer.createTransport(smtpConfig);

class EmailUtils {

    constructor() {
    }

    static async send(mailOptions) {
        // send mail with defined transport object
        console.log('EmailUtils.send', mailOptions);
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    console.log('EmailUtils.send res', info.response);
                    resolve(info.response);
                }
            });
        });
    }
}

module.exports = EmailUtils;
