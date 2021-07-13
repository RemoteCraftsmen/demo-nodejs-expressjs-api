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
        it('Registers a new user and returns OK when passing valid data', async () => {
            const userData = UserFactory.generate();

            let response = await request.post(`/users`).send(userData);

            expect(response.body).to.have.property('auth').to.equal(true);

            expect(response.statusCode).to.equal(StatusCodes.CREATED);
        });

        it('Returns BAD_REQUEST sending no data', async () => {
            let response = await request.post(`/users`);

            expect(response.body).to.have.property('errors');

            expect(response.body.errors).to.deep.include({
                param: 'firstName',
                message: 'cannot be blank'
            });

            expect(response.body.errors).to.deep.include({
                param: 'lastName',
                message: 'cannot be blank'
            });

            expect(response.body.errors).to.deep.include({
                param: 'userName',
                message: 'cannot be blank'
            });

            expect(response.body.errors).to.deep.include({
                param: 'password',
                message: 'cannot be blank'
            });

            expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
        });

        it('Returns BAD_REQUEST sending invalid email address', async () => {
            const userData = await UserFactory.generate({
                email: 'definitelyNotAnEmail'
            });

            let response = await request.post(`/users`).send(userData);

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'email',
                message: 'is not valid'
            });

            expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
        });

        it('Returns BAD_REQUEST if email is already in use', async () => {
            await UserFactory.create({ email: `me@me123.com` });
            const userData = await UserFactory.generate({
                email: `me@me123.com`
            });

            let response = await request.post(`/users`).send(userData);

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'email',
                message: 'already in use'
            });

            expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
        });

        it('Returns BAD_REQUEST sending password shorter than 8 character', async () => {
            const userData = await UserFactory.generate({
                password: 12345
            });

            let response = await request.post(`/users`).send(userData);

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'password',
                message: 'cannot have less than 8 characters'
            });

            expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
        });
    });
});
