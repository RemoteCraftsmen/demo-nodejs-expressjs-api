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
        it('Returns OK fetches a all users as USER', async () => {
            let response = await request
                .get(`/users`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            for (let user of users) {
                expect(response.body).to.deep.include({
                    id: user.id,
                    userName: user.userName,
                    lastName: user.lastName,
                    firstName: user.firstName,
                    email: user.email
                });
            }

            expect(response.statusCode).to.equal(StatusCodes.OK);
        });

        it('Returns FORBIDDEN as not logged in', async () => {
            let response = await request.get(`/users`);

            expect(response.statusCode).to.equal(StatusCodes.FORBIDDEN);
        });
    });
});
