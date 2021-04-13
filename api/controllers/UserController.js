/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    getUsers: async (req, res) => {

        let response = await Users.find();

        if (!response)
            return res.badRequest("Error getting users!")

        return res.ok(response);
    },

    getUsersByType: async (req, res) => {

        let response = await Users.find({
            where: { typeOfUser: req.params.type },
            select: ['firstName', 'lastName', 'email', 'typeOfUser']
        });

        if (!response)
            return res.badRequest(`User not found`);

        return res.ok(response);
    },

    getUserById: async (req, res) => {

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

