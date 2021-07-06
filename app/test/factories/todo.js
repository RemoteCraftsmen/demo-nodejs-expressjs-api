const faker = require('faker');
const { Todo } = require('../../models');

class TodoFactory {
    static generate(props) {
        const defaultProps = {
            name: faker.lorem.word(),
            userId: faker.datatype.number(),
            creatorId: faker.datatype.number()
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
