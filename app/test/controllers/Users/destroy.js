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
        it('returns NO_CONTENT sending valid data as USER', async () => {
            const { statusCode } = await request
                .delete(`/users/${loggedUserId}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(statusCode).to.equal(StatusCodes.NO_CONTENT);
        });

        it('returns BAD_REQUEST when user.id is not valid UUID as USER', async () => {
            const { body, statusCode } = await request
                .delete('/users/9999999')
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(body).to.have.property('errors');
            expect(body.errors).to.deep.include({
                message: 'Must be valid UUID.',
                param: 'id'
            });

            expect(statusCode).to.equal(StatusCodes.BAD_REQUEST);
        });

        it('returns FORBIDDEN deleting another user as USER', async () => {
            const user = await UserFactory.create();

            const { statusCode } = await request
                .delete(`/users/${user.id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(statusCode).to.equal(StatusCodes.FORBIDDEN);
        });
    });
});
