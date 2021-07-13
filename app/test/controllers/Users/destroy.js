const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const Register = require('../../helpers/register');
const UserFactory = require('../../factories/user');
const truncateDatabase = require('../../helpers/truncate');

const app = require('../../../index');
const request = require('supertest')(app);

let loggedUserId = null;
let loggedUserToken = null;

describe('Users', () => {
    before(async () => {
        await truncateDatabase();

        const { user, token } = await Register(request);
        loggedUserToken = token;
        loggedUserId = user.id;
    });

    describe('DELETE /users/{id}', () => {
        it('Returns NO_CONTENT sending valid data', async () => {
            let response = await request
                .delete(`/users/${loggedUserId}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.statusCode).to.equal(StatusCodes.NO_CONTENT);
        });

        it("Returns NO_CONTENT when user doesn't exist ", async () => {
            let response = await request
                .delete(`/users/9999999`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.statusCode).to.equal(StatusCodes.NO_CONTENT);
        });

        it('Returns FORBIDDEN deleting another user', async () => {
            const user = await UserFactory.create();

            let response = await request
                .delete(`/users/${user.id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.statusCode).to.equal(StatusCodes.FORBIDDEN);
        });
    });
});
