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

    describe('POST /users', () => {
        it('registers a new user when passing valid data', async () => {
            const userData = UserFactory.generate();

            let response = await request.post(`/users`).send(userData);

            expect(response.body).to.have.property('auth').to.equal(true);
        });

        it('returns an error if firstName is blank', async () => {
            const userData = await UserFactory.generate({
                firstName: null
            });

            let response = await request.post(`/users`).send(userData);

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'firstName',
                message: 'cannot be blank'
            });
        });

        it('returns an error if lastName is blank', async () => {
            const userData = await UserFactory.generate({
                lastName: null
            });

            let response = await request.post(`/users`).send(userData);

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'lastName',
                message: 'cannot be blank'
            });
        });

        it('returns an error if username is blank', async () => {
            const userData = await UserFactory.generate({ userName: null });

            let response = await request.post(`/users`).send(userData);

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'userName',
                message: 'cannot be blank'
            });
        });

        it('returns an error if email is not a valid email address', async () => {
            const userData = await UserFactory.generate({
                email: 'definitelyNotAnEmail'
            });

            let response = await request.post(`/users`).send(userData);

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'email',
                message: 'is not valid'
            });
        });

        it('returns an error if email is already in use', async () => {
            await UserFactory.create({ email: `me@me123.com` });
            const userData = await UserFactory.generate({
                email: `me@me123.com`
            });

            let response = await request.post(`/users`).send(userData);

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'email',
                message: 'already in use'
            });
        });

        it('returns an error if password is blank', async () => {
            const userData = await UserFactory.generate({ password: null });

            let response = await request.post(`/users`).send(userData);

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'password',
                message: 'cannot be blank'
            });
        });

        it('returns an error if password contains less than 6 character', async () => {
            const userData = await UserFactory.generate({
                password: 12345
            });

            let response = await request.post(`/users`).send(userData);

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'password',
                message: 'cannot have less than 8 characters'
            });
        });
    });
});
