/**
 * Recipes.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    userEmail: { type: 'string' },
    name: { type: 'string', required: true, unique: true },
    category: { type: 'string', required: true, isIn: ['Breakfast', 'Lunch', 'Dinner', 'Appetizer', 'Dessert', 'Snack'] },
    ingredients: { type: 'JSON' },
    instructions: { type: 'JSON' },
    /**
     * To set up a One-to-Many relationship, we need to and an attribute (most likely the name of the model we're associating).
     * Then, we'll need to go to that model and set up the other side of the association.
     * In this case, we have a Recipe (the One) that has Reviews (the Many).
     * Head over to api/models/Reviews.js to see what is done over there to relate back to here.
     * 
     * But, these won't do any good if we don't get the associated data through the `populate(...)` call in our Actions or Controllers.
     * See api/controllers/recipe/getbyid.js for how to do that.
     * 
     * See the documentation: https://sailsjs.com/documentation/concepts/models-and-orm/associations/one-to-many
     */
    reviews: {
      collection: 'reviews',
      via: 'recipeId'
    },

    /**
     * And this one is for associating back to a User.
     */
    userId: {
        model: 'users'
    },
  },

};

