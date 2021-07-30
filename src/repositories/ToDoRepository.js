const AbstractRepository = require('./AbstractRepository');

class ToDoRepository extends AbstractRepository {
    get model() {
        return this.db.Todo;
    }
}

module.exports = ToDoRepository;
