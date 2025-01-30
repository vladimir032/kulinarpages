# Cooking Recipes Web Application

A full-stack web application for managing and sharing cooking recipes.

## Features

- User authentication (register/login)
- Browse popular recipes
- View detailed recipe information
- Save favorite recipes
- Create and manage personal recipes
- Recipe categories and difficulty levels
- Calorie information

## Tech Stack

- Frontend: React.js
- Backend: Node.js + Express.js
- Database: MongoDB
- Authentication: JWT

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   npm run install-client
   ```

2. Create a .env file in the root directory with:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

3. Run the application:
   ```bash
   npm run dev
   ```

The application will run on:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
