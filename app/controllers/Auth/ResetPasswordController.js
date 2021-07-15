const { StatusCodes } = require('http-status-codes');
const dayjs = require('dayjs');

class ResetPasswordController {
    //PasswordResetController.js
    /**
     *  @api {post} /reset-password Request for reset password
     *  @apiName PostPasswordResetPassword
     *  @apiGroup ResetPassword
     *  @apiVersion 1.0.0
     *
     *  @apiDescription User ask server to change his password, as respond he gets an email with token, which is giving access to this action
     *
     *  @apiParam {String} email Users email
     *
     *  @apiParamExample {json} Request-Example:
     *     {
     *       "email": "test@test.com"
     *     }
     *
     *   @apiError (404) NotFound                The User was not found
     *   @apiError (400) BadRequest              Email must be specified
     */
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

module.exports = ResetPasswordController;
