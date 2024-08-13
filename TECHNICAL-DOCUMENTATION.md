# Technical Documentation

## General Information

A basic backend witch handles user authentication and data storage.
It is a secure application using JWT Tokens, HTTP-Only Cookies, Signed Cookies, Password Encryption.

TypeScript is used to write the backend code.

The used TOOLS AND LIBRARIES are:

- Express
- Mongoose
- JWT
- Bcrypt

### Basic Structure

0.1 db.ts

Handles the connection to the database.

- Is able to switch between databases based on a custom header in the request (for development only).
- Uses the mongoose library to connect to the database.

  0.2 seeder.ts

A simple script to seed the database with some initial data.

1. index.ts

Entry point for starting the server.

- Imports app.ts, db.ts, config.ts
- Uses the db connect method to connect to the database and then starts the server.
- Error handling is implemented and port is defined by the environment variable.

2. app.ts

Initializes the express app and sets up the middleware.

- Applies a wide range of middleware to the app.
  Middleware:
  - app.use(express.json()): Parses incoming requests with JSON payloads (extended upload limit to 50 mb).
  - CookieParser: Parses incoming requests with cookie payloads.
  - app.use(cors()): Enables Cross-Origin Resource Sharing. Credentials are allowed from a certain URL only (in order to work with cookies).
  - express.static in combination with path and url to serve static files (e.g the default user image).
  - logMiddleware: A custom middleware that logs the incoming requests and provides you with detailed information for development.
  - dbMiddleware: A custom middleware that checks for a custom header in the request in order to change the database if needed.
- Imports the main route handler (appRouter.ts)

3. appRouter.ts

Handles all routes and imports the route handlers.

- Miles: /app/test: A simple test route to check if the server is running.
- Everyone: /app/user: The main route for user authentication and data storage.
- Jacub: /app/skills: The route for the skills of the user.

### User Router

1. userRouter.ts

- Miles: userRoutes.get("/get-users", verifyToken, getUsers);
- Marina: userRoutes.post("/signup", validate(signupValidator), userSignup);
- ???: userRoutes.post("/login", validate(loginValidator), userLogin);
- Miles: userRoutes.get("/auth", verifyToken, verifyUserAuth);
- ???: userRoutes.get("/logout", verifyToken, userLogout);
- Milos: userRoutes.delete("/:id",verifyToken, deleteUser);

### utils / customMiddleware

- errorHandlerMiddleware.ts: Implements a middleware for handling errors in Express.js applications. It logs the error, determines the status code (defaults to 500 if not specified), and sends a JSON response with the error status, code, and message. (Just started to implement this)

- config.ts: Centralizes configuration variables for the application, pulling values from environment variables. It defines settings for MongoDB URI, default database name, JWT secret, cookie secret, cookie name, domain, base URL, port, and frontend URL. Defaults are provided for development environments.

- validators.ts: Middleware for input validation utilizing `express-validator`. It includes a generic `validate` function that runs an array of validation rules against incoming requests and a set of predefined validators for user login and signup processes.

- tokenMiddleware.ts: Provides middleware functions for creating and verifying JWT tokens in Express.js applications. `createToken` generates a JWT with a specified `id`, `email`, and `expiresIn`. `verifyToken` checks for a valid token in signed cookies, verifies it, and attaches the user's ID to the request object for further use in the application. VerifyToken can be used to protect routes that require authentication.

- authHelpers.ts: Contains `setAuthCookie`, a function to manage authentication cookies in Express.js applications. It clears any existing cookie with the same name, generates a new JWT token, and sets a signed, HTTP-only cookie with a 7-day expiration. Used in Signup and Login controller to authenticate users.

### Controllers

1. userController.ts

- Miles: getUsers:
  fetches all users from the database and returns them, handling errors if they occur.
- Marina: userSignup:
- Marina: userSignup:
  checks if a user with the provided email already exists, hashes the password, sets a default profile image if none is provided, and saves the new user to the database. Upon successful registration, it creates an authentication token, stores it in a signed and HTTP-only cookie to enhance security, and returns a success response with the user's details. In case of errors, it logs the error and returns an error response.
- ???: userLogin:
- userLogin:
  Verifies the user's credentials by checking if the user with the provided email exists and if the provided password matches the stored hash. Upon successful verification, it creates an authentication token, stores it in a signed and HTTP-only cookie to enhance security, and returns a success response with a welcome message and the user's details. In case of incorrect credentials, it returns an appropriate error response. Any encountered errors are logged and returned in an error response.
- Miles: verifyUserAuth:
  This function is responsible for authenticating users. It retrieves the user's details from the database using the ID stored in JWT payload (`res.locals.jwtData.id`). If the user does not exist or the ID in the JWT does not match the user's ID, it returns a 401 status with an "Authentication failed" message. If the user is successfully verified, it returns a 200 status along with a success message and the user's name and email. In case of any errors during the process, it logs the error and returns a 500 status with an "Internal server error" message and the error details.
- ???: userLogout:
  This function handles user logout. It first checks if there's a request to test error handling by throwing a test error. It then verifies the user's identity by matching the user ID from the JWT payload (`res.locals.jwtData.id`) with the ID in the database. If the user is not found or the IDs do not match, it returns a 401 status . Upon successful verification, it clears the authentication cookie, ensuring the user is logged out securely. Any errors are forwarded to the centralized error handling middleware.
- Milos: deleteUser:
  Deletes a user from the database. It first checks for a user ID in the request, added by `verifyToken` middleware. If no ID is found, it returns a error. Otherwise, it attempts to find the user in the database and delete it.

### userModels.ts

- Jakub: Defines the `User` model schema using Mongoose for MongoDB. It includes fields for `userName`, `email` (unique), `password`, `confirmPassword` (used for local validation and removed before saving to the database), `image` (optional), `role` (with predefined values), and `skills` (referencing `Skill` model). The schema also automatically adds `createdAt` and `updatedAt` timestamps. The `confirmPassword` field is specifically designed for validation purposes and is excluded from the database entry upon saving.

## Skill Routes

The following section provides a detailed overview of the skill management module in our application. This module is crucial for handling user skills, including their creation, management, and association with user profiles. It consists of three main components: skillModel.ts, skillRoutes.ts, and skillController.ts. Each component plays a vital role in ensuring the smooth operation and functionality of the skill management system. This document not only outlines the current implementation but also highlights potential areas for future improvement to enhance the system's robustness, security, and maintainability.

### skillModel.ts

- Defines the 'skill' which is added to the database when created. Skills are referenced in userModel as an array of skillIds. Each skill is a unique entry in the 'skill' collection. The skill model consists of these fields:
	- name (skill name)
	- level (the user can choose between 3 different skill levels defined in the model and restricted with ENUM property)
	- yearsOfExperience (holds a number corresponding to the length of experience in years)
	- standard timestamps (createdAt, updatedAt)
	
- There is a .pre() method used on the schema to normalize the string format of the skill name (starts with a capital letter).

### skillRoutes.ts

- Defines endpoints for frontend calls related to skills.
- Each route is protected with verifyToken middleware.
- We have 4 routes in the current iteration:
	- get-skills
	- create-skill
	- delete-skill
	- add-skill-to-user
	
### skillController.ts

- Defines the functions related to the skillRoutes listed in the section above. This is a basic implementation that was created before we decided to handle the userId with secure cookies. In this iteration, logic is structured to read the userId from the request body. This will be updated in a future iteration of this feature.

- The controller functions are basic, just to test the core functionality of the skillModel:
	- getSkills -> returns all skills from the skill collection
	- createSkill -> create a new skill and save it to the skill collection
	- deleteSkill -> removes the relevant skill by the skillId
	- addSkillToUser -> associates a skill with user by pushing the skillId in the skill array residing in the userModel.
	
### Considerations for improvement:

The future implementation involves refining both the skillModel design and the controller logic to enhance security, maintainability, and functionality. Currently, the skill model is user-centric with custom properties like proficiency, which create potential inconsistencies and redundancies. In a future iteration, we will have a centralized skillTypeModel managed by an admin. This will standardize skill definitions, facilitating a cleaner reference system within user profiles. Therefore, the skillModel will be deprecated and replaced with a better-updated model called skillTypeModel. There will be a mechanism to match mentors and mentees by the skillId while each individual skill will be customized by the user by defining proficiency and length of experience while retaining its ID so that the matching system can be based on unique identifiers to avoid inconsistencies.
