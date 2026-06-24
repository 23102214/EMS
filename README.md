# Employee Management System (EMS)

<div align="center">

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk)](https://www.oracle.com/java/technologies/javase/jdk21-archive-downloads.html)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-6DB33F?style=flat-square&logo=spring-boot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

A modern, full-stack Employee Management System built with React and Spring Boot, designed for efficient workforce administration and management.

[Quick Start](#quick-start) • [Architecture](#architecture) • [API Documentation](#api-documentation) • [Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Contributing](#contributing)

---

## 🎯 Overview

The Employee Management System is a comprehensive web application designed to streamline HR operations and employee data management. It provides a modern, intuitive interface for managing employee information, attendance, leaves, payroll, and departmental structures.

This is a production-ready full-stack application with:
- Responsive React frontend with real-time updates
- RESTful Spring Boot backend with comprehensive APIs
- Secure authentication and authorization
- PostgreSQL database integration
- Professional UI/UX design

---

## ✨ Features

### Employee Management
- ✅ Create, read, update, and delete employee records
- ✅ Employee profile management with detailed information
- ✅ Department assignment and organization
- ✅ Search and filter capabilities

### Attendance & Leave Management
- ✅ Track employee attendance
- ✅ Leave request workflow
- ✅ Leave balance management
- ✅ Attendance reporting

### Payroll Management
- ✅ Salary calculation and management
- ✅ Payroll processing
- ✅ Salary slip generation

### Dashboard & Analytics
- ✅ Real-time dashboard with key metrics
- ✅ Employee statistics
- ✅ Department overview
- ✅ Visual reports and insights

### Security
- ✅ Role-based access control (RBAC)
- ✅ JWT token-based authentication
- ✅ Secure API endpoints
- ✅ Password encryption

---

## 🏗️ Architecture

The application follows a three-tier architecture pattern:

```
┌─────────────────────────────────────┐
│     Frontend (React + TypeScript)    │
│      Running on localhost:3000       │
└──────────────┬──────────────────────┘
               │ REST API (Axios)
               ▼
┌─────────────────────────────────────┐
│   Backend (Spring Boot + Hibernate)  │
│      Running on localhost:8080       │
└──────────────┬──────────────────────┘
               │ JDBC
               ▼
┌─────────────────────────────────────┐
│    Database (PostgreSQL)             │
└─────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+
- **Language**: TypeScript
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **State Management**: Context API
- **Styling**: CSS3
- **Node.js**: 18+

### Backend
- **Framework**: Spring Boot 3.3.5
- **Java Version**: Java 21 (LTS)
- **ORM**: JPA/Hibernate
- **Authentication**: Spring Security + JWT
- **Build Tool**: Maven 3.9+
- **Database**: PostgreSQL

### Database
- **Type**: PostgreSQL
- **Driver**: PostgreSQL JDBC Driver

---

## 📋 Prerequisites

### System Requirements
- **Operating System**: Windows, macOS, or Linux
- **RAM**: Minimum 4GB
- **Disk Space**: Minimum 2GB

### Required Software

#### Backend
- **Java 21** or later ([Download](https://www.oracle.com/java/technologies/javase/jdk21-archive-downloads.html))
- **Maven 3.9.x** or later ([Download](https://maven.apache.org/download.cgi))
- **PostgreSQL 12+** ([Download](https://www.postgresql.org/download/))

#### Frontend
- **Node.js 18+** and **npm 9+** ([Download](https://nodejs.org/))

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd EMS
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Maven dependencies
mvn clean install

# Configure database connection
# Edit src/main/resources/application.properties with your PostgreSQL credentials

# Run the backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
# Open a new terminal in the project root
cd ..

# Install Node dependencies
npm install

# Create environment configuration
# Create .env.local file with:
echo "VITE_API_URL=http://localhost:8080/api" > .env.local

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to: `http://localhost:3000`

---

## 📁 Project Structure

```
EMS/
├── backend/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/ems/
│   │   │   │   ├── controller/       # REST Controllers
│   │   │   │   ├── service/          # Business Logic
│   │   │   │   ├── repository/       # Data Access Layer
│   │   │   │   ├── entity/           # JPA Entities
│   │   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── security/         # Security Configuration
│   │   │   │   └── config/           # Application Configuration
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── db/               # Database Scripts
│   │   └── test/java/                # Unit Tests
│   ├── pom.xml                       # Maven Configuration
│   └── README.md
├── src/                              # React Frontend
│   ├── components/                   # Reusable React Components
│   │   ├── common/                   # Shared Components
│   │   └── layout/                   # Layout Components
│   ├── pages/                        # Page Components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── employees/
│   │   ├── attendance/
│   │   ├── leaves/
│   │   ├── payroll/
│   │   └── departments/
│   ├── services/                     # API Services
│   ├── context/                      # React Context (State Management)
│   ├── types/                        # TypeScript Type Definitions
│   ├── App.tsx
│   └── main.tsx
├── public/                           # Static Assets
├── package.json                      # npm Configuration
├── tsconfig.json                     # TypeScript Configuration
├── vite.config.ts                    # Vite Configuration
├── index.html
└── README.md

```

---

## 📚 API Documentation

### Backend API

The backend provides a comprehensive REST API for all operations. 

**Base URL**: `http://localhost:8080/api`

### Key Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh authentication token

#### Employees
- `GET /employees` - Get all employees
- `GET /employees/{id}` - Get employee by ID
- `POST /employees` - Create new employee
- `PUT /employees/{id}` - Update employee
- `DELETE /employees/{id}` - Delete employee

#### Departments
- `GET /departments` - Get all departments
- `POST /departments` - Create department
- `PUT /departments/{id}` - Update department
- `DELETE /departments/{id}` - Delete department

#### Attendance
- `GET /attendance` - Get attendance records
- `POST /attendance` - Mark attendance
- `PUT /attendance/{id}` - Update attendance

#### Leave Management
- `GET /leaves` - Get leave requests
- `POST /leaves` - Request leave
- `PUT /leaves/{id}/approve` - Approve leave
- `PUT /leaves/{id}/reject` - Reject leave

For complete API documentation, see [backend/README.md](backend/README.md)

---

## 💻 Development

### Running in Development Mode

```bash
# Terminal 1 - Backend
cd backend
mvn spring-boot:run

# Terminal 2 - Frontend
npm run dev
```

### Available Commands

#### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

#### Backend
```bash
mvn clean install          # Install dependencies
mvn spring-boot:run        # Run application
mvn test                   # Run tests
mvn clean package          # Create JAR package
```

### Environment Variables

Create `.env.local` in the project root:

```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=Employee Management System
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style Guidelines
- Follow Java conventions for backend code
- Follow JavaScript/TypeScript conventions for frontend code
- Write meaningful commit messages
- Include comments for complex logic
- Add unit tests for new features


