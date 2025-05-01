# Guestbook application project (방명록 애플리케이션)

A full-stack guestbook application built with Next.js, Express, and PostgreSQL.

## Project Structure

```
.
├── backend/          # Backend application (Express.js)
│   ├── src/         # source code
│   ├── package.json 
│   └── tsconfig.json
├── docker-compose.yml # Docker settings
└── package.json
```

## Tech Stack

- **Frontend**: Next.js
- **Backend**: Express.js
- **Database**: PostgreSQL
- **Containerization**: Docker
- **Development Tools**: Concurrently

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- npm or yarn

## Getting Started

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd guestbook-practice
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   POSTGRES_USER=your_db_user
   POSTGRES_PASSWORD=your_db_password
   POSTGRES_DB=your_db_name
   NEXT_PUBLIC_API_URL=http://localhost:(number)
   ```

4. Start the development environment:
   ```bash
   npm run dev
   ```

## Docker Deployment

To run the application using Docker:

```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- PostgreSQL: localhost:5433

## Available Scripts

- `npm run dev`: Start both frontend and backend in development mode
- `npm run start:frontend`: Start only the frontend
- `npm run start:backend`: Start only the backend
- `npm run build:frontend`: Build the frontend application
- `npm run build:backend`: Build the backend application

## Project Features

- Full-stack guestbook application
- Dockerized development and production environments
- PostgreSQL database integration
- RESTful API backend
- Modern Next.js frontend


## License

This project is licensed under the ISC License. 