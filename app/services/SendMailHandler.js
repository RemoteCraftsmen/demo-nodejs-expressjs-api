class SendMailHandler {
    constructor(mailer) {
        this.mailer = mailer;
    }

    handle(data) {
        return this.mailer.sendMail(data);
    }
}

module.exports = SendMailHandler;
