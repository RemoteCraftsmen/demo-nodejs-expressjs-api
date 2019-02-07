const mailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const config = require('../../config');

class Mail {
    constructor() {
        const transport = Mail.getTransport();
        this.service = mailer.createTransport(transport);
    }

    static getTransport() {
        if (config.mail.sendgridApiKey && config.mail.sendgridApiKey !== '') {
            const options = {
                apiKey: config.mail.sendgridApiKey
            };

            return nodemailerSendgrid(options);
        }

        return {
            host: config.mail.host || '127.0.0.1',
            port: config.mail.port || 1025,
            secure: config.mail.secure || false,
            auth: config.mail.auth || {
                user: 'username',
                pass: 'password'
            }
        };
    }

    async send(data) {
        return await this.service.sendMail(data);
    }
}

module.exports = Mail;
