/**
 * Refer to api/controllers/recipe/create.js for more detailed explanations of some of the code being used in this Action.
 */

 module.exports = {


    friendlyName: 'Get by Id',
  
  
    description: 'Get a Recipe by ID.',
  
  
    inputs: {
      id: { type: 'string', required: true }
    },
  
  
    exits: {
  
      success: {
        statusCode: 200
      },
  
      notFound: {
        statusCode: 404
      }
    },
  
    // In config/routes.js, this gets called via 'GET /api/recipes/:id': { action: 'recipe/getbyid' }, because this file is named "getbyid" and this is its function.
    fn: async function (inputs, exits) {
  
      let recipe = await Recipes.findOne({
        where: { id: inputs.id }
      })
      /**
       * The following call to `populate(...)` will use the association we set up in the Reviews and User model to pull data for those.
       * 
       * See examples in search.js for ways to filter objects through the .populate() functions.
       * 
       * See the documentation for other calls, as well as passing a sub-query into `populate(...)`: https://sailsjs.com/documentation/reference/waterline-orm/queries
       */
      .populate('reviews')
      .populate('user');
  
      if (!recipe) {
        return exits.notFound({
          message: `Could not find a Recipe with Id: ${inputs.id}`,
        });
      }
  
      recipe.createdDate = new Date(recipe.createdDate);
      recipe.modifiedDate = new Date(recipe.modifiedDate);
      let response = [recipe]; // Spec calls to return it in an array. :/
  
      return exits.success(response);
    }
  };
  