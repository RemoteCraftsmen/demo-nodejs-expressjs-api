class SendMailHandler {
    constructor(mailer, config) {
        this.mailer = mailer;
        this.config = config;
    }

    handle(data) {
        return this.mailer.sendMail(data);
    }
}

module.exports = SendMailHandler;
