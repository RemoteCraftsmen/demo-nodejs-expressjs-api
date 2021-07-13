const { expect } = require('chai');

const Register = require('../../helpers/register');
const UserFactory = require('../../factories/user');
const truncateDatabase = require('../../helpers/truncate');

const app = require('../../../index');
const request = require('supertest')(app);

let users = [];
let loggedUserId = null;
let loggedUserToken = null;

describe('Auth', () => {
    before(async () => {
        await truncateDatabase();

        const { user, token } = await Register(request);
        loggedUserToken = token;
        loggedUserId = user.id;

        users.push(await UserFactory.create());
        users.push(await UserFactory.create());
        users.push(await UserFactory.create());
    });

    describe('POST /login', () => {
        it('returns a token when passing valid data', async () => {
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
        });

        it('does not authenticate with invalid data', async () => {
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
        });
    });
});
