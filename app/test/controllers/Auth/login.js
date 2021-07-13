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
        it('Returns OK  passing valid data', async () => {
            await UserFactory.create({
                email: 'us@er.com',
                password: 'somepass'
            });

            let response = await request.post(`/auth/login`).send({
                email: 'us@er.com',
                password: 'somepass'
            });

            expect(response.body).to.have.property('auth').to.equal(true);

            expect(response.body).to.have.property('token').to.not.be.null;

            expect(response.statusCode).to.equal(StatusCodes.OK);
        });

        it('Returns UNAUTHORIZED sending invalid data', async () => {
            await UserFactory.create({
                email: 'us@ere.com',
                password: 'somepass'
            });

            let response = await request.post(`/auth/login`).send({
                email: 'us@ere.com',
                password: 'wrongpass'
            });

            expect(response.body).to.have.property('auth').to.equal(false);

            expect(response.body).to.have.property('token').to.be.null;

            expect(response.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
        });
    });
});
