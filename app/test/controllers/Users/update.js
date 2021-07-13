const { expect } = require('chai');

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

    describe('PUT /users/{id}', () => {
        it('updates a user', async () => {
            const updatedName = 'updated';

            await request
                .put(`/users/${loggedUserId}`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send({ lastName: updatedName });

            let response = await request
                .get(`/users/${loggedUserId}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.body.lastName).to.equal(updatedName);
        });

        it('returns 403 when trying to update someone else', async () => {
            const user = await UserFactory.create();
            const updatedName = 'updated';

            let response = await request
                .put(`/users/${user.id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send({ lastName: updatedName });

            expect(response.statusCode).to.equal(403);
        });

        it("returns 404 if user hasn't been found", async () => {
            const updatedName = 'updated';

            let response = await request
                .put(`/users/999999`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send({ lastName: updatedName });

            expect(response.statusCode).to.equal(404);
        });
    });
});
