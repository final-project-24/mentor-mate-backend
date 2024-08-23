[![Logo](https://raw.githubusercontent.com/final-project-24/mentor-mate-frontend/61ed792c89f83d2013c4f83c5364a9e328c73315/src/assets/images/mentormateLogo.svg?token=BC4L5JVTWQ2YPSDIWCSJ3S3GYQ2TK)](https://www.miles-advani.com/)

# Backend - Group 1

## Table of Contents

1. [Description](#description)
2. [Installation](#installation)
3. [Features](#features)
4. [Usage](#usage)
5. [Technical Documentation](#technical-documentation)
6. [License](#license)

## Description

A foundational backend witch handles user authentication and data storage.
It is a secure application using JWT Tokens, HTTP-Only Cookies, Signed Cookies and Password Encryption. It is developed using TypeScript, offering strong typing and modern syntax. MongoDB serves as the database.
A skills route is available for users to store their skills - this feature will be expanded in future versions.

<details>
<summary>Tech Stack</summary>
<br>
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>

<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
<img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git"/>
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
<img src="https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white" alt="VS Code"/>
</details>

<br>

## Installation

Before you begin, ensure you have met the following requirements:

- You have installed Node.js and npm

1. Clone the repository:

```bash
git clone git@github.com:final-project-test/small-project.git
```

2. Navigate to the project directory:

```bash
cd small-project
```

3. Install the dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

## Features

- Dynamic Database: Switch between db's with a custom header in the request (for development only).
- Error Handling: Detailed error messages for easy debugging.
- Middleware: A wide range of middleware to handle requests and responses.
- Route Handlers: Organized route handlers for different parts of the application.
- Secure Authentication: Uses JWT Tokens, HTTP-Only Cookies, Signed Cookies, and Password Encryption.
- Serve static files: Serve static files like images using express.static.
- Upload images: Upload images as a string to the database.

## Usage

To use this backend application, follow these steps:

1. **Environment Setup**:
   Create a `.env` file in the root directory and add the following variables:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   COOKIE_SECRET=your_cookie_secret
   PORT=3000 (or your preferred port)
   ```

2. **Start the Server**:
   Run the following command to start the development server:

   ```bash
   npm run dev
   ```

   The server will start, typically on `http://localhost:3000` (or the port you specified).

3. **API Endpoints**:
   The backend provides the following main endpoints:

   - User Authentication:

     - `POST /app/user/signup`: Register a new user
     - `POST /app/user/login`: Log in a user
     - `GET /app/user/auth`: Verify user authentication
     - `GET /app/user/logout`: Log out a user

   - User Management:

     - `GET /app/user/get-users`: Fetch all users (requires authentication)
     - `DELETE /app/user/:id`: Delete a user (requires authentication)

   - Skills Management:
     - `/app/skills`: Endpoints for managing user skills (detailed documentation needed)

4. **Testing the API**:
   You can use tools like Postman or curl to test the API endpoints. Remember to include the necessary headers and body for each request.

5. **Frontend Integration**:
   When integrating with a frontend application, ensure that your frontend is configured to send credentials with requests (to handle HTTP-only cookies) and that CORS is properly set up.

6. **Error Handling**:
   The application includes error handling middleware. Check the server logs for detailed error messages during development.

7. **Database Switching** (Development Only):
   To switch between databases, include a custom header in your request.
   key: `x-database-name`; set the value to the name of the database you want to use.

Remember to handle authentication tokens and cookies appropriately in your requests to protected routes.

For more detailed information on each endpoint and request/response formats, refer to the source code in the route handlers and controllers.

## Technical Documentation

Read more about the technical details in the [Technical Documentation](https://github.com/final-project-test/small-project/blob/main/server/backend/TECHNICAL-DOCUMENTATION.md).

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/miles-advani/Portfolio/blob/main/LICENSE)

[Back to Top](#readme-template-v1)
