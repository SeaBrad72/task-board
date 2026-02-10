# 🎯 Quick Reference Card - REST API Commands

## 🚀 Starting Your Dev Environment

```bash
# Terminal 1: Start Backend (Express API)
cd backend
npm run dev
# Runs on http://localhost:3001

# Terminal 2: Start Frontend (React)
cd /sessions/eager-vibrant-shannon/mnt/Development/task-board
npm run dev
# Runs on http://localhost:3000
```

---

## 🧪 Testing with curl

### Get All Tasks
```bash
curl http://localhost:3001/api/tasks
```

### Create a Task
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn REST APIs",
    "description": "Practice with curl",
    "project": "learning",
    "priority": "high",
    "status": "in-progress"
  }'
```

### Get One Task
```bash
curl http://localhost:3001/api/tasks/TASK_ID_HERE
```

### Update a Task
```bash
curl -X PUT http://localhost:3001/api/tasks/TASK_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "status": "done",
    "priority": "low"
  }'
```

### Delete a Task
```bash
curl -X DELETE http://localhost:3001/api/tasks/TASK_ID_HERE
```

### Pretty Print JSON (with jq)
```bash
curl http://localhost:3001/api/tasks | jq .
```

---

## 🧪 Running Tests

```bash
cd backend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run one specific test
npm test -- --testNamePattern="should return health check"

# Watch mode (re-runs on file changes)
npm test -- --watch
```

---

## 📁 Important File Locations

### Frontend
```
services/taskService.ts          # Makes HTTP requests to backend
src/types/task.ts                # TypeScript interfaces
src/components/TaskInput.tsx     # Where "Add Task" happens
src/components/TaskCard.tsx      # Where "Edit/Delete" happens
```

### Backend
```
backend/src/server.js            # Express app setup
backend/src/routes/tasks.js      # URL routing (maps URLs to functions)
backend/src/controllers/taskController.js  # Request handlers
backend/src/models/Task.js       # Data storage (in-memory Map)
backend/src/tests/api.test.js    # All the tests
```

---

## 🐛 Common Problems & Solutions

### "Address already in use" (Port 3001)
```bash
# Kill the process using port 3001
lsof -ti:3001 | xargs kill -9

# OR use a different port in server.js
const PORT = 3002;  # Change in server.js
```

### Backend not responding
```bash
# Check if it's running
lsof -i:3001

# Check the logs
# Look at the terminal where you ran `npm run dev`
```

### Frontend can't reach backend
```bash
# Make sure both servers are running
# Frontend: http://localhost:3000
# Backend: http://localhost:3001

# Check services/taskService.ts line 20
# Should be: const API_BASE_URL = 'http://localhost:3001';
```

### Tests failing
```bash
# Make sure you're in the backend directory
cd backend

# Install dependencies
npm install

# Run tests
npm test
```

---

## 🔍 Debugging Tips

### See backend logs
Just watch the terminal where `npm run dev` is running!

### See frontend requests
1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform action in UI
4. Click on the request to see details

### Test without UI
Use curl to isolate backend issues

### Check if server is running
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok","timestamp":"..."}
```

---

## 📊 HTTP Status Codes You'll See

| Code | Meaning | When You See It |
|------|---------|-----------------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (created new task) |
| 400 | Bad Request | Validation error (bad data) |
| 404 | Not Found | Task doesn't exist |
| 500 | Server Error | Something broke in backend |

---

## 🎯 Quick Validation Tests

### Test empty title (should fail)
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"","priority":"high"}'
# Expect: 400 error
```

### Test invalid priority (should fail)
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","priority":"super-mega-urgent"}'
# Expect: 400 error
```

### Test valid task (should succeed)
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Valid task","priority":"high","status":"todo"}'
# Expect: 201 success
```

---

## 📝 Pro Tips

1. **Always test with curl first** - It's faster than using the UI for debugging

2. **Read the error messages** - Zod validation errors tell you exactly what's wrong

3. **Check both terminals** - Frontend errors in one, backend errors in the other

4. **Use DevTools Network tab** - Shows you EXACTLY what's being sent/received

5. **Keep tests running** - `npm test -- --watch` gives instant feedback

6. **Pretty print JSON** - Install jq: `brew install jq` (Mac) or `apt install jq` (Linux)

---

## 🎓 Learning Path

1. **Start here:** LEARNING-EXERCISES.md Track 1 (Explore)
2. **Then:** Track 2 (Break things)
3. **Then:** Track 3 (Read tests)
4. **Advanced:** Track 4 (Experiments)
5. **Master:** Track 5 (Teach someone else)

---

## 🆘 When You're Stuck

1. Check if both servers are running
2. Check the terminal logs for errors
3. Check Network tab in DevTools
4. Try the same request with curl
5. Look at the test file for examples
6. Read the error message carefully
7. Google the error (it's how pros learn!)

---

**Remember:** Breaking things is how you learn. Everything here can be fixed with `git reset --hard` if needed!
