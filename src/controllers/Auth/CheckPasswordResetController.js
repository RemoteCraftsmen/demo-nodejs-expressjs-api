const { StatusCodes } = require('http-status-codes');

class CheckPasswordResetController {
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

module.exports = CheckPasswordResetController;
