<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Employee Management System

This repository contains a React frontend and a Spring Boot REST backend for an Employee Management System.

View your app in AI Studio: https://ai.studio/apps/4fc0eea1-912f-4a81-b790-9604dfd6c66b

## Frontend

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Create `.env.local` and set:
   `VITE_API_URL=http://localhost:8080/api`
3. Run the frontend:
   `npm run dev`

The frontend runs on `http://localhost:3000`.

## Backend

**Prerequisites:** Java 17+ and Maven 3.9+

1. Open the backend folder:
   `cd backend`
2. Run the API:
   `mvn spring-boot:run`

The backend runs on `http://localhost:8080/api`.

See [backend/README.md](backend/README.md) for the endpoint list.
