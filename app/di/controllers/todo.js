module.exports = {
    services: {
        'controllers.todo.indexController': {
            class: '/controllers/ToDo/IndexController',
            arguments: ['@repositories.todo']
        },
        'controllers.todo.destroyController': {
            class: '/controllers/ToDo/DestroyController',
            arguments: ['@repositories.todo', '@services.isUUIDValidHandler']
        },
        'controllers.todo.showController': {
            class: '/controllers/ToDo/ShowController',
            arguments: ['@repositories.todo', '@services.isUUIDValidHandler']
        },
        'controllers.todo.storeController': {
            class: '/controllers/ToDo/StoreController',
            arguments: ['@repositories.todo']
        },
        'controllers.todo.updateController': {
            class: '/controllers/ToDo/UpdateController',
            arguments: ['@repositories.todo', '@services.isUUIDValidHandler']
        }
    }
};
