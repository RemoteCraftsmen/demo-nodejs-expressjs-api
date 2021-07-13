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

    describe('DELETE /users/{id}', () => {
        it('deletes a user', async () => {
            let response = await request
                .delete(`/users/${loggedUserId}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.statusCode).to.equal(204);
        });

        it('returns 403 when trying to delete someone else', async () => {
            const user = await UserFactory.create();

            let response = await request
                .delete(`/users/${user.id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.statusCode).to.equal(403);
        });

        it("returns 204 if user hasn't been found", async () => {
            let response = await request
                .delete(`/users/9999999`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(response.statusCode).to.equal(204);
        });
    });
});
