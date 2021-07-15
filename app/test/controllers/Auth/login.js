const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const UserFactory = require('../../factories/user');
const truncateDatabase = require('../../helpers/truncate');

const app = require('../../../index');
const request = require('supertest')(app);

describe('Auth', () => {
    before(async () => {
        await truncateDatabase();
    });

    describe('POST /login', () => {
        it('returns OK  passing valid data as NOT-LOGGED-IN', async () => {
            await UserFactory.create({
                email: 'us@er.com',
                password: 'somepass'
            });

            const { body, statusCode } = await request
                .post('/auth/login')
                .send({
                    email: 'us@er.com',
                    password: 'somepass'
                });

            expect(body).to.have.property('token').to.not.be.null;
            expect(statusCode).to.equal(StatusCodes.OK);
        });

        it('returns UNAUTHORIZED sending invalid data as NOT-LOGGED-IN', async () => {
            await UserFactory.create({
                email: 'us@ere.com',
                password: 'somepass'
            });

            const { body, statusCode } = await request
                .post('/auth/login')
                .send({
                    email: 'us@ere.com',
                    password: 'wrongpass'
                });

            expect(body).to.have.property('token').to.be.null;
            expect(statusCode).to.equal(StatusCodes.UNAUTHORIZED);
        });
    });
});
