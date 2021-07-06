require('dotenv').config({
    path:
        process.env.NODE_ENV === 'test'
            ? '.env.test'
            : process.env.NODE_ENV === 'production'
            ? '.env.production'
            : '.env'
});

const env = (key, defaultValue = null) => process.env[key] || defaultValue;
const isEnabled = key => env(key) && env(key) === 'true';

module.exports = {
    enableDocs: isEnabled(env('ENABLEDOCS')),
    db: {
        url: `${env('DATABASE_DIALECT')}://${env('DATABASE_USERNAME')}:${env(
            'DATABASE_PASSWORD'
        )}@${env('DATABASE_HOST', 'localhost')}:${env('DATABASE_PORT')}/${env(
            'DATABASE_NAME'
        )}`,
        username: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
        database: env('DATABASE_NAME'),
        logging: isEnabled(env('DATABASE_LOGGING')),
        host: env('DATABASE_HOST'),
        port: env('DATABASE_PORT'),
        dialect: env('DATABASE_DIALECT')
    },
    mail: {
        sendgridApiKey: env('MAIL_SENDGRID_API_KEY'),
        host: env('MAIL_HOST'),
        port: env('MAIL_PORT'),
        secure: isEnabled(env('MAIL_SECURE')),
        auth: {
            user: env('MAIL_AUTH_USER'),
            pass: env('MAIL_AUTH_PASS')
        }
    },
    jwt: {
        secret: env('JWT_SECRET')
    },
    frontendUrls: env('FRONTEND_URLS').split(' '),
    noReplyAddress: env('NO_REPLY_ADDRESS')
};
