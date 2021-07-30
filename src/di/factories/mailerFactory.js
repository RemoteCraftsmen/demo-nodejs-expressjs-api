const config = require('../../../config');

module.exports = {
    parameters: {
        config
    },

    services: {
        nodemailer: {
            arguments: ['%config%', '%nodemailer'],
            factory: {
                class: 'factories/MailerFactory',
                method: 'create'
            }
        }
    }
};
