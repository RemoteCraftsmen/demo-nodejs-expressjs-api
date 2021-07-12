const config = require('../../config');

module.exports = {
    parameters: {
        config
    },
    services: {
        'services.auth': {
            class: 'services/AuthService'
        },
        'services.isUUIDValidHandler': {
            class: 'services/IsUUIDValidHandler'
        },
        'services.sendMailHandler': {
            class: 'services/SendMailHandler',
            arguments: ['@nodemailer', '%config%']
        },
        'services.passwordResetTokenGeneratorHandler': {
            class: 'services/PasswordResetTokenGeneratorHandler'
        }
    }
};
