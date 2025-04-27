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

## Project Structure

### Root Directory

- `.env` – Environment variables for backend.
- `.gitignore` – Git ignored files.
- `README.md` – Project documentation.
- `package.json`, `package-lock.json` – Backend dependencies and scripts.
- `server.js` – Entry point for the Express backend server.
- `config/` – Configuration files (e.g., database connection).
- `middleware/` – Express middleware (e.g., authentication).
- `models/` – Mongoose models for MongoDB (User, Recipe, Chat, etc.).
- `routes/` – Express route handlers (auth, recipes, users, admin, etc.).
- `scripts/` – Utility scripts (e.g., database seeding).
- `sockets/` – Socket.io server logic (e.g., messenger).

### Frontend (`client/`)

- `.env` – Environment variables for frontend.
- `.gitignore` – Git ignored files for frontend.
- `package.json`, `package-lock.json` – Frontend dependencies and scripts.
- `public/` – Static assets and HTML template (favicon, index.html, manifest, logos).
- `src/` – React application source code:
  - `App.js` – Main React app component.
  - `index.js` – React entry point.
  - `components/` – UI components, organized by feature:
    - `auth/` – Login and registration forms.
    - `friends/` – Friends and followers UI components.
    - `messenger/` – Chat and messaging interface components.
    - `pages/` – Main application pages (Home, Profile, Recipes, Admin, etc.).
    - `users/` – User search and profile modal components.
    - `layout/` – Navbar and layout components.
    - `routing/` – Route protection (private/admin routes).
  - `context/` – React Contexts for authentication and messenger.
  - `utils/` – Utility functions (e.g., stats export).
  - `App.css`, `index.css` – Global styles.

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
