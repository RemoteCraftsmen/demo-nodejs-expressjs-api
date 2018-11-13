import { User, PasswordReset } from '../models';
import Mail from '../services/Mail';
import ResetPassword from '../emails/ResetPassword';

import { validationResult } from 'express-validator/check';

export default class PasswordResetController {
    async resetPassword(request, response, next) {
        const { email } = request.body;

        const user = await User.getByEmail(email);

        if (!user) {
            return response.sendStatus(404);
        }

        new Mail()
            .send(
                ResetPassword({
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    token: await PasswordReset.addToken(user)
                })
            )
            .then(() => {
                return response.sendStatus(200);
            })
            .catch(err => {
                console.warn(err);
                return response.sendStatus(500);
            });
    }

    changePassword(request, response, next) {
        const validationErrors = validationResult(request);

        if (!validationErrors.isEmpty()) {
            const errors = validationErrors.array().map(e => {
                return { message: e.msg, param: e.param };
            });

            return response.status(400).json({ errors });
        }

        const { password } = request.body;
        const token = request.params.token;

        PasswordReset.getByToken(token)
            .then(async passwordReset => {
                if (!passwordReset) {
                    return response.status(400).json({
                        status: 'error',
                        message: 'Password reset token not found'
                    });
                }

                if (passwordReset.hasExpired()) {
                    return response.status(400).json({
                        status: 'error',
                        message: 'Password reset token expired'
                    });
                }

                await passwordReset.user.update({ password });

                await passwordReset.destroy();

                return response.json({
                    status: 'success',
                    message: 'Password changed!'
                });
            })
            .catch(err => {
                console.error(err);
                return response.sendStatus(500);
            });
    }
}
