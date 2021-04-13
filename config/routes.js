/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
    'GET /api/users': { controller: 'UserController', action: 'getUsers' },
    'GET /api/users/type/:type': { controller: 'UserController', action: 'getUsersByType' },
    'GET /api/users/id/:id': { controller: 'UserController', action: 'getUserById'},

    'POST /api/recipes': { action: 'recipe/create' },

    'GET /api/recipes/search': { action: 'recipe/search' },
};
