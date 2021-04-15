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

    // ********** Users ********** //
    'GET /api/users': { controller: 'UserController', action: 'getUsers' },
    'GET /api/users/type/:type': { controller: 'UserController', action: 'getUsersByType' },
    'GET /api/users/id/:id': { controller: 'UserController', action: 'getUserById'},

    'POST /api/users': { controller: 'UserController', action: 'post_user'},

    // ********** Recipes ********** //
    'GET /api/recipes': { action: 'recipe/all' },
    'GET /api/recipes/:id': { action: 'recipe/getbyid' },
    'GET /api/recipes/search': { action: 'recipe/search' },

    'POST /api/recipes': { action: 'recipe/create' },

};
