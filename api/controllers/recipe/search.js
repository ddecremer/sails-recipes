/**
 * Refer to api/controllers/recipe/create.js for more detailed explanations of some of the code being used in this Action.
 */

 module.exports = {

  friendlyName: 'Search',

  description: 'Search recipe.',

  inputs: {

    /**
     * For validating the incoming search value, there are some pretty easy ways to do this.
     * 
     * Requirement: The text is validated to only allow alphanumeric characters. The service receives the search text, and validates the input for invalid characters.
     * Solution: Add the regex property shown below.
     * Sample Request: /api/recipes/search?searchField=sugar!
     * Result: 
     *  {
     *      "code": "E_MISSING_OR_INVALID_PARAMS",
     *      "problems": [
     *          "Invalid \"searchField\":\n  · Value ('sugar!') did not match the configured regular expression (/^[a-zA-Z0-9]+$/)"
     *      ],
     *      "message": "The server could not fulfill this request (`GET /api/recipes/search`) due to 1 missing or invalid parameter.  
     *                  **The following additional tip will not be shown in production**:  Tip: Check your client-side code to make sure that the request data it 
     *                  sends matches the expectations of the corresponding parameters in your server-side route/action.  Also check that your client-side code sends 
     *                  data for every required parameter.  Finally, for programmatically-parseable details about each validation error, `.problems`. (Just remember, 
     *                  any time you inject dynamic data into the HTML, be sure to escape the strings at the point of injection.)"
     *  }
     * 
     * Requirement: The search string should not exceed 50 chars.
     * Solution: Add the maxLength property with an integer value.
     * Sample Request: /api/recipes/search?searchField=sugar12345678901234567890123456789012345678901234567890
     * Result:
     *  {
     *      "code": "E_MISSING_OR_INVALID_PARAMS",
     *      "problems": [
     *          "Invalid \"searchField\":\n  · Value was -5 characters longer than the configured maximum length (50)"
     *      ],
     *      "message": "The server could not fulfill this request (`GET /api/recipes/search`) due to 1 missing or invalid parameter.  
     *                  **The following additional tip will not be shown in production**:  Tip: Check your client-side code to make sure that the request data it 
     *                  sends matches the expectations of the corresponding parameters in your server-side route/action.  Also check that your client-side code 
     *                  sends data for every required parameter.  Finally, for programmatically-parseable details about each validation error, `.problems`. 
     *                  (Just remember, any time you inject dynamic data into the HTML, be sure to escape the strings at the point of injection.)"
     *  }
     */
     searchField: {
      type: 'string',
      required: true,
      regex: /^[a-zA-Z0-9]+$/,
      maxLength: 50
    }
  },

  exits: {
    success: {
      statusCode: 200
    },

    notFound: {
      statusCode: 404
    }
  },

  // In config/routes.js, this gets called via 'GET /api/recipes/search': { action: 'recipe/search' }, because this file is named "all" and this is its function.
  fn: async function (inputs, exits) {

    /**
     * Here we're trying to search specific properties on Recipes and Users for the matching search criteria.
     * 
     * Waterline provides some pretty awesome, straight-forward syntax. In the examples below, we can easily tell it to search
     * on a few different properties within each collection using the `or` array syntax.
     * 
     * Waterline also uses your typical logic checks, such as <, <=, !=, in, contains, startsWith, and others. We could be more explicit and
     * only search on whole values by simply not providing them.
     * 
     * We could also chain methods like `limit`, `skip`, and `sort` after the `find` call.
     * 
     * At the end for the response, we're going to squish all ther results from Recipe and User searching into one array.
     * 
     * See the documentation for various ways of querying data: https://sailsjs.com/documentation/concepts/models-and-orm/query-language
     */

    // Search Recipes -> Category, Name, Ingredients
    let recipeResult = await Recipes.find({
      or: [
        { name: { 'contains': inputs.searchField } },
        { category: { 'contains': inputs.searchField } },
        { ingredients: { 'contains': inputs.searchField } },
      ]
    });

    // Search Users -> First Name, Last Name
    let userResult = await Users.find({
      or: [
        { firstName: { 'contains': inputs.searchField } },
        { lastName: { 'contains': inputs.searchField } }
      ]
    });

    // Put search results into a response object as an array.
    let response = recipeResult.concat(userResult);

    /**
     * We could return a 404...
     */
    // if (!response.length > 0) {
    //   return exits.notFound({
    //     message: `Did not find any search results for ${inputs.searchField}. Note: Search values are case-sensitive, so make sure it's correct.`,
    //   });
    // }

    /**
     * But, the requirements say to return an empty array, so we'll do that.
     */
    return exits.success(response);
  }
};
