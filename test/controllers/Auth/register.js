const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const UserFactory = require('../../factories/user');
const truncateDatabase = require('../../helpers/truncate');

const app = require('../../../src/index');
const request = require('supertest')(app);

describe('Auth', () => {
    before(async () => {
        await truncateDatabase();
    });

    describe('POST /register', () => {
        it('returns CREATED  passing valid data as NOT-LOGGED-IN', async () => {
            const userData = UserFactory.generate();

            const { body, statusCode } = await request
                .post('/auth/register')
                .send(userData);

            expect(body).to.have.property('token').to.not.be.null;
            expect(statusCode).to.equal(StatusCodes.CREATED);
        });

        it('returns BAD_REQUEST  passing no data as NOT-LOGGED-IN', async () => {
            const { body, statusCode } = await request.post('/auth/register');

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
    });
});
