const { StatusCodes } = require('http-status-codes');
const dayjs = require('dayjs');

class RequestPasswordResetController {
    constructor(
        userRepository,
        sendMailHandler,
        resetPasswordMail,
        passwordResetTokenGeneratorHandler
    ) {
        this.userRepository = userRepository;
        this.sendMailHandler = sendMailHandler;
        this.resetPasswordMail = resetPasswordMail;
        this.passwordResetTokenGeneratorHandler =
            passwordResetTokenGeneratorHandler;
    }

    async invoke(request, response) {
        const { email } = request.body;

        const user = await this.userRepository.getByEmail(email);

        if (!user) {
            return response.sendStatus(StatusCodes.NO_CONTENT);
        }

        const passwordResetToken =
            await this.passwordResetTokenGeneratorHandler.handle();

        const passwordResetTokenExpiresAt = dayjs().add(1, 'day');

        await user.update({ passwordResetToken, passwordResetTokenExpiresAt });

        const mailContent = this.resetPasswordMail.generateMessage({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            token: passwordResetToken,
            frontendUrl: request.get('origin')
        });

        await this.sendMailHandler.handle(mailContent);

        return response.sendStatus(StatusCodes.NO_CONTENT);
    }
}

module.exports = RequestPasswordResetController;
