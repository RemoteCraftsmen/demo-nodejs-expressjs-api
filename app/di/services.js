module.exports = {
    services: {
        'services.auth': {
            class: 'services/AuthService'
        },
        'services.isUUIDValidHandler': {
            class: 'services/IsUUIDValidHandler'
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
