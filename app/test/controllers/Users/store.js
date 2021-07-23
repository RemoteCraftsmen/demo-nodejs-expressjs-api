const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const UserFactory = require('../../factories/user');
const truncateDatabase = require('../../helpers/truncate');

const app = require('../../../index');
const request = require('supertest')(app);

describe('Users', () => {
    before(async () => {
        await truncateDatabase();
    });

    describe('POST /users', () => {
        it('returns OK when passing valid data as NOT-LOGGED-IN', async () => {
            const userData = UserFactory.generate();

            const { body, statusCode } = await request
                .post('/users')
                .send(userData);

            expect(body).to.have.property('id');
            expect(body)
                .to.have.property('firstName')
                .to.equal(userData.firstName);
            expect(body)
                .to.have.property('userName')
                .to.equal(userData.userName);
            expect(body)
                .to.have.property('lastName')
                .to.equal(userData.lastName);
            expect(body).to.have.property('email').to.equal(userData.email);

            expect(body).to.not.have.property('password');
            expect(body).to.not.have.property('passwordResetToken');
            expect(body).to.not.have.property('passwordResetTokenExpiresAt');

            expect(statusCode).to.equal(StatusCodes.CREATED);
        });

        it('returns BAD_REQUEST sending no data as NOT-LOGGED-IN', async () => {
            const { body, statusCode } = await request.post(`/users`);

            expect(body).to.have.property('errors');

            expect(body.errors).to.deep.include({
                param: 'firstName',
                message: 'First name is required.'
            });

            expect(body.errors).to.deep.include({
                param: 'lastName',
                message: 'Last name is required.'
            });

            expect(body.errors).to.deep.include({
                param: 'userName',
                message: 'User name is required.'
            });

            expect(body.errors).to.deep.include({
                param: 'password',
                message: 'Password is required.'
            });

            expect(statusCode).to.equal(StatusCodes.BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending invalid email address as NOT-LOGGED-IN', async () => {
            const userData = await UserFactory.generate({
                email: 'definitelyNotAnEmail'
            });

            const { body, statusCode } = await request
                .post('/users')
                .send(userData);

            expect(body).to.have.property('errors');
            expect(body.errors).to.deep.include({
                param: 'email',
                message: 'Email is not valid.'
            });

            expect(statusCode).to.equal(StatusCodes.BAD_REQUEST);
        });

        it('returns BAD_REQUEST if email is already in use as NOT-LOGGED-IN', async () => {
            await UserFactory.create({ email: `me@me123.com` });
            const userData = await UserFactory.generate({
                email: `me@me123.com`
            });

            const { body, statusCode } = await request
                .post('/users')
                .send(userData);

            expect(body).to.have.property('errors');
            expect(body.errors).to.deep.include({
                param: 'email',
                message: 'Already in use.'
            });

            expect(statusCode).to.equal(StatusCodes.BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending password shorter than 8 character as NOT-LOGGED-IN', async () => {
            const userData = await UserFactory.generate({
                password: 12345
            });

            const { body, statusCode } = await request
                .post('/users')
                .send(userData);

            expect(body).to.have.property('errors');
            expect(body.errors).to.deep.include({
                param: 'password',
                message: 'Password should be longer than 8 characters.'
            });

            expect(statusCode).to.equal(StatusCodes.BAD_REQUEST);
        });
    });
});
