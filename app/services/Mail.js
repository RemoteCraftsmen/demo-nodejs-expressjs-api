import mailer from 'nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid';

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.json')[env];

export default class Mail {
    constructor() {
        const transport = this.getTransport();
        this.service = mailer.createTransport(transport);
    }

    getTransport() {
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
