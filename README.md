# Cooking Recipes Web Application

A full-stack web application for managing and sharing cooking recipes with family and friends.

## Features

- User authentication (register/login) with JWT
- Browse popular recipes
- View detailed recipe information including categories, difficulty, and calorie info
- Save favorite recipes
- Create and manage personal recipes
- Friends and followers system with messaging support
- Admin panel with statistics and management features

## Tech Stack

- Frontend: React.js
- Backend: Node.js + Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT (JSON Web Tokens)
- Real-time communication: Socket.io
- API Documentation: Swagger (OpenAPI 3.0)
- Containerization: Docker, Docker Compose
- Web server: Nginx (for frontend)

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
- `swagger/` – Swagger API documentation files.
- `Dockerfile` – Backend Docker image build instructions.
- `docker-compose.yml` – Docker Compose configuration for backend and frontend.
- `nginx.conf` – Nginx configuration for serving frontend.

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
- `Dockerfile` – Frontend Docker image build instructions.

## Installation and Setup

### Prerequisites

- Node.js (v16+ recommended)
- npm
- MongoDB instance (local or cloud)
- Docker and Docker Compose (optional, for containerized setup)

### Local Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd kulinar-main
   ```

2. Install backend dependencies:

   ```bash
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   npm run install-client
   ```

4. Create a `.env` file in the root directory with the following variables:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

5. Run the development servers concurrently (backend + frontend):

   ```bash
   npm run dev
   ```

6. Access the application:

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000/api](http://localhost:5000/api)

### Docker Setup

1. Build and start containers using Docker Compose:

   ```bash
   docker-compose up --build
   ```

2. Access the application:

   - Frontend: [http://localhost](http://localhost)
   - Backend API: [http://localhost:5000/api](http://localhost:5000/api)

## API Documentation

Interactive API documentation is available via Swagger UI:

- [http://localhost:5000/kulinar_diplom-api-docs](http://localhost:5000/kulinar_diplom-api-docs)

This documentation includes all available endpoints, request/response schemas, and authentication details.


## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please ensure your code follows existing style and includes appropriate tests.

## License

This project currently does not specify a license.


