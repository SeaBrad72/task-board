# Vercel Postgres Setup Guide

## Environment Variables

### Local Development (.env)
```env
# Local PostgreSQL (Docker)
DATABASE_URL="postgresql://taskboard_user:taskboard_dev_password@localhost:5432/taskboard_dev"
PORT=3001
NODE_ENV=development
```

### Production (Vercel) (.env.production)
```env
# Vercel Postgres (get from Vercel dashboard)
DATABASE_URL="${POSTGRES_URL}"
PORT=3001
NODE_ENV=production
```

## Running Migrations on Vercel Postgres

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Link Your Project
```bash
cd /Users/bradleyjames/Development/task-board/backend
vercel link
```

### Step 4: Pull Environment Variables
```bash
vercel env pull .env.production
```

This downloads your Vercel Postgres connection strings locally.

### Step 5: Run Migration on Production Database
```bash
# Use the NON_POOLING URL for migrations
DATABASE_URL="<POSTGRES_URL_NON_POOLING from Vercel>" npx prisma migrate deploy
```

**OR** if you pulled env vars:
```bash
npx dotenv -e .env.production -- npx prisma migrate deploy
```

## Verify Production Database

### Option 1: Using Prisma Studio
```bash
DATABASE_URL="<POSTGRES_URL from Vercel>" npx prisma studio
```

### Option 2: Using verify-db.js
```bash
DATABASE_URL="<POSTGRES_URL from Vercel>" node verify-db.js
```

## Next Steps

1. ✅ Vercel Postgres created
2. ✅ Migrations run on production database
3. ⏭️ Deploy Express backend to Railway
4. ⏭️ Update frontend to connect to production API
