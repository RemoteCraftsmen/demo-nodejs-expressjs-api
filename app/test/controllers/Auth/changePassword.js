const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const truncateDatabase = require('../../helpers/truncate');
const userFactory = require('../../factories/user');
const app = require('../../../index');
const request = require('supertest')(app);
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

let userData;
let user;

const di = app.get('di');
const userRepository = di.get('repositories.user');
const passwordResetTokenGeneratorHandler = di.get(
    'services.passwordResetTokenGeneratorHandler'
);

describe('Reset-password', () => {
    before(async () => {
        await truncateDatabase();
        userData = userFactory.generate();
        userData.passwordResetToken =
            await passwordResetTokenGeneratorHandler.handle();

        userData.passwordResetTokenExpiresAt = dayjs().add(2, 'hour');
        user = await userFactory.create(userData);
    });

    it('returns NO_CONTENT sending valid data as NOT LOGGED', async () => {
        const password = 'password123';
        const passwordConfirmation = password;
        const { email } = user;

        const response = await request
            .post(`/reset-password/${user.passwordResetToken}`)
            .send({
                password,
                passwordConfirmation
            });

        const updatedUser = await userRepository.getByEmail(email);
        expect(updatedUser.passwordResetToken).to.equal(undefined);

        expect(response.status).to.equal(StatusCodes.NO_CONTENT);

        const loginResponse = await request
            .post('/auth/login')
            .send({ email, password });

        expect(loginResponse.status).to.equal(StatusCodes.OK);
    });

    it('returns BAD REQUEST when password and password repeat are not equal as NOT LOGGED', async () => {
        const { body, status } = await request
            .post(`/reset-password/${user.passwordResetToken}`)
            .send({
                password: 'password123',
                passwordConfirmation: '456password'
            });

        console.log(body.errors);

        expect(body.errors).to.deep.include({
            message: 'must match password',
            param: 'passwordConfirmation'
        });

        expect(status).to.equal(StatusCodes.BAD_REQUEST);
    });

    it('returns BAD REQUEST when body section is empty as NOT LOGGED', async () => {
        const { body, status } = await request.post(
            `/reset-password/${user.passwordResetToken}`
        );

        expect(body.errors).to.deep.include({
            message: 'is required',
            param: 'password'
        });

        expect(body.errors).to.deep.include({
            message: 'is required',
            param: 'passwordConfirmation'
        });

        expect(status).to.equal(StatusCodes.BAD_REQUEST);
    });
});
