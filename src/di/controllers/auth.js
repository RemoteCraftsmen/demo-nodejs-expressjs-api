module.exports = {
    services: {
        'controllers.auth.loginController': {
            class: '/controllers/Auth/LoginController',
            arguments: ['@repositories.user', '@services.auth']
        },
        'controllers.auth.requestPasswordResetController': {
            class: '/controllers/Auth/RequestPasswordResetController',
            arguments: [
                '@repositories.user',
                '@services.sendMailHandler',
                '@mails.passwordReset',
                '@services.passwordResetTokenGeneratorHandler'
            ]
        },
        'controllers.auth.checkPasswordResetController': {
            class: '/controllers/Auth/CheckPasswordResetController',
            arguments: ['@repositories.user']
        },
        'controllers.auth.registerController': {
            class: '/controllers/Auth/RegisterController',
            arguments: ['@repositories.user', '@services.auth']
        }
    }
};
