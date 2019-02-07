/** @param {{frontendUrls:string, noReplyAddress:string}} config */
const config = require('../../config');

module.exports = (data) => {
    const {
        email = 'catch@remotecraftsmen.com',
        first_name = 'John',
        last_name = 'Doe',
        token = 'nope',
        frontendUrl = config.frontendUrls[0]
    } = data;
    const FRONTEND_URL = frontendUrl;
    const NO_REPLY_ADDRESS = config.noReplyAddress;

    return {
        from: `"no-reply" <${NO_REPLY_ADDRESS}>`,
        to: email,
        subject: 'Password reset',
        text: `
            Change password request!

            Hi ${first_name} ${last_name}! Someone requested a password change for your account.

            If it was not you, please ignore this email.

            To change your password go to this url: ${FRONTEND_URL}/forgot-password/${token}

            Thanks!
        `,

        html: `
            <h3>Change password request!</h3>
            <p>
                Hi ${first_name} ${last_name}! Someone requested a password change for your account.
                <br /><br />
                <strong>If it was not you, please ignore this email.</strong>
            </p>
            <p>
                To change your password go to this url <a href="${FRONTEND_URL}/forgot-password/${token}">${FRONTEND_URL}/forgot-password/${token}</a>
            </p>
            <p>
                Thanks!
            </p>
        `
    };
};
