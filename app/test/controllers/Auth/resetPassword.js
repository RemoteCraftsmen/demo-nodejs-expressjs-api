const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const truncateDatabase = require('../../helpers/truncate');
const Register = require('../../helpers/register');

const app = require('../../../index');
const request = require('supertest')(app);

let loggedUserId;
let loggedUserToken;
let userData;

const di = app.get('di');
const userRepository = di.get('repositories.user');

describe('Reset-password', () => {
    before(async () => {
        await truncateDatabase();

        const { user, token } = await Register(request);
        loggedUserToken = token;
        loggedUserId = user.id;
        userData = user;
    });

    it('returns OK sending valid data as NOT LOGGED', async () => {
        const { email } = userData;
        const { status } = await request
            .post('/reset-password/')
            .send({ email });

        const updatedUser = await userRepository.getByEmail(email);

        expect(updatedUser).to.have.property('passwordResetToken');

        expect(status).to.equal(StatusCodes.NO_CONTENT);
    });

    it('returns OK sending invalid data as NOT LOGGED ', async () => {
        const email = 'fakemail@example.com';

        const { status } = await request
            .post('/reset-password/')
            .send({ email });

        expect(status).to.equal(StatusCodes.NO_CONTENT);
    });

    describe('POST /reset-password', () => {
        it('returns BAD REQUEST when body section is empty as NOT LOGGED', async () => {
            const { body, status } = await request.post(`/reset-password/`);

            expect(body).to.have.property('errors');
            expect(body.errors).to.deep.include({
                message: 'is required',
                param: 'email'
            });

            expect(status).to.equal(StatusCodes.BAD_REQUEST);
        });
    });
});
