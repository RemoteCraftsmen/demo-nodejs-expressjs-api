import faker from 'faker';
import { Todo, User } from '../../models';

import UserFactory from './user';

const generateData = async (props = {}) => {
    const defaultProps = {
        name: faker.lorem.word(),
        user_id: (await UserFactory()).id,
        creator_id: (await UserFactory()).id
    };

    return Object.assign({}, defaultProps, props);
};

export default async (props = {}, make = false) => {
    if (make) {
        return Todo.build(await generateData(props));
    }

    return Todo.create(await generateData(props));
};
