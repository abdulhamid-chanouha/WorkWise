The server folder holds the entire backend application, this is a placeholder readme. update as you go.
# Server

## Setup

### Install dependencies
npm install

### Environment variables
Copy .env.example to .env and fill in the values.

### Database

Run migrations:
npx prisma migrate dev --name <migration-name>

Generate Prisma client:
npx prisma generate

Seed the database:
npm run db:seed

Reset and reseed:
npm run db:reset

View database:
npx prisma studio

### Run the server
npm run dev