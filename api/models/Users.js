/**
 * Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    firstName: { type: 'string', required: true },
    lastName: { type: 'string', required: true },
    email: { type: 'string', required: true, unique: true, isEmail: true },
    typeOfUser: { type: 'string', required: true, isIn: ['Chef', 'Cook' ] },
    /**
     * To set up a One-to-Many relationship, we need to and an attribute (most likely the name of the model we're associating).
     * Then, we'll need to go to that model and set up the other side of the association.
     * In this case, we have a User (the One) that has Recipes (the Many).
     * Head over to api/models/Recipes.js to see what is done over there to relate back to here.
     * 
     * See the documentation: https://sailsjs.com/documentation/concepts/models-and-orm/associations/one-to-many
     */
    recipes: {
      collection: 'recipes',
      via: 'user'
    },
  
    /**
     * And here is another One-to-Many, because Users can also have a number of Reviews.
     */
    reviews: {
      collection: 'reviews',
      via: 'user'
    }
  },

};

