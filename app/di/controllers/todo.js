module.exports = {
    services: {
        'controllers.todo.indexController': {
            class: '/controllers/ToDo/IndexController',
            arguments: ['@repositories.todo']
        },
        'controllers.todo.destroyController': {
            class: '/controllers/ToDo/DestroyController',
            arguments: ['@repositories.todo', '@services.IsValidUuid']
        },
        'controllers.todo.showController': {
            class: '/controllers/ToDo/ShowController',
            arguments: ['@repositories.todo', '@services.IsValidUuid']
        },
        'controllers.todo.storeController': {
            class: '/controllers/ToDo/StoreController',
            arguments: ['@repositories.todo']
        },
        'controllers.todo.updateController': {
            class: '/controllers/ToDo/UpdateController',
            arguments: ['@repositories.todo', '@services.IsValidUuid']
        },
        'controllers.todo.patchController': {
            class: '/controllers/ToDo/PatchController',
            arguments: ['@repositories.todo', '@services.IsValidUuid']
        }
    }
};
