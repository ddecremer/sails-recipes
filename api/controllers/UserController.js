/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

/**
 * In Sails, a Controller acts like you might expect in other MVC frameworks. It is a collection of functions that all relate to a specific entity, which in this case in `User`.
 * In comparison to Actions in Sails, which separates all these functions into individual files, each with only one function within them, use `inputs` and `exits` for handling request and response objects.
 * Refer to the documentation about handling `req` and `res` parameters for each function:
 *  - https://sailsjs.com/documentation/reference/request-req
 *  - https://sailsjs.com/documentation/reference/response-res
 */
module.exports = {

    // In config/routes.js, this gets called via 'POST /api/users': { controller: 'UserController', action: 'postUser'}
    postUser: async (req, res) => {

        if (!req && !req.body)
            return res.badRequest();
                
        /**
         * Here we're going to use `create(...)`, which is one of many built-in "Model methods" for node.js that Sails also uses.
         * 
         * See the documentation for other methods you can use: https://sailsjs.com/documentation/reference/waterline-orm/models
         */
        let user = await Users.create(req.body).fetch();

        return res.status(201).json(user);
    },

    
    getUsers: async (req, res) => {

        let response = await Users.find();

        if (!response)
            return res.badRequest("Error getting users!")

        return res.ok(response);
    },

    // In config/routes.js, this gets called via 'GET /api/users/type/:type': { controller: 'UserController', action: 'getUsersByType'},
    getUsersByType: async (req, res) => {

        let response = await Users.find({
            where: { typeOfUser: req.params.type },
            select: ['firstName', 'lastName', 'email', 'typeOfUser']
        });

        if (!response)
            return res.badRequest(`User not found`);

        return res.ok(response);
    },

    // In config/routes.js, this gets called via 'GET /api/users/id/:id': { controller: 'UserController', action: 'getUserById'}
    getUserById: async (req, res) => {

        /**
         * Sails comes with built-in support for Waterline, an ORM designed to abstract away datastore-specific syntax so, in theory, you can connect to any type without needing to change your code here.
         * 
         * In our example here, we're simply going to "select" a few properties and use a where clause to get a specific User record by its Id.
         * 
         * See the documentation for more information: https://sailsjs.com/documentation/reference/waterline-orm
         *  and https://sailsjs.com/documentation/concepts/models-and-orm/query-language
         */
        let response = await Users.find({
            where: { id: req.params.id },
            select: ["firstName", "lastName", "email", "typeOfUser"]
        })
        /**
         * The following calls to `populate(...)` will use the associations we set up in the Recipes and Reviews models.
         * 
         * See the documentation for other calls, as well as passing a sub-query into `populate(...)`: https://sailsjs.com/documentation/reference/waterline-orm/queries
         */
        .populate('recipes', {
            sort: 'name',
            select: 'name'
        })
        .populate('reviews', {
            sort: 'createdDate DESC',
            select: 'header',
            limit: 3
        });

        if (!response)
            return res.badRequest(`User not found`);

        return res.ok(response);
    },
};

