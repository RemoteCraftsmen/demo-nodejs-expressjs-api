import { Todo } from '../models';

export default class TodoController {
    index(request, response, next) {
        Todo.findAll({ where: { user_id: request.user_id } })
            .then(todos => {
                return response.json({ todos });
            })
            .catch(error => {
                return response.sendStatus(400);
            });
    }

    store(request, response, next) {
        const data = request.body;
        data.creator_id = request.user_id;

        Todo.create({ ...data })
            .then(todo => {
                return response.status(201).json(todo);
            })
            .catch(err => {
                const errors = err.errors.map(e => {
                    return { message: e.message, param: e.path };
                });

                return response.status(400).json({ errors });
            });
    }

    show(request, response, next) {
        const todo_id = request.params.id;

        Todo.findById(todo_id)
            .then(todo => {
                if (!todo) {
                    return response.sendStatus(404);
                }

                return response.json(todo);
            })
            .catch(error => {
                return response.sendStatus(404);
            });
    }

    put(request, response, next) {
        const todo_id = request.params.id;
        const fields = request.body;
        fields.creator_id = request.user_id;

        Todo.findById(todo_id).then(todo => {
            if (!todo) {
                return Todo.create({ ...fields, todo_id })
                    .then(todo => {
                        return response.status(201).json(todo);
                    })
                    .catch(err => {
                        const errors = err.errors.map(e => {
                            return { message: e.message, param: e.path };
                        });

                        return response.status(400).json({ errors });
                    });
            }

            if (todo.user_id !== request.user_id) {
                return response.sendStatus(401);
            }

            return todo
                .update(fields, { fields: ['name', 'user_id'] })
                .then(() => {
                    return response.sendStatus(200);
                })
                .catch(err => {
                    const errors = err.errors.map(e => {
                        return { message: e.message, param: e.path };
                    });

                    return response.status(400).json({ errors });
                });
        });
    }

    patch(request, response, next) {
        const todo_id = request.params.id;
        const fields = request.body;

        Todo.findById(todo_id).then(todo => {
            if (!todo) {
                return response.sendStatus(404);
            }

            if (todo.user_id !== request.user_id) {
                return response.sendStatus(401);
            }

            todo.update(fields, { fields: ['name', 'user_id'] })
                .then(() => {
                    response.sendStatus(200);
                })
                .catch(error => {
                    response.sendStatus(400);
                });
        });
    }

    destroy(request, response, next) {
        const todo_id = request.params.id;

        Todo.findById(todo_id).then(todo => {
            if (!todo) {
                return response.sendStatus(404);
            }

            if (todo.user_id !== request.user_id) {
                return response.sendStatus(401);
            }

            todo.destroy()
                .then(() => {
                    response.sendStatus(204);
                })
                .catch(error => {
                    response.sendStatus(400);
                });
        });
    }
}
