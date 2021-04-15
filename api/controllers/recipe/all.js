/**
 * Refer to api/controllers/recipe/create.js for more detailed explanations of some of the code being used in this Action.
 */

 module.exports = {


    friendlyName: 'All Recipes',
  
  
    description: 'Gets all recipes.',
  
  
    inputs: {
  
    },
  
  
    exits: {
  
      success: {
        statusCode: 200
      }
    },
  
    // In config/routes.js, this gets called via 'GET /api/recipes': { action: 'recipe/all' }, because this file is named "all" and this is its function.
    fn: async function (inputs, exits) {
  
      let recipes = await Recipes.find()
      /**
       * The following call to `populate(...)` will use the association we set up in the Reviews model.
       * 
       * See the documentation for other calls, as well as passing a sub-query into `populate(...)`: https://sailsjs.com/documentation/reference/waterline-orm/queries
       */
      .populate('reviews');
  
      return exits.success(recipes);
    }
  };
  