**NOTE:** The code in this branch expands on the steps in this walk-through (a.k.a. README). Check out the "BasicDemo-Complete" branch for a trimmed down version that aligns with these steps, doesn't include extra API endpoints, and doesn't have nearly the amount explanatory comments that are contained in this branch.

# Introduction 

This is a Recipe App that uses Sails to perform some basic functions of creating, fetching, and searching Recipes and Users (a.k.a. Cooks and Chefs) through API endpoints.
This walk-through guides you through how to create these API's from the ground up, but you'll be able to download a copy of the app via the instructions below.

It's based on some requirements (listed in the next section) that a group of us got together and hashed out to make it simple, but practical.

This one does not contain a front-end/client app, although Sails does provide that functionality, if you like.





# App Requirements List

Here are the User Stories that were created for this app to be based on. Of course, we didn't cover all of them or everything throughout this walk-through, but I encourage you to try to implement everything you can. I intentionally left some of them with only the short description of the User Story so you can define how you'd like to implement them. Be creative. Explore and find ways to build an app like you think a real world one would be like. If you'd like a front-end layer, see if you can build a client app to interact with the API's, have its own validations, maybe even have a sign-up and login for Users, and display Recipe, Review, and User data in a user-friendly way.

1. As a chef, I want to submit a recipe, so that I can share my recipe with other people and let them know the ingredients and cooking steps.

    - Validations:
        - The title of the recipe is required, and it should not exceed 100 characters.
        - The description of the recipe is optional, and should not exceed 500 characters.
        - The recipe's ingredients should not exceed 15 items, and each should not exceed 50 characters.
        - The recipe's instructions should not exceed 20 items, and each should not exceed 200 characters.
        - The chef that submits the recipe should be registered in the system.
        - The category or type of recipe should be one of the allowed recipes in our system, for example: breakfast, lunch, dinner, snack, - etc.
        - Each ingredient item, should have the name of the ingredient, the amount and the measurement.

1. As a cook, I want to search for recipes that interest me, so I can find recipes by matching the given text.

    - Validations:
        - The search string should be alphanumeric.
        - The search string should not exceed 50 chars.

1. As a cook, I want to see the details for a single recipe, so that I can look at its reviews and look at its ingredients and instructions.

1. As a cook, I want to provide a rating and feedback to a recipe, so that I can tell the chef and the online community how much I liked the recipe.

1. As an unregistered user, I want to register as a chef, so that I can start sharing my recipes with other people.






# Installations and Setup

1. Download and install the latest stable version of [Node](https://nodejs.org/en/download/)

    **NOTE:** You can use the CLI (a.k.a. Terminal) in Visual Studio Code (a.k.a. VS Code) like I will in most of the steps in this walk-through, or you can open a command prompt or PowerShell window and run many of the same commands from there. I'll try to highlight where it might matter where you run things from. Just make sure to be in the correct folder when executing some of the commands. I will refer to any of these simply as the CLI. :) And, when I say "Execute `some command`", it's from the CLI, as well. :)

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop) and leave it running in Linux mode. (Windows mode might work, but I did not test it with that.)

    - Optionally, if you're familiar enough with MongDB and running it on its own outside of Docker, you'll just need to make sure this app is set up to connect to it that way.

1. Install [Visual Studio Code](https://code.visualstudio.com/). (You could use Visual Studio or something else, but this walk-through uses VS Code.)

1. Install [Postman](https://www.postman.com/downloads/). If you're unfamiliar with this app, refer to its documentation for help setting up Requests.

1. Optionally, you could install these helpful items:

    - [MongoDB Compass](https://www.mongodb.com/products/compass) (for creating, viewing, modifying, and deleting data, if you like, but it won't be necessary).

    - The [MongoDB extension](https://code.visualstudio.com/docs/azure/mongodb) for Visual Studio Code (for viewing and modifying data).

        - Alternatively, you could communicate with MongoDB via a bash console, which will be explained later.





# Develop the Recipe App

## Set Up and Initialize 

1. Open a Command Prompt or PowerShell.

1. Navigate to the folder where you want to store your source files.

1. Execute `md RecipeApi`

1. Execute `cd RecipeApi`

1. To install Sails, execute `npm install sails -g` for a global machine installation or `npm install sails --save-dev` for a local installation to the current folder.

1. Execute `sails generate new recipe-api --no-front-end`and enter `2` when prompted with this:

  ```
  Choose a template for your new Sails app:
  1. Web App  ·  Extensible project with auth, login, & password recovery
  2. Empty    ·  An empty Sails app, yours to configure
  ```
    
Alternatively, you could create a Sails app (with front-end components): `sails new recipe-api`, which you'll get a similar prompt, where you could decide to get an entire boiler-plate web app or not. Both have Views in them bulit into them. We won't be using Views in this walk-through, but even if you go this route and select option 2 on that one, everything here works the same.

  **NOTE:** If you create another folder outside of the one for this project and run this same command, but select 1, then you can reference it and compare how a full sample web app is built out, but that could be more confusing than it's worth right now. Also, don't select 1 and then use that for following the steps in this walk-through. That'd just *really* confuse you. :)

1. Execute `cd recipe-api`

1. Execute `code .` to launch VS Code

1. In VS Code, open a terminal from the menu Terminal -> New Terminal or via keyboard short-cut with
    
    ````
    ctrl + `
    ````
    
1. Take a look at the app structure. We'll be spending most of our time in the `api` and `config` folders.

1. To see what the Sails app looks like out-of-the-box right now, execute `sails lift` in the terminal and you should see the following:

    ```
    info: Starting app...

    <some blah blah blah information here>

    debug:
    info:
    info:                .-..-.
    info:
    info:    Sails              <|    .-..-.
    info:    v1.4.0              |\
    info:                       /|.\
    info:                      / || \
    info:                    ,'  |'  \
    info:                 .-'.-==|/_--'
    info:                 `--'-------'
    info:    __---___--___---___--___---___--___
    info:  ____---___--___---___--___---___--___-__
    info:
    info: Server lifted in `<wherever your app folder is>`
    info: To shut down Sails, press <CTRL> + C at any time.
    info: Read more at https://sailsjs.com/support.

    <more blah blah blah information>

    debug: Environment : development
    debug: Port        : 1337
    debug: -------------------------------------------------------
    ```

1. By default, it runs on port 1337, as you can see in the output, so navigate to `http://localhost:1337` and...you really shouldn't see anything other than a "Not Found" message on the screen. If so, perfect! The app is running, but we don't have any endpoints yet. :)

1. Enter `ctrl+c` to stop running the app




## Modify Lint File

Sails created an `.eslintrc` file, so it'll start yelling at you if it doesn't like some things, like line-breaks, curlys, and indent spaces. So you *could* go in and change a couple of them, but we're going to leave the defaults, especially line-breaks as unix and quotes and single.

1. Find the line with `curly` on it and change the value `ignore`. This rule enforces putting curly braces after things like `if` statements. For concise code, there are some places where we have things like...

    ```
    if (someCondition)
        return someResponse;
    ```
    
1. Find the line with `indent` on it and change the value from `2` to `4`. This will really only matter if you paste in code from this walk-through, which uses 4 spaces of indentation. If you are typing it all out and like 2 spaces better, you can leave this.

1. When we create our `mongo-init.js` file in a minute, the ESLint file (`.eslintrc`) would start yelling at you about strings needing single quotes, because our JSON uses double. To make it ignore this file, open `.eslintignore` add add `data/mongo-init.js` to it. Then save it.

- If you want to take a look at where you could change some other things, if you want...

    1. In the root folder, open `.eslintrc`

    1. Find the line with `"linebreak-style"` on it (probably line 58) and change it from `unix` to `windows` like this:  `["error", "windows"]`

    1. Here is where you could also change the quote style you like to single or double where it simply says `"quotes"` You'll notice that this file is already using double-quotes, but everywhere else pretty much uses single. ¯\\_(ツ)_/¯

        **NOTE:** We'll be using single quotes, except within JSON, because the [spec](https://tools.ietf.org/html/rfc7159) says so. :)




## Set up the Database

For the purposes of this walk-through, we're going to create our data script within it. Normally, of course, it would be outside of a project like this.

1. Create a `data` folder.

1. In that folder, create a file `mongo-init.js`

1. Let's set up the database authorization by adding the following lines:

    ```
    // Set the authorization account to be used for the commands in this script
    db.auth("sailor", "7.37knots");

    // Set the database we want to work on and create it at the same time
    sailsRecipes = db.getSiblingDB("sailsRecipes");
    ```

1. Create the User Collection schema by adding the following lines:

    ```
    sailsRecipes.createCollection('users', {
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
    ```

    Note the use of `enum` in the `typeOfUser` section, which will help enforce valid values inserted into it.

1. Add completely fake User data to that collection by adding these lines (but you can add more, if you want to create your own):

    ```
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
    ```

1. Create the Recipe Collection schema by adding the following lines:

    ```
    sailsRecipes.createCollection('recipes', {
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
                        description: "Chef's Id who submitted the recipe"
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
    ```

    Note the use of `ref` for the `userId`, which will cause it to work much like a foreign-key relationship does in regular SQL.

1. Insert a simple recipe:

    ```
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
    ```

    Note the `userId` needs to have an existing, valid User, so here we're going to reference the one we just created using a built-in `findOne` function.

1. Our final collection is for Reviews, so let's create the schema for that.

    ```
    sailsRecipes.createCollection('reviews', {
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
    ```

    Again note the use of `ref` to refer back to the `users`, and `recipes` collections.

1. And, finally, add a Review.

    ```
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
    ```

1. Save the file.





## Set up MongoDB in Docker

1. Make sure Docker is running.

1. In the `data` folder in our app, create a file named `Dockerfile` Note the exact casing (which will matter when we get to writing the `docker-compose.yaml` file) and also that it has no extension.

1. In that file, add the following lines and save it:

    ```
    FROM mongo:4.4.3

    # Set the root user and password
    ENV MONGO_INITDB_ROOT_USERNAME sailor
    ENV MONGO_INITDB_ROOT_PASSWORD 7.37knots

    # Set the default database that will be used when Mongo intializes
    ENV MONGO_INITDB_DATABASE admin

    # Copy the mongo-init file that contains the scripts that we want to execute on initialization
    # Mongo by default looks for scripts in docker-entrypoint-initdb.d when the container initializes
    ADD mongo-init.js /docker-entrypoint-initdb.d/
    ```

1. In the VS Code Terminal, navigate/change directory to the `data` folder you created.

1. Build the mongo database from the docker file by executing `docker build -t sails-mongo .`

1. You should see an output like this:

    ```
    Sending build context to Docker daemon  9.216kB
    Step 1/5 : FROM mongo:4.4.3
    ---> ca8e14b1fda6
    Step 2/5 : ENV MONGO_INITDB_ROOT_USERNAME sailor
    ---> Using cache
    ---> 232e93a36964
    Step 3/5 : ENV MONGO_INITDB_ROOT_PASSWORD 7.37knots
    ---> Using cache
    ---> d7dafb49fee3
    Step 4/5 : ENV MONGO_INITDB_DATABASE admin
    ---> Using cache
    ---> 70d5ce860527
    Step 5/5 : ADD mongo-init.js /docker-entrypoint-initdb.d/
    ---> d2f43b9efb2e
    Successfully built d2f43b9efb2e
    Successfully tagged sails-mongo:latest
    SECURITY WARNING: You are building a Docker image from Windows against a non-Windows Docker host. All files and directories added to build context will have '-rwxr-xr-x' permissions. It is recommended to double check and reset permissions for sensitive files and directories.
    ```

1. Run the mongo database image by executing `docker run -p 27018:27017 --name 'sails-mongo' sails-mongo`

    **NOTE:** Docker is mostly out-of-scope for this walk-through, but breaking down this command a little...

    - `-p` tells it which port to forward to the world outside of Docker from the port inside. In this case, the external port will be 27018 from the internal port 27017.

    - `--name` gives our Docker Container a name to refer to.

    - The last part tells the run command which Container you actually want to run (right after we just gave it a name).

    **NOTE:** Remember, if you prefer, you can open the Command Palette up again with `ctrl + shift + p`, start typing "mongodb", then make sure to select "Launch MongoDB Shell..." to connect to the database for this app. If you select "Launch Shell...", it will connect to Mongo's own local instance at port 27017, which isn't where our database is at. This is one reason we set up port 27018, so we could make sure to not confuse the two.

    **NOTE:** You can also run a `bash` command to work with the MongoDB datastore that way using `docker exec -it sails-mongo bash`, then `mongo mongodb://sailor:7.37knots@localhost:27017`

    **NOTE:** But wait! If you noticed that the `docker` command port-forwarded to 27018 externally from 27017 internally, why do we bash into 27017? Answer: ¯\\_(ツ)_/¯

1. You should see a bunch of output and that it successfully created and is running the Container.

    If you see a command prompt again, then there was an error. Look just above the command prompt and see where it failed. Execute `docker container rm sails-mongo` to remove the Container. Try to fix the error(s), especially looking at your `mongo-init.js` JSON to ensure that any Recipes are referencing existing Users and Reviews are referencing existing Users and Recipes. Repeat the `build` and `run` commands again.

1. Open Docker and confirm that the `sails-mongo` Container is up and running in the green at port 27018.

1. If you installed Compass earlier... 

    1. Launch it and use a connection string of `mongodb://sailor:7.37knots@localhost:27018/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false`

    **NOTE:** You may now notice that this connection string uses port 27018. That makes sense, since that's the port we forwarded from MongoDB's own 27017 port inside Docker to the outside world (well, on our own machine, at least).

    **NOTE:** If you ever need to just start up your MongoDB Docker container, execute: `docker start sails-mongo`

    1. Expand the `sailsRecipes` database and inspect the data for each collection, which should have all the records you added earlier.

    1. Explore the collections, different ways of viewing data, and ways to edit documents.

1. If you installed the VS Code extension for MongoDB earlier...

    1. Do ONE of the following:

        - Press `ctrl + shift + p` to open the Command Palette, start typing "mongodb", then select "MongoDB: Connect with Connection String..."

        - If there are no existing connections, click the Add Connection button, then click Connect in the box with "Connect with Connection String"

        - Click the `+` next to "CONNECTIONS", then click Connect in the box with "Connect with Connection String"

        - Click the `...` next to "CONNECTIONS", then "Add MongoDB Connection with Connection String"

    1. Enter `mongodb://sailor:7.37knots@localhost:27018/?authSource=admin`

    1. Expand the nodes and explore the data a bit. You can even open documents, edit, and save them.




## Install MongoDB In Our Sails App

1. Execute `npm install sails-mongo --save`

1. Set up the database connection

    1. In your `config/datastores.js` file, edit the default datastore configuration:

        ```
        default: {
            adapter: 'sails-mongo',
            url: 'mongodb://sailor:7.37knots@localhost:27018/sailsRecipes',
            authSource: 'admin',
        }
        ```

        **NOTE:** This is setting it up so we can run our app and debug it locally (i.e. from VS Code). Later we'll set it up to deploy to and run from within Docker. It'll look mostly the same, but the `url` will change just a tad.

    1. In your `config/models.js` file, scroll down to the `attributes` section and edit the default id attribute to have the appropriate `type` and `columnName` for MongoDB's primary keys, as well as replace the date ones:

        ```
        attributes: {
            id: { type: 'string', columnName: '_id' },
            createdDate: { type: 'number', autoCreatedAt: true, },
            modifiedDate: { type: 'number', autoUpdatedAt: true, },
        }
        ```

        **NOTE:** We didn't *need* to change the date ones, but we did to align with the requirements and specs written for this Recipe app. You can totally keep them what they were if you're not working with other node frameworks or the client app as part of this Bootcamp.




## Create A User Data Model

1. Be sure you are in the root directory for the project and execute `sails generate model users`

    **NOTE:** The model name needs to match the name of the collection it maps to in the database! That way when we run queries against it, it'll associate directly with it. Maybe this can be configured to map from one name to another, but I didn't dig in to see if it could.

    **NOTE:** Whenever you execute commands like the following `sails generate...`, *ALWAYS* make sure to be in the project's root folder. Otherwise, it'll assume that you are and will create folders and files relative to where you are.

1. Confirm that there is now a file at `api/models/Users.js`

1. Add the following model attributes for User within the `attributes` object like this (probably also deleting a bunch of commented code that was generated):

    ```
    module.exports = {
        attributes: {
            firstName: { type: 'string', required: true },
            lastName: { type: 'string', required: true },
            email: { type: 'string', required: true, unique: true, isEmail: true },
            typeOfUser: { type: 'string', required: true, isIn: ['Chef', 'Cook' ] },
        }
    };
    ```

    **NOTE:** The `isEmail` property uses built-in validation to only allow emails. See the Helpful Links at the end of this document for more information about other built-in items like this. 

    **NOTE:** The `isIn` array is also built-in and will help validate that only these values are allowed to be entered into the database, a bit like the schema has that we created earlier.

1. Execute `sails lift`

    **NOTE:** We'll use a VS Code launch configuration going forward as a way to debug, but either way lets you see output in the debug console.

    **NOTE:** Did you get a prompt like the following? You should have, so press `1` and `Enter` for now. We'll follow its instructions in a minute.

    ```
    Tired of seeing this prompt?  Edit config/models.js.

    In a production environment (NODE_ENV=production) Sails always uses
    migrate:'safe' to protect against inadvertent deletion of your data.
    But during development, you have a few different options:

    1. FOR DEV:      alter   wipe/drop and try to re-insert ALL my data (recommended)
    2. FOR TESTS:    drop    wipe/drop ALL my data every time I lift Sails
    3. FOR STAGING:  safe    don't auto-migrate my data. I will do it myself

    Read more: sailsjs.com/docs/concepts/models-and-orm/model-settings#?migrate
    --------------------------------------------------------------------------------

    What would you like Sails to do this time?
    ** NEVER CHOOSE "alter" or "drop" IF YOU ARE WORKING WITH PRODUCTION DATA **
    ```

1. Navigate to `http://localhost:1337/users` in a browser. What do you expect to see?

1. Observe a displayed array of `user` objects returned. Did you expect that? This used Sails' Blueprints to get the data without there being anything but a model object. No `controller` is involved, yet (we'll build that next).

1. Create a new `User` record by setting the URL to `http://localhost:1337/users/create?firstName=George&lastName=Foreman&email=georgeforeman@sailsrecipes.com&typeOfUser=Chef`

1. Observe the returned object in the browser window showing the record just created. Did you expect that too? Again, this is Blueprints.

1. Navigate to `http://localhost:1337/users` again and verify that the new record is listed.

1. Stop running the app with `ctrl+c`

1. Go to `config/models.js` and uncomment the line with `migrate: 'alter'` on it (should be around line 56), then save the file.




## Set Up Launch Configuration In VS Code

1. Click the debug tab in VS Code (triangle with a bug on it).

1. Click the link "create a launch.json file".

1. Select "Node.js" from the dropdown that appears at the top middle of VS Code.

    **NOTE:** Now you can just hit F5 to run and debug the app from VS Code. Without a `launch.json` file, you'd need to select "Node.js" each time.




## Create A Controller For Users

1. Execute: `sails generate controller user`

1. Verify you have a file called `UserController` at `api/controllers/UserController.js`

1. Add the following code to `UserController` within the braces in `module.exports = { }` We'll use this function to find a User.:

    ```
    getUsers: async (req, res) => {

        let response = await Users.find();

        if (!response)
            return res.badRequest("Error getting users!")

        return res.ok(response);
    },
    ```
    **NOTE:** If you are typing this out in an IDE like VS Code, when you hit the `.` after `Users`, don't let it try to be "helpful" when it might add `const Users = require('../models/Users');` near the top of the file. If it's left in there when you go to run the application, it will display an error that `.find()` is not a function, for example. If it does add that line, simply delete it.



## Disable Blueprints

Okay, we've seen how Blueprints work, but we're not going to use them anymore. You certainly can ignore these steps and play with Blueprints some more, but we're going to make sure they don't get in the way to give us false-positives when calling our API's. i.e. When we go to call and API endpoint that we *think* is one we've coded for, but accidently hit a Blueprint API, instead.

1. Open the Blueprints file at `config/blueprints.js` and set each property as follows, then save the file:

    ```
    actions: false,
    rest: false,
    shortcuts: false,
    ```

1. Run the app again and verify that `http://localhost:1337/users` returns "Not Found" now.




## Set Up A User Route

1. In `config\routes.js`, add the following code within the braces for `module.exports.routes = { }`

    ```
    'GET /api/users': { controller: 'UserController', action: 'getUsers' },
    ```

    **NOTE:** When Sails generates files, it likes to put trailing commas everywhere. This is meant to be helpful when more items get added below such lines, but some of us might naturally cringe at it. :)

    **NOTE:** The following 3 routes are all equivalent to the one above and therefore function the same. It's a matter of preference for conciseness or more verbosity.

    ```
    // 'GET /api/users': 'user.getUsers',
    // 'GET /api/users': 'UserController.getUsers',
    // 'GET /api/users': { controller: 'user', action: 'getUsers' },
    ```

1. Hit F5 to run the app.

1. Navigate to `http://localhost:1337/api/users`

1. Observe the same output as before we created the `Controller`, which should have an array of all the Users displayed.

1. Stop running/debugging the app.




## Add API Endpoints In The UserController

1. Add the following code to `UserController` inside the braces for `module.exports = { }` so we can get specific types of Users.

    ```
    getUsersByType: async (req, res) => {

        let response = await Users.find({
            where: { typeOfUser: req.params.type },
            select: ['firstName', 'lastName', 'email', 'typeOfUser']
        });

        if (!response)
            return res.badRequest(`User not found`);

        return res.ok(response);
    },
    ```

    **NOTE:** Sails uses [Waterline Query Syntax](https://sailsjs.com/documentation/reference/waterline-orm/queries) and it is **case-sensitive**, by default. This _can_ be overridden, but I didn't end up messing with that. So, the `mongo-init.js` file has collections set up in lower-case, since I found that sails likes to refer to them that way, again by default, despite the model class being upper-case. ¯\\_(ツ)_/¯ If I had created, for example, the `Users` collection, instead of the `users` collection, it would not find any results with that code in the `UserController`

1. Again in `config/routes.js`, add the following line of code beneath the one you just added.

    ```
    'GET /api/users/type/:type': { controller: 'UserController', action: 'getUsersByType' },
    ```

    **NOTE:** Intentionally, this won't work at this point, but we'll see why in a moment.

    **NOTE:** If you didn't create any other "Chefs" or "Cooks" earlier, you may want to do that now so that you have more results to work with.

1. From here on out, we're going to switch to using Postman for all our API requests, so go ahead and launch that.

1. Run the app and create a request in Postman for `http://localhost:1337/api/user/type/Chef`, which should give you the following output:

    ```
    {
        "cause": {
            "name": "UsageError",
            "code": "E_INVALID_CRITERIA",
            "details": "The provided criteria contains a custom `select` clause, but since this model (`users`) is `schema: false`, this cannot be relied upon... yet.  In the mean time, if you'd like to use a custom `select`, configure this model to `schema: true`. Or, better yet, since this is usually an app-wide setting,configure all of your models to have `schema: true` -- e.g. in `config/models.js`.  (Note that this WILL be supported in a future, minor version release of Sails/Waterline.  Want to lend a hand?  http://sailsjs.com/contribute)"
        },
        "isOperational": true,
        "code": "E_INVALID_CRITERIA",
        "details": "The provided criteria contains a custom `select` clause, but since this model (`users`) is `schema: false`, this cannot be relied upon... yet.  In the mean time, if you'd like to use a custom `select`, configure this model to `schema: true`. Or, better yet, since this is usually an app-wide setting,configure all of your models to have `schema: true` -- e.g. in `config/models.js`.  (Note that this WILL be supported in a future, minor version release of Sails/Waterline.  Want to lend a hand?  http://sailsjs.com/contribute)"
    }
    ```

    **NOTE:** The error you should see here pretty much explains _what_ is wrong and _how_ to fix it, and even exactly _where_ to fix it. Let's do that next.

1. Stop running the app and go into `config/models.js`

1. Uncomment the line with `schema: true,` on it, around line 38 if it has a bunch of boiler-plate comments in there.

1. Run the app again and submit that same request in Postman one more time, where you should see results this time showing all the "Chef" Users returned in the response.

    **NOTE:** If you make the call from some browsers, then it *may* change "Chef" to all lowercase. To get around that, add a trailing slash at the end. In Postman, this is not required, since it maintains the casing.

1. Let's create one more endpoint to get Users by Id, so we can introduce a few advanced features.




## Get Users By Id

1. Add another function to the `UserController` like this, which should start to look like some familiar code now:

    ```
    getUserById: async (req, res) => {

        let response = await Users.find({
            where: { id: req.params.id },
            select: ["firstName", "lastName", "email", "typeOfUser"]
        })

        if (!response)
            return res.badRequest(`User not found`);

        return res.ok(response);
    },
    ```

1. In `config/routes/js`, try not to look ahead, but see if you can add a line for this endpoint.

    ```
    'GET /api/users/id/:id': { controller: 'UserController', action: 'getUserById'},
    ```

1. Go into the MongoDB extension in VS Code here or into Compass and copy the Id of one of the Users.

1. In Postman, create a GET request like `http://localhost:1337/api/users/id/6071b1254bda4521d523efae`, where the last value is one of your own Id's that you just copied.

1. Submit the request and you should see a response with the User's information.

    **NOTE:** In a little, after we set up Recipes and Reviews, we'll come back to this and return data from those collections when we request a User.

1. Explore some more on your own with the `UserController` to try to return different data in the Waterline queries. Perhaps try working out how to create a User with a POST request...with a little help like this:

    ```
    post_user: async (req, res) => {

        if (!req && !req.body)
            return res.badRequest();
                
        /**
         * Here we're going to use `create(...)`, which is one of many built-in "Model methods" for node.js that Sails also uses.
         * 
         * See the documentation for other methods you can use: https://sailsjs.com/documentation/reference/waterline-orm/models
         */
        let user = await Users.create(req.body).fetch();

        return res.status(201).json(user);
    },
    ```

    **NOTE:** Don't forget that you can always put breakpoints in VS Code and inspect objects as you step through the code.





## Create An Action For Recipes

1. Let's first create a `Model` for `Recipes` with `sails generate model recipes`

1. Add the attributes for `Recipes` like we did for `Users`:

    ```
    attributes: { 
        userId: { type: 'string', required: true },
        name: { type: 'string', required: true, unique },
        category: { type: 'string', required: true, isIn: ['Breakfast', 'Lunch', 'Dinner', 'Appetizer', 'Dessert', 'Snack' ] },
        ingredients: { type: 'JSON', required: true },        
        instructions: { type: 'JSON', required: true },
    }
    ```

1. Now let's create an Action for `Recipe` with `sails generate action recipe/create`

    **NOTE:** This time we are providing the folder `recipe` that we want to put the action `create` into.

1. Notice in the `api/controllers` folder there is now a folder named `recipe` with a file named `create.js` in it. This `Action` file is equivalent to a function within a `Controller`, but is a stand-alone action (a.k.a. an API endpoint, in this case, once we add it to `routes.js`). The `recipe` folder is equivalent to embedding the `Action` (or function) within a `Controller`?

    - The [documentation](https://sailsjs.com/documentation/concepts/actions-and-controllers) puts it this way:

        - Using standalone actions has several advantages over controller files:

            - It's easier to see a clear overview of the actions in your app, because you can reference your project's file structure instead of scanning through individual controller files
            
            - Each action file is smaller and easy to maintain, whereas controller files tend to grow as your app grows

            - Routing to standalone actions in nested subfolders is more intuitive than routing to actions in controller files (foo/bar/baz.js vs. foo/BarController.baz)

            - Blueprint index routes apply to top-level standalone actions, so you can create an api/controllers/index.js file and have it automatically bound to your app’s / route (as opposed to creating an arbitrary controller file to hold the root action)

    **NOTE:** Instead of using the typical `res` and `req` like the `UserController` did as a typical `node.js` way of doing things, `Actions` in Sails use `inputs` and `exits`, as you can see in that file.

1. The `create.js` file will look like this (after cinching it up a little):

    ```
    module.exports = {
        friendlyName: 'Create',
        description: 'Create recipe.',
        inputs: { },
        exits: { },
        fn: async function (inputs) {
            // All done.
            return;
        }
    };
    ```

1. Add some properties to the `inputs` section:
    ```
    inputs: {
        userId: { type: 'string' },
        name: { type: 'string' },
        category: { type: 'string' },
        ingredients: { type: 'JSON' },
        instructions: { type: 'JSON' },
    },
    ```

    **NOTE:** Notice how what we have here is very similar to what the `model` has. We're going to compare the two soon. For now, just know that the `model` is basically your full entity representation and the `inputs` here are 
                merely what you allow to be passed into the API endpoint, like the way a `ViewModel` in ASP.NET acts. We're going to expand on the `inputs` secion more in a bit. Also, client apps can pass in anything else that they want, but if they aren't in the `inputs` section here, they'll be ignored.

1. Go into `config/routes.js` again and add a route.

    ```
    'POST /api/recipes': { action: 'recipe/create' },
    ```

1. Go back to the `create.js` file and add this within the `exits` section:

    ```
    success: {
      statusCode: 201,
      description: "Some description for devs."
    },
    ```

1. Add the code to create the `Recipe` in the `function`:

    ```
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
        .fetch();

        return exits.success({
            message: 'Recipe created successfully!',
            recipeId: recipe.id
        });
    }
    ```

    **NOTE 1:** It's out-of-scope right now, but we could grab the currently logged in User's Id, instead of passing it in here.

    **NOTE 2:** The `.fetch()` call will return the created object. In the `success` response, we could return the entire Recipe (unnecessarily) or just return the Id, like we are here, then the client-side could provide a URL to it, for example.

1. Run the app.

1. Launch Postman and create a new Request

    **NOTE:** You may need to set up a Collection in Postman, if you haven't already.

1. Let's see what we get with the following overly simplified recipe:

    1. Set the HTTP method to `POST` in Postman.

    1. Set the URL to `http://localhost:1337/api/recipes`

    1. Set the `Body` to "raw" and "JSON", then enter the following:

        ```
        {
            'userId': '<one of your User Id's>',
            'name': 'BBQ Hamburger',
            'category': 'Dinner',
            'ingredients': [
                '1 lb. raw hamburger'
            ],
            'instructions': [
                '1. Form hamburger patties into 4-5 inch round patties.',
                '2. Place patties onto the grill. Cook for 8-10 minutes.',
                '3. Enjoy savory goodness!'
            ]
        }
        ```

        **NOTE:** You'll need to look at your data and find one of your Users and put the Id into the request body above, preferably the same User that we also gave a Review to, which will come in handy later on in this walk-through. Again, with a client app, we'd likely have that Id based on whomever is logged in or some other way we did a lookup to get it.

    1. Send the Request and you should see a response like this:

        ```
        {
            'message': 'Recipe created successfully!',
            'recipeId': '<whatever Id it generated>'
        }
        ```




## Validate Incoming Recipe Data - Unique Name

1. Given that we now have one record of the "BBQ Hamburger" recipe in MongoDB, if we kept sending that same request, we'd keep getting a new record each time. We don't want duplication like that!

    - If you did do that, delete all but one document for "BBQ Hamburger" in one of the following ways:
    
        - [Delete the duplicates via MongoDB Compass](https://docs.mongodb.com/compass/master/documents/delete/), which is one of the easiest ways.

        - Delete one record at a time in VS Code via the Command Palette's "MongoDB: Launch MongoDB Shell..." command and then in the console/terminal by executing...

            1. `use sailsRecipes`

                - Then do one of the following...
        
                    - `db.recipes.deleteOne({name: "BBQ Hamburger"})` for each document, but remember to leave one.

                    - `db.recipes.deleteMany({name: "BBQ Hamburger"})`, but then you'll need to go submit a request to create one document again.

1. You should now only have one "BBQ Hamburger" recipe in MongoDB (if you deleted all but one of them a minute ago). We're now going to disallow duplicate names by changing the `name` attribute in the `inputs` section, like this:

    ```
    name: { type: 'string', required: true, unique: true }, // Even if you set `unique: true` here, it won't enforce it unless it's also on the model, itself.
    ```

    **NOTE:** As my comment there indicates, we also need to go set `unique: true` on the model.

1. Go to the Recipes model and update the attribute for `name`, like we just did here in the `create` Action.

    **NOTE:** Intentionally leaving out the code for that here, since this should be pretty easy to work out where to do that and what to put. :)

1. Run the app, send the POST request, and you should get this for a response:

    ```
    {
        'code': 'E_UNIQUE',
        'message': 'Would violate uniqueness constraint-- a record already exists with conflicting value(s).',
        'modelIdentity': 'recipes',
        'attrNames': []
    }
    ```

1. This is good to have navigable properties and decent data (because we set validation rules within the `action` *and* the `model`), but let's see how we can get some more useful information out of it.

    **TRY IT OUT:** Remove the `unique: true` from the `inputs` section, but leave it on the Recipes model. What does the output look like? Not pretty, huh? Just make sure to set them both back as we go forward.

1. In the `exits` section of the `create` Action here, add the following code:

    ```
    existingRecipe: {
        statusCode: 418,
        description: 'An existing Recipe was already found!' // Note: This will not go in the response.
    }
    ```

    Why 418? First, it's a fun HTTP response. :) But really, we're going to prove that it's using that exact `HTTP Response Code`, and not just a typical `400` here in a minute.

    **NOTE:** We didn't really cover it a few minutes ago, but if you didn't have the `exit` we have in there already to return a `201`, the `return exits.success(...)` call in `fn` would have still worked, but would return a `200`.

1. In the `fn` section/`function`, add the `intercept` call as a chained call after the `create` call and before the `.fetch()` call, like this:

    ```
    let recipe = await Recipes.create({
        userId: user.id,
        name: inputs.name,
        category: inputs.category,
        ingredients: inputs.ingredients,
        instructions: inputs.instructions
    })
    .intercept('E_UNIQUE', () => 'existingRecipe')
    .fetch();
    ```

    Remember a minute ago how we got a `code` value that was "E_UNIQUE", because of the `name` attribute we put the `unique` on? The `intercept` here will capture that. Why an "intercept"? Because Sails has built-in error capturing that we saw a minute ago, but now we can "intercept" that and handle it on our own in this case.

    **SIDE NOTE:** This is short-hand for other ways of writing it, which you can read about [here](https://sailsjs.com/documentation/reference/waterline-orm/queries/intercept).

1. Run (or restart) the app and send the request in Postman again. You should get this:

    ```
    I'm a teapot
    ```

    Well, we *did* get our `418 I'm a Teapot` response (now we know for sure that it wasn't just going to throw a `400 Bad Request` and confirm that it's using our `exit`), but notice how it didn't spit out the `description` value? I can't really tell you right now why it doesn't send that to the response output. It sure would be helpful to toss some good information in there so that it's better to use this slick short-hand way of intercepting errors. Maybe you can, and I just didn't find that way.

    Anyway, this isn't very informative at all! :/ So, let's change that.

1. Change the `intercept` call to this: 

    ```
    .intercept('E_UNIQUE', (error) => {
        exits.existingRecipe({
            message: 'Invalid request. Duplicate found!',
            error: error.raw.keyValue
        });
    })
    ```

    Okay, so what's going on here? 

    - First, we're still telling it to "intercept" when the app wants to throw an error that has a `code` of "E_UNIQUE".

    - Second, we're telling it to use the `existingRecipe` property in the `exits` section.

    - Third, we're digging into the `error` and extracting some specific data. 

    **SIDE NOTE:** To find out where to get the data, I put a breakpoint within the `intercept` in VS Code so I could poke around at the `error` object. In there, I found a node for `raw`, which had `keyValue` in it. Go ahead and do the same exploration on your own and return whatever data you like. Experiment with it.

    Also notice here that we still declare the response code in the `exits` section where we have the `existingRecipe` defined, but our response is using the information from within our `intercept` call. I'd like it if we could just have out function call and use the `exits` object, and maybe there is such a way, but I have yet to find or understand that better. :)

1. With the updated `intercept` call in there, let's run the app again. We should get this:

    ```
    {
        'message': 'Invalid request. Duplicate found!',
        'error': {
            'name': 'BBQ Hamburger'
        }
    }
    ```

    Well, hey! This is more helpful!

    **NOTE:** You might be thinking that an `exit` for `existingRecipe` might be a little too specific. I mean, what if we put the `unique` on another attribute, as well? Fair enough. What can we do? Well, we could rename it to be `existingValue` That would be ambiguous enough. We could also put some checks in place inside the `intercept` here, create properties in `exits` for each one, and call the appropriate one. Up to you. Play around with different things and what you're style is.





## Validate Incoming Recipe Data - Valid Category

Remember when we set up the database and it had a specific list of Category values? Our app isn't aware of that, so it's not going to validate such a constraint. But let's run a little test first.

1. Make sure the app is running and let's now try to send the same request again, but first... 

    - Change the name of the Recipe so we're not trying to create a duplicate "BBQ Hamburger" anymore (or create a whole new Recipe).

    - Change the `category` from "Dinner" to anything *not* in the white-listed values, such as "Brunch".

1. Submit the request.

1. You should see a `201` that it was created. Wait! What?! But the database has a constraint on Category, and "Brunch" is not on the list. Well, I don't really understand MongoDB well enough to know why it didn't reject it or why we set up that JSON schema in the first place, so there's something there that I need to learn.

1. Keep the category as "Brunch", or whatever you set it to, and add some validations on *only* the Recipes model, like this:

    ```
    category: { type: 'string', required: true, isIn: ['Breakfast', 'Lunch', 'Dinner', 'Appetizer', 'Dessert', 'Snack'] },
    ```

1. You should see an error like this, along with a StackTrace after it:

    ```
    UsageError: Invalid new record.
    Details:
    Could not use specified `category`. Violated one or more validation rules:
    • Value ('Brunch') was not in the configured whitelist (Breakfast, Lunch, Dinner, Appetizer, Dessert, Snack)


    at Object.fn (c:\Source\NodeJS\RecipeApi\recipe-api\api\controllers\recipe\create.js:39:32)
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
    ```

1. That's helpful, but if we wanted to parse this data and display it in the client app, we could use some friendlier data! We see that it correctly used the validation rules defined in the `model` itself, but let's see what we get when
    we add the same rules to the `inputs` section in our `create` function the same way we did the model.

    **NOTE:** You may have noticed that it seems a little (read: incredibly) redundant to have this same validation rule here as in the `Recipes.js` model. Although you *can* trim it down quite a bit like it was *without* it, I could not find a reason why the `action` doesn't just use the model to produce a clean output response, like we'll see soon, instead of the one above. I guess it's just how the built-in error handling for `actions` works. ¯\\_(ツ)_/¯

1. If the app is still running, restart it and make the same `POST` request as before with "Brunch" in it.

1. What does the response look like now? It should be...

    ```
    {
        'code': 'E_MISSING_OR_INVALID_PARAMS',
        'problems': [
            'Invalid \'category\':\n  · Value ('Brunch') was not in the configured whitelist (Breakfast, Lunch, Dinner, Appetizer, Dessert, Snack)'
        ],
        'message': 'The server could not fulfill this request (`POST /recipe`) due to 1 missing or invalid parameter.  **The following additional tip will not be shown in production**:  
                    Tip: Check your client-side code to make sure that the request data it sends matches the expectations of the corresponding parameters in your server-side route/action.  
                    Also check that your client-side code sends data for every required parameter.  Finally, for programmatically-parseable details about each validation error, `.problems` 
                    (Just remember, any time you inject dynamic data into the HTML, be sure to escape the strings at the point of injection.)'
    }
    ```
    Notice how we have an actual object with navigable properties. This is great! We can more easily parse this information on the client. :)

    **EXPLORE:** Try changing the other attributes in the `inputs` section (and/or in the `model` in `Recipes.js`) with ones found [here](https://sailsjs.com/documentation/concepts/models-and-orm/validations).

1. Make sure to change the `category` in the `POST` request back to "Dinner". Then, run the app and submit the request, which should now succeed in creating one more Recipe.





## Add More Validation For Creating Recipes

We have a couple requirements for the Recipes app that declares...

- The recipe's ingredients should not exceed 15 items, and each should not exceed 50 chars.

- The recipe's instructions should not exceed 20 items, and each should not exceed 200 chars.

Sails doesn't have built-in validations like this, of course. It's too *custom*. So, let's now use exactly that, a *custom* validator!

1. Replace the `ingredients` attribute with the following code:

    ```
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
    ```

    Notice the `custom` property here and then the function that it uses, which needs to return `bool` value. 

    **NOTE:** Right now, this walk-through doesn't cover Sails Helpers, but this function here sure looks like something that could be abstracted out into one. Explore on your own how you might do that.

    **NOTE:** Wondering what those requirements are that I mentioned just now? You can find a list of all of them at the end of this document.

1. Create another Recipe request in Postman, or modify the one you have with a different name, and make sure to add 16 ingredients. Alternatively, you could have 2 ingredients, but make sure to change our custom validator to `.length <= 1`

1. Run the app and submit the request. You should get an output like this (if you're like me and just duplicated the one ingredient a ton of times):

    ```
    {
        "code": "E_MISSING_OR_INVALID_PARAMS",
        "problems": [
            "Invalid \"ingredients\":\n  · Value ([\n  '1 lb. raw hamburger', '1 lb. raw hamburger',\n  '1 lb. raw hamburger', '1 lb. raw hamburger',\n  '1 lb. raw hamburger', '1 lb. raw hamburger',\n  '1 lb. raw hamburger', '1 lb. raw hamburger',\n  '1 lb. raw hamburger', '1 lb. raw hamburger',\n  '1 lb. raw hamburger', '1 lb. raw hamburger',\n  '1 lb. raw hamburger', '1 lb. raw hamburger',\n  '1 lb. raw hamburger', '1 lb. raw hamburger',\n  '1 lb. raw hamburger', '1 lb. raw hamburger',\n  '1 lb. raw hamburger'\n]) failed custom validation."
        ],
        "message": "The server could not fulfill this request (`POST /api/recipes`) due to 1 missing or invalid parameter.  **The following additional tip will not be shown in production**:  Tip: Check your client-side code to make sure that the request data it sends matches the expectations of the corresponding parameters in your server-side route/action.  Also check that your client-side code sends data for every required parameter.  Finally, for programmatically-parseable details about each validation error, `.problems`. (Just remember, any time you inject dynamic data into the HTML, be sure to escape the strings at the point of injection.)"
    }
    ```

1. Go back to just having the one ingredient, but make it have more than 50 characters.

1. Run the app again and submit the request, where you should get a response a bit like the last one.

1. On your own, apply a custom validator for the instructions business rules stated earlier.

1. Also, make the `userId` required.

1. And...have the `create` Action return specific data, instead of just a message, such as the Id of the one that was created. Here's a little help, if you get stuck...

    ```
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
    ```

1. And...implement functionality to get all Recipes and get a Recipe by Id.






## Create Reviews

Now you're going to work a bit on your own to provide a way to create and read Reviews from the database with the following requirements...and some code hints.

1. The model should look like this (but we're going to build on this shortly):

    ```
    attributes: {
        header: { type: 'string', required: true },
        rating: { type: 'number', required: true },
        feedback: { type: 'string', required: true },
    },
    ```

1. Your Action, its attributes, its function (a.k.a. the API endpoint), and a route to match should all be included.

1. Don't forget to pass in a User Id and a Recipe Id to associate the Review to.

    **NOTE:** We already have a Review in the database, so as we continue on in this walk-through, you'll still be able to work through the next steps, so you can come back and create the above Action for Reviews later in order to have more Reviews to work with, but at least create a model for `Reviews` right now.





## Get Reviews and Recipes For Users

With at least the one Review in our database, we're ready to look up a User to get all the Recipes and Reviews they're associated with.

1. You should now have a model for Reviews.

1. In your `Recipes.js` model, add the following code and comments (which explain a few things that we're get to in just a minute) in the `attributes` section below `instructions`:

    ```
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
    ```

1. In your `Reviews.js` model, add these properties in the `attributes` section (below `feedback`):

    ```
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
    ```

1. And in your `Users.js` model, add these in much the same way as the last two:

    ```
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
        via: 'userId'
    },

    /**
     * And here is another One-to-Many, because Users can also have a number of Reviews.
     */
    reviews: {
        collection: 'reviews',
        via: 'userId'
    }
    ```

1. Lastly, in order to put those associations to use, we need to have the `UserController` fetch us some data. In Sails, we use the `.populate(...)` function.

1. Place the `.populate(...)` calls in the `getUserById` function so the entire thing looks like this:

    ```
    getUserById: async (req, res) => {

        let response = await Users.find({
            where: { id: req.params.id },
            select: ["firstName", "lastName", "email", "typeOfUser"]
        })
        /**
         * The following calls to `populate(...)` will use the associations we set up in the Recipes and Reviews models.
         * 
         * See the documentation for other calls, as well as passing a sub-query into `populate(...)`: https://sailsjs.com/documentation/reference/waterline-orm/queries
         */
        .populate('recipes')
        .populate('reviews');

        if (!response)
            return res.badRequest(`User not found`);

        return res.ok(response);
    },
    ```

    **NOTE:** There's nothing specific about a Controller here that an Action can't do. It's merely the case that we used a Controller as an example way to work with Users and an Action to work with Recipes and Reviews. Recall that these are essentially two ways of doing almost the exact same thing, just different paradigms.

    **NOTE:** And I might as well say it here that you probably shouldn't mix Controllers and Actions in an app. Pick one and go with it (probably Actions). We did both in this app simply to teach both concepts. You might be comfortable working with Controllers, because so many other programming languages and frameworks have done it that way for years, but Actions certainly have their place and are really easy to work with.

1. If you saved your request in Postman to get a User by Id, open it up, run the app, and send it again. If not, go back and create that request again and send it.

    **NOTE:** Make sure to use the User Id of the one we set up when we created the database, or at least one that you may have created on your own that has both Recipes and Reviews associated with it. Otherwise, we won't get any new data back except some empty arrays for Recipes and Reviews. If you don't have a User that has both a Recipe *and* and a Review associated, then create another request in Postman to get User data that will also pull up Review data. Or, create more data to your heart's content to fulfill what we're trying to accomplish here. :)

1. You should have a response that looks something like this, but maybe not *exactly* the same:

    ```
    [
        {
            "recipes": [
                {
                    "createdAt": 1618184018380,
                    "updatedAt": 1618184018380,
                    "id": "60738752f60fa83a98585d79",
                    "userEmail": "",
                    "name": "Cheeseburgers",
                    "category": "Dinner",
                    "ingredients": [
                        "1 lb. raw hamburger"
                    ],
                    "instructions": [
                        "1. Form hamburger patties into 4-5 inch round patties.",
                        "2. Place patties onto the grill. Cook for 8-10 minutes.",
                        "3. Enjoy savory goodness!"
                    ],
                    "userId": "6071b1254bda4521d523efaf"
                }
            ],
            "reviews": [
                {
                    "createdDate": 1618183608576,
                    "updatedDate": 1618183608576,
                    "id": "6071b1254bda4521d523efb1",
                    "header": "Tastes Like Heaven",
                    "rating": 5,
                    "feedback": "Always great to have a delicious cobbler with a Southern recipe!",
                    "recipeId": "6071b1254bda4521d523efb0",
                    "userId": "6071b1254bda4521d523efaf"
                }
            ],
            "id": "6071b1254bda4521d523efaf",
            "firstName": "Jason",
            "lastName": "Fox",
            "email": "jasonfox@sailsrecipes.com",
            "typeOfUser": "Chef"
        }
    ]
    ```

    Well, that's a whole lot of data to get back! Maybe we should limit it to *just* some "select" information.

    **NOTE:** If you get any errors or the data doesn't come back right, go back over the last few steps and make sure the associations and the `.populate(...)` calls are set up correctly.

1. Update the `.populate(...)` calls with some filters, like this:

    ```
    .populate('recipes', {
            sort: 'name',
            select: 'name'
        })
        .populate('reviews', {
            sort: 'createdDate DESC',
            select: 'header',
            limit: 3
        });
    ```

    These should be pretty self-explanatory what we're doing here. :) This just gives you an idea of the way to filter and select data with just a few of the options available.

    **NOTE:** You can [read up more](https://sailsjs.com/documentation/reference/waterline-orm/queries/populate) on other things you can do here.

1. Now it's up to you to implement functionality so that you can get a Recipe (or all of them!) to include all Reviews for it, as well as the User (a.k.a. Chef) details who created the Recipe.





## Implement Search

This is the last topic we're going to cover in this walk-through. After this, there are some useful links to help you move forward and a couple topics listed for you maybe refactor or build on everything we did here.

You're probably going to find that implementing search is pretty straight-forward and easy to read in the upcoming code, but it certainly has *much* more to it than this. Like any data queries, you can do some complex things with it. I found that, in a very loose way (but close), that these queries are of very similar concept to using LINQ in C# to query data. They aren't lambdas here, but you'll get what I mean. :)

1. Execute `sails new action recipe/search`

    **NOTE:** Admittedly, this one is up for debate a little on where to put it and which path it should have, because we're going to be searching across Recipes and Users. We're putting it in the recipe folder, though, because the requirements stated that the route for search needs to be `/api/recipe/search?searchField=<some search value>`.

1. In the `inputs` section, add the following code:

    ```
    searchField: {
        type: 'string',
        required: true,
        regex: /^[a-zA-Z0-9]+$/,
        maxLength: 50
    },
    ```

    The incoming input from the URL is `searchField`, as described above. So, we give our input that name so this API endpoint knows what to look for and accept.

    We have a requirement that only alphanumeric values are allowed to be searched on. So, we add a `regex` property to limit that. Pretty easy, huh? :)

1. Next, we're going to add the `exits` with some familiar code:

    ```
    success: {
        statusCode: 200
    },

    notFound: {
        statusCode: 404
    }
    ```

1. In the `fn` function, let's add the first part of the search to look in Recipes, where the requirement is to look across the `name`, `category`, and `ingredients` for the search value.

    ```
    let recipeResult = await Recipes.find({
        or: [
            { name: { 'contains': inputs.searchField } },
            { category: { 'contains': inputs.searchField } },
            { ingredients: { 'contains': inputs.searchField } },
        ]
    });
    ```

    This looks pretty easy to read, but understanding the syntax is key to building out [more complex queries](https://sailsjs.com/documentation/concepts/models-and-orm/query-language). We want it to search all of these fields, so we stick everything in an `or` clause here. Then, we want to know if any of those fields `contains` the search value. 

    **NOTE:** Some of the other conditions you can use, in addition to `contains` are `'<'`, `'<='`, `'>'`, `'>='`, `'!='`, `nin`, `in`, `startsWith`, and `endsWith`.

1. In the same fashion, we're going to search in the Users collection within `firstName` and `lastName`. See if you can add it on your own beneath the last block before copying the next code block here.

    ```
    let userResult = await Users.find({
        or: [
            { firstName: { 'contains': inputs.searchField } },
            { lastName: { 'contains': inputs.searchField } }
        ]
    });
    ```

1. Before we return the response, we need to fulfill another requirement that everything returns in an array, even if there's only one result, which certainly helps any client apps know what to expect, instead of maybe getting an `object` sometimes and an `array` at other times.

    ```
    let response = recipeResult.concat(userResult);
    ```

1. Lastly, let's return the response:

    ```
    return exits.success(response);
    ```

    That's it for our search Action. Let's add the route for it and test it out.

1. Run the app and create a GET request in Postman at `http://localhost:1337/api/recipes/search?searchField=sugar` and you should...uh oh, see an error? Perhaps it looks like this:

    ```
    ReferenceError: exits is not defined
    at Object.fn (c:\Source\NodeJS\RecipeApi\recipe-api\api\controllers\recipe\search.js:44:5)
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
    ```

    Does it make sense? Previously in the `create` Action, I provided a code snippet that included the `exits` parameter as part of the `fn` function. In order to get this to work, and for any Action to be able to use them, we need to change the function to this:

    ```
    fn: async function (inputs, exits) {
    ```

1. Run the app again, submit the request, and you should get an output like this now:

    ```
    [
        {
            "id": "6074a52574868f2b295ca9dc",
            "createdDate": 1618257189491,
            "updatedDate": 1618257211253,
            "userEmail": "",
            "name": "Peach Cobbler",
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
            "userId": "6074a52574868f2b295ca9da"
        }
    ]
    ```

    That's a lot better! :)

1. Try submitting a request in Postman for `sugar!` (or any invalid search term that isn't alphanumeric), which should respond like this:

    ```
    {
        "code": "E_MISSING_OR_INVALID_PARAMS",
        "problems": [
            "Invalid \"searchField\":\n  · Value ('sugar!') did not match the configured regular expression (/^[a-zA-Z0-9]+$/)"
        ],
        "message": "The server could not fulfill this request (`GET /api/recipes/search`) due to 1 missing or invalid parameter.  **The following additional tip will not be shown in production**:  Tip: Check your client-side code to make sure that the request data it sends matches the expectations of the corresponding parameters in your server-side route/action.  Also check that your client-side code sends data for every required parameter.  Finally, for programmatically-parseable details about each validation error, `.problems`. (Just remember, any time you inject dynamic data into the HTML, be sure to escape the strings at the point of injection.)"
    }
    ```

1. Explore some more search values across all the fields we told it to look at.

1. Add more Recipes and Users to the database, and even make sure to put fun things in where an ingredient is also someone's first or last name! Then verify that the search results contain them all.

    **NOTE:** In your exploration, did you notice that the search that case mattered? MongoDB is case-sensitive, so by default it'll look for the exact search value you provide. I need to explore it a bit more to see if I can get it to search insensitively like that, but see what you can do to get that work, if possible.




## Deploy App to Docker (Optional) 

One more thing we can do is deploy both the app and the database to Docker. We used Docker in this walk-through as a place to host the database so we could easily spin it up and tear it down as needed. We can do the same for the app we've built here. As a kind of bonus, we can do both at the same time. This walk-through isn't a tutorial on Docker, but I encourage you to learn more about it on the [Docker site](https://www.docker.com/).

1. First, let's stop and remove the existing Container we have for our database.

1. Execute `docker container stop 'sails-mongo'` and then `docker container rm sails-mongo`

1. In the root folder of the application, add a `Dockerfile` (make sure it's that exact case and has no extension on the end).

    **NOTE:** This one is in the root folder because we want to reference all the app folders relatively easily to this file. The other `Dockerfile` in the `data` folder is at the same level as the `mongo-init.js` file, which made it easy to reference and use that file in the same way.

1. In that file, add the following code:

    ```
    #  Define the version of Node.js to use for the image.  Versions can be located in the Docker Hub:  https://hub.docker.com/_/node
    FROM node:14.15-alpine3.10

    #  Create app directory
    WORKDIR /src

    #  Install application dependencies
    COPY package*.json ./

    #  Install npm
    RUN npm install 

    #  Bundle app source code
    COPY . .

    #  Provide the application startup command
    CMD ["node", "app.js"]
    ```

1. Also in the root folder, add a `docker-compose.yaml` file with the following:

    ```
    version: "3.8"

    services:
        sails-mongo:
            build: ./data
            container_name: sails-mongo
            ports:
                - "27020:27017"
        sails-app:
            build: .
            container_name: sails-app
            ports:
                - "5000:1337"
            depends_on: 
                - sails-mongo
            environment:
                - NODE_ENV=PROD
            restart: "always"
    ```

    Here we've set the internal port `27017` to forward to external port `27020`, just to show that we're not connecting to any other instances of it. The external value could be any valid port available on your machine.

    **NOTE:** You may notice the last line for `restart: "always"` and wonder why. Well, I found that sometimes it seemed like there was a sort of race condition in that the app would spin up before the database was ready to be connected to it. So, we're going to give it another shot at connecting a few times. By default, if it doesn't connect within a few tries, it gives up, so you won't need to worry about it continuing to error out.

1. Before we can run it, we need to update `production.js` so the application, when it runs in a Container, will know how to find the database in another Container next to it. 

    **NOTE:** We're going to add the connection to that file because we told our `docker-compose.yaml` file that we want it to run in PROD.

1. In `production.js` in the `env` folder, add:

    ```
    adapter: 'sails-mongo',
    url: 'mongodb://sailor:7.37knots@sails-mongo:27020/sailsRecipes',
    authSource: 'admin',
    ```

1. Make sure your CLI is in the root folder where the `Dockerfile` and `docker-compose.yaml` files are and execute `docker-compose up`

1. You should see some output of it building and creating the app.

1. Open Docker and in the Containers/Apps tab you should see "recipe-api". Expand that and you should also see "sails-mongo" and "sails-app" running.

    If you don't see them or any of their icons are not green, click on them to pull up the logs to see what might be wrong. 

    Some things to check are:

    - Port numbers match between where it's trying to connect and the actual port of the database.

    - The adapter in `production.js` should reference "sails-mongo" (the *name* of the database Container), instead of "localhost", like it does in `datastores.js` for development runs.

    If you need to tear down the Containers and try again, execute `docker-compose down`

    **NOTE:** I noticed in VS Code sometimes that executing the `docker-compose` command would leave it running without going back to a command prompt. So, the usual `ctrl + c` command would exit out of that, but also stop the containers from running. That's okay if it does that, because running the `up` command is what we needed for it to build and deploy the Containers, so now that they're in Docker, you can run them from there.

1. To stop running the apps (if they're running in the first place) and delete them, execute `docker-compose down`

    **NOTE:** This will still leave the images in Docker. *Sometimes* these cached versions will interfere and not use the latest build when if you were to execute a `build` or `up` command. If you suspect that is causing issues, go into the Images tab, find the ones you want to delete, hover over it, click the vertical ellipsis, select Remove.





# Conclusion

That wraps up where we're at right now with this Recipe app. There's definitely *a lot* more that can be done. Again, I encourage you to keep exploring, read up on the topics in the next secion, experiment, and see what ways you can build on this all.

Thank you so much for making it this far! I hope you've learned a lot and that this gave a good idea what it's like to use Sails as a Node framework for API development. :)






# Further Topics

Here are a few important topics to really get to know as you continue learning Sails. 

1. [Helpers](https://sailsjs.com/documentation/concepts/helpers) - These are ways to abstract functions out into re-usable code.

1. [Middleware](https://sailsjs.com/documentation/concepts/middleware) - These are ways to intercept, process, and handle HTTP requests and responses as they move through the pipeline.

1. [Policies](https://sailsjs.com/documentation/concepts/policies) - These handle authorization for your API's.

1. [Security](https://sailsjs.com/documentation/concepts/security) - These are ways to work with things like CORS, CSRF, XSS, and others.

1. [TypeScript](https://sailsjs.com/documentation/tutorials/using-type-script#using-typescript-in-a-sails-app) - Highly recommended by many developers, even though Sails documentation here does indeed state that plain vanilla JavaScript is the language of choice. Now that I've gotten to know Sails (and node.js), I'd like to go back over this application with where it's at to implement TypeScript into it. I didn't do it from the beginning, because I wanted to make sure that I could follow the documentation and examples out there, without running into any possible issues caused by TypeScript-generated files. Now I'm more comfortable doing this. :)

1. And, of course, many other [Concepts](https://sailsjs.com/documentation/concepts) that you can implement, as well.






# Other Useful Links ##

## Sails

[SailsJS Site](https://sailsjs.com/)

[Sails.js In Action - eBook Site](https://livebook.manning.com/book/sails-js-in-action)

[Actions2 CRUD Example](https://www.logisticinfotech.com/blog/sails-js-actions2-example-with-crud/)

[Building a Simple RESTful API with Node, SailsJS, and MongoDB](https://icodemag.com/building-a-simple-restful-api-with-node-sailsjs-and-mongodb/)

[Building A Node.js Web API With Sails.js](https://blog.logrocket.com/building-a-node-js-web-api-with-sails-js/)

[Using TypeScript in SailsJS](https://sailsjs.com/documentation/tutorials/using-type-script#using-typescript-in-a-sails-app)

[SailsJS Associations with Waterline](https://github.com/fraygit/SailsJs-Mysql-Association-Tutorial/)

[Datastore Adapters](https://sailsjs.com/documentation/concepts/extending-sails/adapters/available-adapters)

[CORS](https://sailsjs.com/documentation/concepts/security/cors)

[TypeScript](https://sailsjs.com/documentation/tutorials/using-type-script#using-typescript-in-a-sails-app)

## MongoDB

[MongoDB Crash Course - YouTube](https://www.youtube.com/watch?v=-56x56UppqQ)

[Using the $lookup Function](https://www.stackchief.com/tutorials/%24lookup%20Examples%20%7C%20MongoDB)

[Using MongoDB and Sails.js with a basic one-to-many association](https://jhtechservices.com/using-mongodb-and-sails-js-with-a-basic-one-to-many-association/), but does have *some* out-dated code conventions for Sails.

## Waterline ORM

[SailsJS Waterline ORM](https://sailsjs.com/documentation/reference/waterline-orm)

[Waterline Query Language](https://sailsjs.com/documentation/concepts/models-and-orm/query-language)

[Waterline ORM Site](https://waterlinejs.org/)





# Useful MongoDB Shell Commands

If you like to work in a CLI more for database commands, here are some examples. Remember that Sails uses Waterline Query Syntax within it, but you actually *can* use MongoDB syntax instead, it just really doesn't make sense to unless Waterline somehow can't do what you need it to.

**Find All Recipes, Group By Chef Id:** db.Users.aggregate([{$lookup: { from: 'Recipes', localField: '_id', foreignField: 'chefId', as: 'Recipes' }}]).pretty()

**Sort Desserts (1 = ascending, -1 = descending):** db.Recipes.find({ category: 'Dessert'}).sort({ name: 1 }).pretty()

**Limit Top 2 Results Sorted By Name:** db.Recipes.find({ category: 'Appetizer'}).sort({ name: 1 }).limit(2).pretty()






# Gotchas

- **TL;DR** Run `Services.msc` as an admin and restart "Host Network Service" if you suddenly can't run your app.

    I ran into an issue randomly one day after making **zero** code changes from the day before and had left my machine running overnight (so, no restart had been done). 
    Whether it was an update or some issue (I didn't bother digging through the Event Viewer), the app would no longer run, and I would get this...

    ```
    error: Server failed to start.
    error: (received error: EACCES)
    error:
    error: Troubleshooting tips:
    error:
    error:  -> Do you have a slow Grunt task, or lots of assets?
    error:
    error:  -> Is something else already running on port 1337 ?
    error:
    error:  -> Are you deploying on a platform that requires an explicit hostname, like OpenShift?
    error:     (Try setting the `explicitHost` config to the hostname where the server will be accessible.)
    error:     (e.g. `mydomain.com` or `183.24.244.42`)
    ```

    ...none of which were the issue. 

    To the Internet I went! I eventually found the above mentioned TL;DR solution. That worked. Even though I had also tried restarting my computer shortly after this message started plaguing me...it hadn't fixed it. :/

    - Referenced solution: [StackOverflow](https://stackoverflow.com/questions/9164915/node-js-eacces-error-when-listening-on-most-ports)

- In case you missed it in the steps above, don't let VS Code or any other IDE try to be helpful when working in `Controllers` when it tries to add references to `Models` Such references with supersede Sails' built-in functionality to reference those models. 

    So, if it adds something like this: `const Users = require('../models/Users');`, remove it. :)
