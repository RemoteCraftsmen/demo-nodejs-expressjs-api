class MailerFactory {
    static create(config, nodemailer) {
        return nodemailer.createTransport({
            host: config.mail.host || '127.0.0.1',
            port: config.mail.port || 1025,
            auth: config.mail.auth || {
                user: 'username',
                pass: 'password'
            }
        });
    }
}

module.exports = MailerFactory;
