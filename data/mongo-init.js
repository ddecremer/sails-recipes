// Set the authorization account to be used for the commands in this script
db.auth("sailor", "7.37knots");

// Set the database we want to work on and create it at the same time
sailsRecipes = db.getSiblingDB("sailsRecipes");

//  Create the User Collection with schema and validation
sailsRecipes.createCollection("users", {
    validator: {
        $jsonSchema: {
            required: [
                "firstName",
                "lastName",
                "email",
                "typeOfUser"
            ],
            properties: {
                firstName: {
                    bsonType: "string",
                    description: "User's first name"
                },
                lastName: {
                    bsonType: "string",
                    description: "User's last name"
                },
                email: {
                    bsonType: "string",
                    description: "User's email address"
                },
                typeOfUser: {
                    bsonType: "string",
                    description: "Type of user",
                    enum: [
                        "Chef",
                        "Cook"
                    ]
                },
                createdDate: {
                    bsonType: "date",
                    description: "Date created"
                }
            }
        }
    }
});

// Insert User Records
sailsRecipes.users.insert([
    {
        "firstName": "Paula",
        "lastName": "Deen",
        "email": "pauladeen@sailsrecipes.com",
        "typeOfUser": "Chef",
        "createdDate": new Date()
    },
    {
        "firstName": "Jason",
        "lastName": "Fox",
        "email": "jasonfox@sailsrecipes.com",
        "typeOfUser": "Chef",
        "createdDate": new Date()
    }
]);

//  Create the Recipe Collection with schema and validation
sailsRecipes.createCollection("recipes", {
    validator: {
        $jsonSchema: {
            required: [
                "name",
                "userId",
                "category",
                "ingredients",
                "instructions",
            ],
            properties: {
                name: {
                    bsonType: "string",
                    description: "Recipe name"
                },
                userId: {
                    bsonType: "ObjectId",
                    ref: "users",
                    description: "Chef's ID who submitted the recipe"
                },
                category: {
                    bsonType: "string",
                    description: "Recipe ingredients",
                    enum: [
                        "Breakfast",
                        "Lunch",
                        "Dinner",
                        "Appetizer",
                        "Dessert",
                        "Snack"
                    ]
                },
                ingredients: {
                    bsonType: "array",
                    description: "Recipe ingredients"
                },
                instructions: {
                    bsonType: "array",
                    description: "Recipe instructions"
                },
                createdDate: {
                    bsonType: "date",
                    description: "Date created"
                },
                modifiedDate: {
                    bsonType: "date",
                    description: "Date modified"
                },
                notes: {
                    bsonType: "string",
                    description: "Recipe notes"
                }
            }
        }
    }
});

// Insert Recipe Record
sailsRecipes.recipes.insert([
    {
        "name": "Peach Cobbler",
        "userId": sailsRecipes.users.findOne({ email: "pauladeen@sailsrecipes.com" }, { "_id": true })._id,
        "category": "Dessert",
        "ingredients": [
            "1 ½ cups self rising flour",
            "1 stick butter",
            "½ cup water",
            "2 cups sugar, divided",
            "4 cups peaches, peeled and sliced",
            "1 cup milk",
            "ground cinnamon, optional"
        ],
        "instructions": [
            "1. Preheat oven to 350 °F.",
            "2. Combine the peaches, 1 cup sugar, and water in a saucepan and mix well. Bring to a boil and simmer for 10 minutes. Remove from the heat.",
            "3. Put the butter in a 3-quart baking dish and place in oven to melt.",
            "4. Mix remaining 1 cup sugar, flour, and milk slowly to prevent clumping. Pour mixture over melted butter. Do not stir.",
            "5. Spoon fruit on top, gently pouring in syrup. Sprinkle top with ground cinnamon, if using. Batter will rise to top during baking. Bake for 30 to 45 minutes.",
            "6. To serve, scoop onto a plate and serve with your choice of whipped cream or vanilla ice cream."
        ],
        "createdDate": new Date(),
        "modifiedDate": new Date()
    }
]);

sailsRecipes.createCollection("reviews", {
    validator: {
        $jsonSchema: {
            required: [
                "header",
                "recipeId",
                "userId",
                "rating",
                "feedback",
            ],
            properties: {
                header: {
                    bsonType: "string",
                    description: "Review Heading"
                },
                recipeId: {
                    bsonType: "ObjectId",
                    ref: "recipes",
                    description: "Id of the Recipe the Review is for"
                },
                userId: {
                    bsonType: "ObjectId",
                    ref: "users",
                    description: "Id of the User who submitted the Review"
                },
                rating: {
                    bsonType: "int",
                    minimum: 0,
                    maximum: 5,
                    description: "Rating from 0 to 5 stars with 5 being the best"
                },
                feedback: {
                    bsonType: "string",
                    description: "Review Heading"
                },
                createdDate: {
                    bsonType: "date",
                    description: "Date created"
                }
            }
        }
    }
});

sailsRecipes.reviews.insert([
    {
        "header": "Tastes Like Heaven",
        "recipeId": sailsRecipes.recipes.findOne({ name: "Peach Cobbler" }, { "_id": true })._id,
        "userId": sailsRecipes.users.findOne({ email: "jasonfox@sailsrecipes.com" }, { "_id": true })._id,
        "rating": 5,
        "feedback": "Always great to have a delicious cobbler with a Southern recipe!",
        "createdDate": new Date()
    }
]);
