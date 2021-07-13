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

    describe('GET /users/{id}', () => {
        it('Returns OK fetches a single user as USER', async () => {
            let response = await request
                .get(`/users/${users[0].id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.body).to.have.property('email');
            expect(response.body.email).to.equal(users[0].email);

            expect(response.statusCode).to.equal(StatusCodes.OK);
        });

        it("Returns NOT_FOUND if user doesn't exist", async () => {
            let response = await request
                .get(`/users/99999999`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.statusCode).to.equal(StatusCodes.NOT_FOUND);
        });
    });
});
