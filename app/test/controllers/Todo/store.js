const { expect } = require('chai');

const Register = require('../../helpers/register');
const TodoFactory = require('../../factories/todo');
const truncateDatabase = require('../../helpers/truncate');

const app = require('../../../index');
const request = require('supertest')(app);

let todos = [];
let loggerUserId;
let loggedUserToken;

describe('Todos', () => {
    before(async () => {
        await truncateDatabase();

        const { user, token } = await Register(request);
        loggedUserToken = token;
        loggerUserId = user.id;

        todos.push(await TodoFactory.create({ userId: loggerUserId }));
        todos.push(await TodoFactory.create({ userId: loggerUserId }));
        todos.push(await TodoFactory.create({ userId: loggerUserId }));
    });

    describe('POST /todos', () => {
        it('registers a new todo when passing valid data', async () => {
            const todo = await TodoFactory.create();

            let response = await request
                .post('/todos')
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send({ name: todo.name });

            expect(response.body)
                .to.have.property('creatorId')
                .to.equal(loggerUserId);
        });

        it('returns an error if name is blank', async () => {
            let response = await request
                .post('/todos')
                .set('Authorization', 'Bearer ' + loggedUserToken)
                .send({ name: null });

            expect(response.body).to.have.property('errors');
            expect(response.body.errors).to.deep.include({
                param: 'name',
                message: 'cannot be blank'
            });
        });
    });
});
