module.exports = {
    services: {
        'controllers.auth.loginController': {
            class: '/controllers/Auth/LoginController',
            arguments: ['@repositories.user', '@services.auth']
        },
        'controllers.auth.resetPasswordController': {
            class: '/controllers/Auth/ResetPasswordController',
            arguments: ['@repositories.user']
        },
        'controllers.auth.changePasswordController': {
            class: '/controllers/Auth/ChangePasswordController',
            arguments: ['@repositories.user']
        }
    }
};
