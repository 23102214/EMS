# EMS Spring Boot Backend

Spring Boot REST API for the React Employee Management System.

## Requirements

- Java 17+
- Maven 3.9+

## Run

```bash
mvn spring-boot:run
```

The API starts on:

```text
http://localhost:8080/api
```

Health check:

```text
GET http://localhost:8080/api/health
```

## Frontend Setup

Create `.env.local` in the project root:

```env
VITE_API_URL=http://localhost:8080/api
```

Then start the frontend from the project root:

```bash
npm run dev
```

## Implemented Endpoints

- `GET /api/health`
- `GET /api/employees`
- `GET /api/employees/{id}`
- `POST /api/employees`
- `PUT /api/employees/{id}`
- `DELETE /api/employees/{id}`
- `GET /api/departments`
- `POST /api/departments`
- `PUT /api/departments/{id}`
- `DELETE /api/departments/{id}`
- `GET /api/attendance`
- `POST /api/attendance/clock-in/{employeeId}`
- `POST /api/attendance/clock-out/{employeeId}`
- `GET /api/leaves`
- `POST /api/leaves`
- `POST /api/leaves/{id}/process`
- `GET /api/payroll`
- `POST /api/payroll`
- `PUT /api/payroll/{id}/status`
- `GET /api/activities`

Data is currently in-memory and seeded on startup. The next natural step is replacing the service storage with JPA repositories and a database such as MySQL or PostgreSQL.
