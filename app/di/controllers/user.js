module.exports = {
    services: {
        'controllers.users.indexController': {
            class: '/controllers/User/IndexController',
            arguments: ['@repositories.user']
        },
        'controllers.users.destroyController': {
            class: '/controllers/User/DestroyController',
            arguments: ['@repositories.user', '@services.IsValidUuid']
        },
        'controllers.users.showController': {
            class: '/controllers/User/ShowController',
            arguments: ['@repositories.user', '@services.IsValidUuid']
        },
        'controllers.users.storeController': {
            class: '/controllers/User/StoreController',
            arguments: ['@repositories.user', '@services.auth']
        },
        'controllers.users.updateController': {
            class: '/controllers/User/UpdateController',
            arguments: ['@repositories.user', '@services.IsValidUuid']
        }
    }
};
