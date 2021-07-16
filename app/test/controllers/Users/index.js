const { expect } = require('chai');

const { StatusCodes } = require('http-status-codes');

const Register = require('../../helpers/register');
const UserFactory = require('../../factories/user');
const truncateDatabase = require('../../helpers/truncate');

const app = require('../../../index');
const request = require('supertest')(app);

let users = [];
let loggedUserId = null;
let loggedUserToken = null;

describe('Users', () => {
    before(async () => {
        await truncateDatabase();

        const { user, token } = await Register(request);
        loggedUserToken = token;
        loggedUserId = user.id;

        users.push(await UserFactory.create());
        users.push(await UserFactory.create());
        users.push(await UserFactory.create());
    });

    describe('GET /users', () => {
        it('returns OK sending valid data as USER', async () => {
            const { body, statusCode } = await request
                .get('/users')
                .set('Authorization', 'Bearer ' + loggedUserToken);

            for (const user of users) {
                expect(body).to.deep.include({
                    id: user.id,
                    userName: user.userName,
                    lastName: user.lastName,
                    firstName: user.firstName,
                    email: user.email,
                    createdAt: user.createdAt.toISOString(),
                    updatedAt: user.updatedAt.toISOString()
                });
            }

            expect(statusCode).to.equal(StatusCodes.OK);
        });

        it('returns UNAUTHORIZED as NOT-LOGGED-IN', async () => {
            const { statusCode } = await request.get('/users');

            expect(statusCode).to.equal(StatusCodes.UNAUTHORIZED);
        });
    });
});
