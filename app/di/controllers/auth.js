module.exports = {
    services: {
        'controllers.auth.loginController': {
            class: '/controllers/Auth/LoginController',
            arguments: ['@repositories.user', '@services.auth']
        },
        'controllers.auth.resetPasswordController': {
            class: '/controllers/Auth/ResetPasswordController',
            arguments: [
                '@repositories.user',
                '@services.sendMailHandler',
                '@mails.passwordReset',
                '@services.passwordResetTokenGeneratorHandler'
            ]
        },
        'controllers.auth.changePasswordController': {
            class: '/controllers/Auth/ChangePasswordController',
            arguments: ['@repositories.user']
        }
    }
};
