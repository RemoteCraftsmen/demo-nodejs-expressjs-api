const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const Register = require('../../helpers/register');
const UserFactory = require('../../factories/user');
const TodoFactory = require('../../factories/todo');
const truncateDatabase = require('../../helpers/truncate');

const app = require('../../../index');
const request = require('supertest')(app);

let loggerUserId;
let loggedUserToken;

describe('Todos', () => {
    before(async () => {
        await truncateDatabase();

        const { user, token } = await Register(request);
        loggedUserToken = token;
        loggerUserId = user.id;
    });

    describe('DELETE /todos/{id}', () => {
        it('returns NO_CONTENT deleting TODO as USER', async () => {
            const todo = await TodoFactory.create({
                userId: loggerUserId
            });

            const { statusCode } = await request
                .delete(`/todos/${todo.id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(statusCode).to.equal(StatusCodes.NO_CONTENT);
        });

        it('returns NO_CONTENT deleting non-existing TODO as USER', async () => {
            const { statusCode } = await request
                .delete('/todos/99999999')
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(statusCode).to.equal(StatusCodes.NO_CONTENT);
        });

        it("returns FORBIDDEN deleting someone else's todo as USER", async () => {
            const anotherUser = await UserFactory.create();
            const todo = await TodoFactory.create({
                userId: anotherUser.id
            });

            const { statusCode } = await request
                .delete(`/todos/${todo.id}`)
                .set('Authorization', 'Bearer ' + loggedUserToken);

            expect(statusCode).to.equal(StatusCodes.FORBIDDEN);
        });
    });
});
