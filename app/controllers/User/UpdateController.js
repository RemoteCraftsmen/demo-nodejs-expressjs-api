const { StatusCodes } = require('http-status-codes');
const Auth = require('../../services/Auth');
const { User } = require('../../models');

class UpdateController {
    //------------------------- to update Cont

    /**
     *  @api {put} /users Update User
     *  @apiName PutUserUpdate
     *  @apiGroup Users
     *  @apiVersion 1.0.0
     *
     *  @apiParam {String} userName
     *  @apiParam {String} firstName
     *  @apiParam {String} lastName
     *  @apiParam {String} email User
     *  @apiParam {String} password
     *
     *  @apiParamExample {json} Request-Example:
     *   {
     *   	"userName": "aaaa",
     *   	"firstName": "aaaaa",
     *   	"lastName": "aaaaa",
     *   	"email": "test123@test.com",
     *   	"password": "123456"
     *   }
     *
     *  @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *    {
     *        "auth": true,
     *        "token": TOKEN GENERATED BY JWT,
     *        "user": {
     *            "id": 6,
     *            "userName": "aaaa",
     *            "firstName": "aaaaa",
     *            "lastName": "aaaaa",
     *            "updatedAt": "2018-11-27T11:57:02.003Z",
     *            "createdAt": "2018-11-27T11:57:02.003Z"
     *        }
     *    }
     *
     *  @apiSuccess {Boolean}    auth
     *  @apiSuccess {String}     token
     *  @apiSuccess {Object}     user
     *
     *   @apiError NotFound     The User with <code>id</code> was not found.
     *   @apiError Forbidden    Users can delete only themselfs
     *   @apiError BadRequest
     *
     */
    async invoke(request, response, next) {
        const userId = request.params.id;
        const fields = request.body;

        User.findByPk(userId).then(user => {
            if (!user) {
                return response.sendStatus(StatusCodes.NOT_FOUND);
            }

            if (user.id !== request.loggedUserId) {
                return response.sendStatus(StatusCodes.FORBIDDEN);
            }

            user.update(fields)
                .then(() => {
                    response.sendStatus(StatusCodes.OK);
                })
                .catch(next);
        });
    }
}

module.exports = UpdateController;