const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const Register = require('../../helpers/register');
const truncateDatabase = require('../../helpers/truncate');

const app = require('../../../../index');
const request = require('supertest')(app);

let loggedUserId;
let loggedUserToken;
let loggedUser;

describe('Users', () => {
    before(async () => {
        await truncateDatabase();

        const { user, token } = await Register(request);
        loggedUserToken = token;
        loggedUserId = user.id;
        loggedUser = user;
    });

    describe('PUT /users/{id}', () => {
        it('returns OK and updates a user sending valid data as USER', async () => {
            const updatedName = 'updated';
            loggedUser.lastName = updatedName;

            await request
                .put(`/users/${loggedUserId}`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send(loggedUser);

            const { body, statusCode } = await request
                .get(`/users/${loggedUserId}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(body.lastName).to.equal(updatedName);
            expect(statusCode).to.equal(StatusCodes.OK);
        });

        it('returns FORBIDDEN  trying to update someone else as USER', async () => {
            const { user } = await Register(request);
            const updatedName = 'updated';
            user.lastName = updatedName;

            const { statusCode } = await request
                .put(`/users/${user.id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send(user);

            expect(statusCode).to.equal(StatusCodes.FORBIDDEN);
        });

        it('returns BAD_REQUEST sending not valid UUID as USER', async () => {
            const { body, statusCode } = await request
                .put('/users/999999')
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(body).to.have.property('errors');
            expect(body.errors).to.deep.include({
                message: 'Must be a valid UUID.',
                param: 'id'
            });
            expect(body.errors).to.deep.include({
                message: 'First name is required.',
                param: 'firstName'
            });
            expect(body.errors).to.deep.include({
                message: 'First name must have more than 2 characters.',
                param: 'firstName'
            });
            expect(body.errors).to.deep.include({
                message: 'User name is required.',
                param: 'userName'
            });
            expect(body.errors).to.deep.include({
                message: 'User name must have more than 2 characters.',
                param: 'userName'
            });
            expect(body.errors).to.deep.include({
                message: 'Last name is required.',
                param: 'lastName'
            });
            expect(body.errors).to.deep.include({
                message: 'Last Name must have more than 2 characters.',
                param: 'lastName'
            });
            expect(body.errors).to.deep.include({
                message: 'Email is required.',
                param: 'email'
            });
            expect(body.errors).to.deep.include({
                message: 'Email is not valid.',
                param: 'email'
            });

            expect(statusCode).to.equal(StatusCodes.BAD_REQUEST);
        });
    });
});
