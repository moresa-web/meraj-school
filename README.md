# Meraj School - Monorepo

This repository contains all main projects for Meraj School platform:

## Projects

### 1. admin-endpoint
- **Type:** Admin Panel (Next.js, TypeScript)
- **Description:** Management dashboard for school admins (users, classes, news, etc).
- **How to run:**
  ```bash
  cd admin-endpoint
  npm install
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Api.EndPoint
- **Type:** Backend API (Node.js, TypeScript, Express)
- **Description:** Main RESTful API for all school data and authentication.
- **How to run:**
  ```bash
  cd Api.EndPoint
  npm install
  npm run dev
  ```
  Default API URL: `http://localhost:5000`

### 3. Site.EndPoint
- **Type:** Public Website (Vite, React, TypeScript)
- **Description:** Main website for students, parents, and visitors.
- **How to run:**
  ```bash
  cd Site.EndPoint
  npm install
  npm run dev
  ```
  Default site URL: `http://localhost:5173`

## Development

- All projects use TypeScript and follow best practices for security, error handling, and documentation.
- Use separate terminals for each project during development.
- For API and admin panel integration, make sure both `Api.EndPoint` and `admin-endpoint` are running.

## Docker

You can use `docker-compose.yml` in the root to run all services together:
```bash
docker-compose up --build
```

## Contributing

- Use meaningful commit messages (preferably in English).
- Create a new branch for each feature or bugfix.
- Pull requests are welcome! 
