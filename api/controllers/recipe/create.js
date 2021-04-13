module.exports = {


  friendlyName: 'Create',


  description: 'Create recipe.',


  inputs: {
    userId: { type: 'string' },
    name: { type: 'string', required: true, unique: true },
    category: { type: 'string', required: true, isIn: ['Breakfast', 'Lunch', 'Dinner', 'Appetizer', 'Dessert', 'Snack'] },
    ingredients: {
      type: 'JSON',
      required: true,
      custom: function (value) {
        if (Array.isArray(value) && value.length <= 15) {
          for (const current of value) {
            if (current.length > 50)
              return false;
          }
          return true;
        }
        return false;
      }
    },
    instructions: { type: 'JSON' },
  },


  exits: {
    success: {
      statusCode: 201,
      description: "Some description for devs."
    },

    existingRecipe: {
      statusCode: 418,
      description: 'An existing Recipe was already found!' // Note: This will not go in the response.
  }
  },


  fn: async function (inputs, exits) {

    let user = await Users.findOne({
        where: { id: inputs.userId },
        select: ["id"]
    });

    let recipe = await Recipes.create({
        userId: user.id,
        name: inputs.name,
        category: inputs.category,
        ingredients: inputs.ingredients,
        instructions: inputs.instructions
    })
    .intercept('E_UNIQUE', (error) => {
      exits.existingRecipe({
          message: 'Invalid request. Duplicate found!',
          error: error.raw.keyValue
      });
  })
    .fetch();

    return exits.success({
        message: 'Recipe created successfully!',
        recipeId: recipe.id
    });
  }
};
