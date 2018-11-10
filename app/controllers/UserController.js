import Auth from '../services/Auth';
import { User } from '../models';

export default class UserController {
    index(request, response, next) {
        User.findAll()
            .then(users => {
                response.json({ users });
            })
            .catch(error => {
                response.sendStatus(400);
            });
    }

    store(request, response, next) {
        User.create({ ...request.body })
            .then(user => {
                const token = Auth.signIn(user);

                return response.json({ auth: true, token });
            })
            .catch(err => {
                const errors = err.errors.map(e => {
                    return { message: e.message, param: e.path };
                });

                return response.status(400).json({ errors });
            });
    }

    show(request, response, next) {
        const user_id = request.params.id;

        User.findById(user_id)
            .then(user => {
                if (!user) {
                    return response.sendStatus(404);
                }

                response.json(user);
            })
            .catch(error => {
                response.sendStatus(404);
            });
    }

    update(request, response, next) {
        const user_id = request.params.id;
        const fields = request.body;

        User.findById(user_id).then(user => {
            if (!user) {
                return response.sendStatus(404);
            }

            if (user.id !== request.logged_user_id) {
                return response.sendStatus(401);
            }

            user.update(fields)
                .then(() => {
                    response.sendStatus(200);
                })
                .catch(error => {
                    response.sendStatus(400);
                });
        });
    }

    destroy(request, response, next) {
        const user_id = request.params.id;

        User.findById(user_id).then(user => {
            if (!user) {
                return response.sendStatus(404);
            }

            if (user.id !== request.logged_user_id) {
                return response.sendStatus(401);
            }

            user.destroy()
                .then(() => {
                    response.sendStatus(204);
                })
                .catch(error => {
                    response.sendStatus(400);
                });
        });
    }
}
