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

    describe('PUT /users/{id}', () => {
        it('returns OK and updates a user sending valid data as USER', async () => {
            const updatedName = 'updated';

            await request
                .put(`/users/${loggedUserId}`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send({ lastName: updatedName });

            const { body, statusCode } = await request
                .get(`/users/${loggedUserId}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(body.lastName).to.equal(updatedName);

            expect(statusCode).to.equal(StatusCodes.OK);
        });

        it('returns FORBIDDEN  trying to update someone else as USER', async () => {
            const user = await UserFactory.create();
            const updatedName = 'updated';

            const { statusCode } = await request
                .put(`/users/${user.id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send({ lastName: updatedName });

            expect(statusCode).to.equal(StatusCodes.FORBIDDEN);
        });

        it("returns NOT_FOUND if user hasn't been found as USER", async () => {
            const updatedName = 'updated';

            const { statusCode } = await request
                .put('/users/999999')
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send({ lastName: updatedName });

            expect(statusCode).to.equal(StatusCodes.NOT_FOUND);
        });
    });
});
