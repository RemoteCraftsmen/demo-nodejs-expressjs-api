const faker = require('faker');
const { Todo } = require('../../src/models');

class TodoFactory {
    static generate(props) {
        const defaultProps = {
            name: faker.lorem.word(),
            userId: faker.datatype.uuid(),
            createdBy: faker.datatype.uuid()
        };

        return Object.assign({}, defaultProps, props);
    }

    static build(props) {
        return Todo.build(TodoFactory.generate(props));
    }

    static create(props) {
        return Todo.create(TodoFactory.generate(props));
    }
}

module.exports = TodoFactory;
