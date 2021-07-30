module.exports = {
    services: {
        'services.auth': {
            class: 'services/AuthService'
        },
        'services.sendMailHandler': {
            class: 'services/SendMailHandler',
            arguments: ['@nodemailer']
        },
        'services.passwordResetTokenGeneratorHandler': {
            class: 'services/PasswordResetTokenGeneratorHandler'
        }
    }
};
