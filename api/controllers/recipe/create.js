module.exports = {

  friendlyName: 'Create Recipe',

  description: 'Creates a new recipe and adds it to the database.',

  inputs: {
    /**
     * `inputs` here are the expected, well, inputs that you allow clients to send to the API endpoint here.
     * You add validators to each one, which are automatically called by the Sails framework and returned to the client upon error.
     * See the documentation for examples: https://sailsjs.com/documentation/concepts/models-and-orm/validations
     */

    /** 
     * You can define basic input properties like the ones here, but it won't use the validators on the model at all, which is a shame to need to have duplication like this.
     * It's much less verbose, produces a Stack Trace on error, outputs as a string, and is more difficult to parse. (Not a preferred way.)
     * For example, if we send an invalid category of 'Breakfasts', then we get this:
     * 
     *   UsageError: Invalid new record.
     *   Details:
     *   Could not use specified `category`. Violated one or more validation rules:
     *   • Value ('Breakfasts') was not in the configured whitelist (Breakfast, Lunch, Dinner, Appetizer, Dessert, Snack)
     *
     *   at Object.fn (c:\Source\NodeJS\SailsProject\orangecheff_sails\api\controllers\recipe\create.js:111:32)
     *   at processTicksAndRejections (internal/process/task_queues.js:93:5)
     */
    // userId: { type: "string" },
    // name: { type: "string" },
    // category: { type: "string" },
    // ingredients: { type: "JSON" },
    // instructions: { type: "JSON" },

    /** 
     * Here is a more explicit way that now involves validators. In this case, we add the `isIn` validator, which takes an array of valid values.
     * See the documentation for more information and other validators: https://sailsjs.com/documentation/concepts/models-and-orm/validations
     * It's more verbose, still a duplicate of what's in the model, provides no Stack Trace, but the response is an object with properties, which is easy to parse. (A preferred way.)
     * For example, if we send an invalid category of 'Breakfasts', then we get this:
     * 
     *    {
     *      "code": "E_MISSING_OR_INVALID_PARAMS",
     *      "problems": [
     *         "Invalid \"category\":\n  · Value ('Breakfasts') was not in the configured whitelist (Breakfast, Lunch, Dinner, Appetizer, Dessert, Snack)"
     *      ],
     *      "message": "The server could not fulfill this request (`POST /api/recipes`) due to 1 missing or invalid parameter.  **The following additional tip will not be shown in production**:  Tip: Check your client-side code to make sure that the request data it sends matches the expectations of the corresponding parameters in your server-side route/action.  Also check that your client-side code sends data for every required parameter.  Finally, for programmatically-parseable details about each validation error, `.problems`. (Just remember, any time you inject dynamic data into the HTML, be sure to escape the strings at the point of injection.)"
     *    }
     */
    userId: { type: "string", required: true },
    name: { type: "string", required: true, unique: true }, // Even if you set `unique: true` here, it won't enforce it unless it's also on the model, itself.
    category: { type: "string", required: true, isIn: ["Breakfast", "Lunch", "Dinner", "Appetizer", "Dessert", "Snack"] },
    /**
     * Trying to see if I can pull a dynamic list from the database instead of a static array like in the one above.
     * Trying to run an async operation here isn't working out too well. It calls the datastore just fine and gets a result, but even if it doesn't find the
     * inputted category (i.e. Munchies) and returns false here, the overall validation still passes and the Recipe is created. ¯\_(ツ)_/¯
     */
    // category: { type: "string", required: true, custom: async function (value) { 
    //   let categories = await Categories.findOne({ where: { name: value } });
    //   if (categories) return true;
    //   return false;
    //  } },

    /** The following two inputs (ingredients and instructions) have custom validations, because no built-in validations satisfy our requirements.
     *  `custom` uses a function that returns a boolean result based on what you want to validate.
     *  For both of these inputs, we want to check that they are arrays and that they each have a limited number of items in them for these requirements:
     *    - The recipe's ingredients should not exceed 15 items, and each should not exceed 50 chars.
     *    - The recipe's instructions should not exceed 20 items, and each should not exceed 200 chars.
     *
     *  You could do anything you want to check that makes an input "valid" that aren't already part of the Sails framework.
     *
     *  Again, see the documentation for more information: https://sailsjs.com/documentation/concepts/models-and-orm/validations
     */
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
    instructions: {
      type: 'JSON',
      required: true,
      custom: function (value) {
        if (Array.isArray(value) && value.length <= 20) {
          for (const current of value) {
            if (current.length > 200)
              return false;
          }
          return true;
        }
        return false;
      }
    }    
  },

  /**
   * `exits` here are the way to set the status code for responses.
   * The `description` property can be whatever you want to call it, as far as I can tell, because it doesn't get returned as part of the response.
   * It seems to really only be there as an aide for devlopers, so you could put others on there for that purpose, as well.
   */
   exits: {
    success: {
      statusCode: 201,
      description: "Some description for devs."
    },

    /** 
     * If we wanted to return a View, we could respond with this, but more than likely a seperate client-side framework is being used these days.
     * On Sails' own site it talks about layout pages being deprecated by Express (part of the underlying engine for Sails), so that tells me that the future of Views in Sails isn't going anywhere.
     * 
     * success: {
     *   responseType: "view",
     *   viewTemplatePath: "pages/recipe/link"
     * },
    */

    /**
     * Here we can define various 'exits' used for different response codes.
     */
    invalidRequest: {
      statusCode: 400,
      description: "An existing Recipe was already found!"
    },

    existingRecipe: {
      statusCode: 409,
      description: "An existing Recipe was already found!"
    },

    someCatchAll: {
      statusCode: 418, // 418, because we can. :)
      description: 'A catch-all for whatever we feel like.'
    }
  },

  /**
   * This is the one and only function in a Sails Action, since each file is designed to be separate from other functionality.
   * 
   * See the documentation for more information: https://sailsjs.com/documentation/concepts/actions-and-controllers
   */
  // In config/routes.js, this gets called via 'POST /api/recipes': { action: 'recipe/create' }, because this file is named "create" and this is its function.
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
    /**
     * This next `intercept` call is more custom and verbose. We can add as many properties as we want to be returned in the response.
     * So, if we try to create a Recipe with the same name, this intercept will capture the unique constraint for `name` on our Recipe `input`, 
     * and we'll get a response like this:
     * {
     *     "message": "Invalid request. Duplicate found!",
     *     "error": {
     *         "name": "BBQ Burger"
     *     },
     *     "favoritePokemon": "Greninja"
     *   }
     */
    .intercept('E_UNIQUE', (error) => {
      exits.existingRecipe({
          message: 'Invalid request. Duplicate found!',
          error: error.raw.keyValue
      });
    })
    /**
     * Alternative way to intercept/capture an error, which uses the `exits` function named here, but it will only return the status code provided...
     */
    //.intercept("E_UNIQUE", () => 'existingRecipe')
    /**
     * We can call `fetch` here to return the created object, so we can get useful things like the Id, but everything else, too. 
     * Then we can decide what to put in the response.
     */
    .fetch();

    if (!recipe) {
      throw { error: [] };
    }

    /**
     * Easy way is to return just the object, like this, which places it inside a `recipe` object, since that's the variable we created above:
     * 
     * Which has a response like this:
     *   {
     *   "message": "Recipe created successfully!",
     *   "recipe": {
     *       "id": "Some Recipe Id",
     *       "createdDate": 1616194100324,
     *       "updatedDate": 1616194100324,
     *       "userId": "Some User Id",
     *       "name": "Some Recipe Name",
     *       "category": "Some Category",
     *       "ingredients": [An array of ingredients],
     *       "instructions": [An array of instructions]
     *     }
     *   }
     */
    // return exits.success({
    //   message: "Recipe created successfully!",
    //   recipe
    // });

    /**
     * But, the spec calls for this response schema, where all properties are top-level, but this also lets us customize the response properties:
     *
     * Which should have a response like this:
     *
     * {
     *   "message": "Recipe created successfully!",
     *   "id": "605531e66391c6781c6ff8ab",
     *   "userId": "Some User Id",
     *   "name": "Some Recipe Name",
     *   "category": "Some Category",
     *   "ingredients": [An array of ingredients],
     *   "instructions": [An array of instructions],
     *   "createdDate": "2021-03-19T23:21:10.769Z",
     *   "modifiedDate": null // Null because we only just created this Recipe.
     * }
    */
     return exits.success({
      message: "Recipe created successfully!",
      id: recipe.id,
      userId: recipe.userId,
      name: recipe.name,
      category: recipe.category,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      createdDate: new Date(recipe.createdDate), // We can also respond with a human-readable date, instead of an epoch value.
      modifiedDate: new Date(recipe.modifiedDate)
    });
  }
};
