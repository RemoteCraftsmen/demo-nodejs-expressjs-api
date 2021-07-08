module.exports = {
    services: {
        'controllers.users.indexController': {
            class: '/controllers/User/IndexController',
            arguments: ['@repositories.user']
        },
        'controllers.users.destroyController': {
            class: '/controllers/User/DestroyController',
            arguments: ['@repositories.user']
        },
        'controllers.users.showController': {
            class: '/controllers/User/ShowController',
            arguments: ['@repositories.user']
        },
        'controllers.users.storeController': {
            class: '/controllers/User/StoreController',
            arguments: ['@repositories.user']
        },
        'controllers.users.updateController': {
            class: '/controllers/User/UpdateController',
            arguments: ['@repositories.user']
        }
    }
};
