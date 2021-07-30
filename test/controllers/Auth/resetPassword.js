const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const truncateDatabase = require('../../helpers/truncate');
const userFactory = require('../../factories/user');

const app = require('../../../src/index');
const request = require('supertest')(app);

let userData;

const di = app.get('di');
const userRepository = di.get('repositories.user');

describe('Reset-password', () => {
    before(async () => {
        await truncateDatabase();

        userData = userFactory.generate();
        user = await userFactory.create(userData);
    });

    it('returns NO_CONTENT sending valid data as NOT LOGGED', async () => {
        const { email } = userData;
        const { status } = await request
            .post('/reset-password/')
            .send({ email });

        const updatedUser = await userRepository.getByEmail(email);

        expect(updatedUser).to.have.property('passwordResetToken');

        expect(status).to.equal(StatusCodes.NO_CONTENT);
    });

    it('returns NO_CONTENT sending invalid data as NOT LOGGED ', async () => {
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
                message: 'Email is required.',
                param: 'email'
            });

            expect(status).to.equal(StatusCodes.BAD_REQUEST);
        });
    });
});
