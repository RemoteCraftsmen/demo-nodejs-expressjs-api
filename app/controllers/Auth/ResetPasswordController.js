const Mail = require('../../services/Mail');
const ResetPassword = require('../../emails/ResetPassword');
const { StatusCodes } = require('http-status-codes');
const { PasswordReset } = require('../../models');

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
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async invoke(request, response, next) {
        const { email } = request.body;

        const user = await this.userRepository.getByEmail(email);

        if (!user) {
            return response.sendStatus(StatusCodes.NO_CONTENT);
        }

        const mail = new Mail();

        const mailContent = ResetPassword({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            token: await PasswordReset.addToken(user),
            frontendUrl: request.get('origin')
        });

        await mail.send(mailContent);

        return response.sendStatus(StatusCodes.NO_CONTENT);
    }
}

module.exports = ResetPasswordController;
