/**
 * Reviews.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    header: { type: 'string', required: true },
    rating: { type: 'number', required: true },
    feedback: { type: 'string', required: true },
    /**
     * This is the other side of the association from the Recipe model. (See api/models/Recipes.js))
    */
    recipeId: {
      model: 'recipes'
    },
  
    /**
     * And this one is for associating back to a User.
      */
    userId: {
        model: 'users'
    }
  },
};

