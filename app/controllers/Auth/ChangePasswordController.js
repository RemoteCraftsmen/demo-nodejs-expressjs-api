const { StatusCodes } = require('http-status-codes');

class ChangePasswordController {
    /**
     *  @api {post} /reset-password/:token Reset password
     *  @apiName PostPasswordResetchangePassword
     *  @apiGroup ResetPassword
     *  @apiVersion 1.0.0
     *  @apiDescription If user already has recived email with token, he can send new password which will be hashed and stored in db
     *
     *  @apiParam {String} token Token which was send to users email, when asking for password reset
     *
     *  @apiParamExample {json} Request-Example:
     *    {
     *    	"password": "1",
     *    	"password_confirmation": "1"
     *    }
     *
     *   @apiError (400) BadRequest              Reset password token was not found </br>
     *                                           Password reset token expired
     *
     *   @apiError (500) InternalServerError     Errors in configuration
     */
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async invoke(request, response) {
        const {
            params: { passwordResetToken },
            body: { password }
        } = request;

        const user = await this.userRepository.findOne({
            where: { passwordResetToken }
        });

        if (!user) {
            return response.sendStatus(StatusCodes.NOT_FOUND);
        }

        const isTokenExpired = await user.isPasswordResetTokenExpired();

        if (isTokenExpired) {
            await user.update({
                passwordResetToken: null,
                passwordResetTokenExpiresAt: null
            });

            return response.sendStatus(StatusCodes.NOT_FOUND);
        }

        await user.update({
            password,
            passwordResetToken: null,
            passwordResetTokenExpiresAt: null
        });

        return response.sendStatus(StatusCodes.NO_CONTENT);
    }
}

module.exports = ChangePasswordController;
