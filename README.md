# Tennis Court Reservation System

A full-stack web application for managing tennis court reservations. Users can register, login, and book tennis courts in 1-hour slots. Admins can manage courts and reservations.

## Features

- User authentication (register, login, protected routes)
- Book tennis courts in 1-hour slots
- View and manage your reservations
- Admin dashboard to manage all reservations and courts
- Responsive UI built with React and Bootstrap

## Tech Stack

- **Frontend**: React, React Router, Bootstrap, Axios
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

- Node.js (v14+)
- npm or yarn
- PostgreSQL

## Installation

### Clone the repository

```bash
git clone https://github.com/yourusername/tennis-reservation-system.git
cd tennis-reservation-system
```

### Option 1: Using Docker (Recommended)

The easiest way to get started is using Docker Compose:

```bash
docker-compose up
```

This will set up:
- PostgreSQL database with sample data
- Backend API server at http://localhost:5000
- Frontend development server at http://localhost:5173

### Option 2: Manual Setup

#### Database Setup

1. Create a PostgreSQL database:

```bash
createdb tennis_reservation
```

2. Run the initialization script:

```bash
psql -d tennis_reservation -f scripts/init_db.sql
```

#### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on the example:

```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials and a JWT secret.

5. Start the backend server:

```bash
npm run dev
```

The server will run on http://localhost:5000.

#### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

The frontend will run on http://localhost:5173.

## Deployment

### Backend

The backend can be deployed to any cloud provider that supports Node.js applications like AWS, Azure, or Heroku.

1. Set up environment variables for production
2. Configure your PostgreSQL database
3. Deploy the backend code

### Frontend

The frontend can be built for production using:

```bash
cd frontend
npm run build
```

This will create a `dist` directory with static files that can be served by any web server or deployed to services like Netlify, Vercel, or AWS S3.

## Admin Access

The system comes with a default admin user:
- Username: admin
- Password: admin123

## License

MIT