# 🐳 Docker + PostgreSQL Setup Guide

## What We're Setting Up

Replacing file-based JSON storage with **PostgreSQL + Prisma** for production-ready data persistence.

## ✅ Prerequisites Checklist

- [x] Docker Desktop installed on Mac
- [x] Docker running (check Docker Desktop icon in menu bar)
- [x] Terminal open

---

## 📋 Step-by-Step Instructions

### Step 1: Navigate to Project Directory

Open your terminal and go to the task-board project:

```bash
cd ~/Development/task-board
```

### Step 2: Start PostgreSQL Container

Start the PostgreSQL database using Docker Compose:

```bash
docker compose up -d
```

**What this does:**
- Downloads PostgreSQL 15 Alpine image (lightweight)
- Creates a container named `taskboard-postgres`
- Starts PostgreSQL on port 5432
- Creates volume `postgres_data` for persistent storage
- Runs in detached mode (`-d` = background)

**Expected output:**
```
[+] Running 2/2
 ✔ Network task-board_default       Created
 ✔ Container taskboard-postgres     Started
```

### Step 3: Verify Container is Running

```bash
docker compose ps
```

**Expected output:**
```
NAME                  IMAGE              STATUS         PORTS
taskboard-postgres    postgres:15-alpine Up X seconds   0.0.0.0:5432->5432/tcp
```

✅ Status should be "Up" (healthy)

### Step 4: Check PostgreSQL Logs (Optional)

```bash
docker compose logs postgres
```

You should see:
```
database system is ready to accept connections
```

---

## 🎯 What's Next (I'll Handle)

Once your Docker container is running, tell me and I'll:

1. ✅ Install Prisma dependencies
2. ✅ Generate Prisma Client
3. ✅ Run migrations to create the `Task` table
4. ✅ Migrate the Task model to use Prisma ORM
5. ✅ Update all tests
6. ✅ Verify everything works

---

## 🔍 Useful Docker Commands

### View container logs
```bash
docker compose logs -f postgres
```
(Press Ctrl+C to exit)

### Stop the database
```bash
docker compose stop
```

### Start the database (if stopped)
```bash
docker compose start
```

### Restart the database
```bash
docker compose restart
```

### Stop and remove container (keeps data)
```bash
docker compose down
```

### Stop and **delete all data** (nuclear option ⚠️)
```bash
docker compose down -v
```

### Connect to PostgreSQL directly
```bash
docker compose exec postgres psql -U taskboard_user -d taskboard_dev
```

Once connected, try:
```sql
\dt              -- List tables
\d tasks         -- Describe tasks table (after migration)
SELECT * FROM "Task";  -- Query tasks
\q               -- Quit
```

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Docker configuration for PostgreSQL |
| `backend/.env` | Database connection URL |
| `backend/prisma/schema.prisma` | Updated to use PostgreSQL |

---

## 🔐 Database Credentials

**Connection Details** (from `docker-compose.yml`):
- **Host:** localhost
- **Port:** 5432
- **Database:** taskboard_dev
- **User:** taskboard_user
- **Password:** taskboard_dev_password

**Connection String:**
```
postgresql://taskboard_user:taskboard_dev_password@localhost:5432/taskboard_dev
```

⚠️ **Note:** These are development credentials only. Never use in production!

---

## ❓ Troubleshooting

### Port 5432 already in use
If you have another PostgreSQL instance running:
```bash
# macOS - stop local PostgreSQL
brew services stop postgresql

# Or change port in docker-compose.yml:
# ports:
#   - "5433:5432"  # Use 5433 instead
```

### Container won't start
```bash
# Check detailed logs
docker compose logs

# Remove and recreate
docker compose down
docker compose up -d
```

### Can't connect from Node.js
1. Verify container is running: `docker compose ps`
2. Check logs: `docker compose logs postgres`
3. Test connection: `docker compose exec postgres pg_isready`

---

## 🚀 Ready?

Once you've run `docker compose up -d` successfully, let me know and I'll continue with the Prisma setup!
