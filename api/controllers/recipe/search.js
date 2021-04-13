module.exports = {


  friendlyName: 'Search',


  description: 'Search recipe.',


  inputs: {
    searchField: {
      type: 'string',
      required: true,
      regex: /^[a-zA-Z0-9]+$/,
      maxLength: 50
    },
  },


  exits: {
    success: {
      statusCode: 200
    },

    notFound: {
      statusCode: 404
    }
  },


  fn: async function (inputs, exits) {

    let recipeResult = await Recipes.find({
      or: [
        { name: { 'contains': inputs.searchField } },
        { category: { 'contains': inputs.searchField } },
        { ingredients: { 'contains': inputs.searchField } },
      ]
    });

    let userResult = await Users.find({
      or: [
        { firstName: { 'contains': inputs.searchField } },
        { lastName: { 'contains': inputs.searchField } }
      ]
    });

    let response = recipeResult.concat(userResult);

    return exits.success(response);
  }
};
