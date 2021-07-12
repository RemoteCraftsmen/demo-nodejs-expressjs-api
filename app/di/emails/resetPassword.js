const config = require('../../../config');
module.exports = {
    parameters: {
        config
    },

    services: {
        'mails.passwordReset': {
            class: '/emails/ResetPassword',
            arguments: ['%config%']
        }
    }
};
