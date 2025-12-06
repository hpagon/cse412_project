# MyASU Backend

Node.js/Express backend with PostgreSQL database for the MyASU student portal.

## Prerequisites

- Node.js (v18+)
- PostgreSQL 18 installed and running

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create the Database

Open PostgreSQL and create the database:

```bash
psql -U postgres
```

```sql
CREATE DATABASE phase2db;
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update with your PostgreSQL credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=phase2db
DB_USER=postgres
DB_PASSWORD=your_password_here
PORT=3000
```

### 4. Initialize Database Schema

```bash
npm run db:init
```

### 5. Load Sample Data

Run the data loading script via psql:

```bash
psql -U postgres -d phase2db -f db/load_data.sql
```

Or manually in psql:

```sql
\c phase2db
\i db/load_data.sql
```

### 6. Start the Server

Development mode (auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Server runs at `http://localhost:3000`
