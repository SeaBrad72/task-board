# 🎓 Day 7 Learning Exercises - Understanding REST APIs

## 🎯 Goal
Build deep understanding of how frontend and backend communicate through hands-on experimentation.

---

## 📚 Exercise Track 1: Explore the Current System

### Exercise 1.1: Read the Logs (15 min)
**What you'll learn:** How to see what the server is actually doing

1. **Start backend with verbose logging:**
   ```bash
   cd backend
   npm run dev
   ```

2. **In another terminal, make requests and watch the logs:**
   ```bash
   # Get all tasks
   curl http://localhost:3001/api/tasks

   # Create a task
   curl -X POST http://localhost:3001/api/tasks \
     -H "Content-Type: application/json" \
     -d '{"title":"My first API call","priority":"high","status":"todo"}'

   # Get that task (copy the ID from response)
   curl http://localhost:3001/api/tasks/YOUR_ID_HERE
   ```

3. **Watch the backend terminal** - you should see each request logged

**Questions to answer:**
- What status code does GET return? POST?
- What happens if you send invalid data?
- What does the backend log when a request comes in?

---

### Exercise 1.2: Browser DevTools Hunt (20 min)
**What you'll learn:** How to debug frontend-backend communication

1. **Start both servers:**
   ```bash
   # Terminal 1
   cd backend && npm run dev

   # Terminal 2
   cd .. && npm run dev
   ```

2. **Open browser to http://localhost:3000**

3. **Open DevTools (F12) → Network tab**

4. **Perform these actions and observe:**
   - Refresh page → See `GET /api/tasks`
   - Add a task → See `POST /api/tasks`
   - Edit a task → See `PUT /api/tasks/:id`
   - Delete a task → See `DELETE /api/tasks/:id`

5. **For each request, click on it and examine:**
   - **Headers tab:** What HTTP method? What headers are sent?
   - **Payload tab:** What JSON did frontend send?
   - **Response tab:** What JSON did backend return?
   - **Timing tab:** How long did the request take?

**Challenge:** Make a task fail validation. What status code do you see? What error message?

---

### Exercise 1.3: The 5-File Treasure Hunt (30 min)
**What you'll learn:** How the code flows from frontend → backend

**Your mission:** Trace a single operation (CREATE TASK) through every file

1. **Start here:** `src/components/TaskInput.tsx`
   - Find where the "Add Task" button is clicked
   - What function gets called?
   - Write down: "Step 1: User clicks button → calls `handleSubmit()`"

2. **Follow the trail:** `services/taskService.ts`
   - What method does TaskInput call?
   - What URL does it fetch?
   - What HTTP method?
   - Write down: "Step 2: Calls `taskService.createTask()` → POST to http://localhost:3001/api/tasks"

3. **Jump to backend:** `backend/src/routes/tasks.js`
   - What line catches `POST /` ?
   - What controller function gets called?
   - Write down: "Step 3: Route matches POST / → calls `taskController.createTask`"

4. **Business logic:** `backend/src/controllers/taskController.js`
   - What does `createTask()` do first? (Hint: validation)
   - Then what? (Hint: calls model)
   - Write down: "Step 4: Validates with Zod → calls `taskModel.create()`"

5. **Data layer:** `backend/src/models/Task.js`
   - How does `create()` generate an ID?
   - Where does it store the task?
   - What does it return?
   - Write down: "Step 5: Generates UUID → stores in Map → returns task object"

**Final challenge:** Draw a diagram of this flow on paper!

---

## 🔧 Exercise Track 2: Break Things (Then Fix Them)

### Exercise 2.1: The Validation Detective (20 min)
**What you'll learn:** How validation protects your API

1. **Try to break the API with bad data:**
   ```bash
   # Empty title
   curl -X POST http://localhost:3001/api/tasks \
     -H "Content-Type: application/json" \
     -d '{"title":"","priority":"high"}'

   # Invalid priority
   curl -X POST http://localhost:3001/api/tasks \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","priority":"super-urgent"}'

   # Invalid status
   curl -X POST http://localhost:3001/api/tasks \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","status":"maybe-later"}'

   # Missing required field
   curl -X POST http://localhost:3001/api/tasks \
     -H "Content-Type: application/json" \
     -d '{"priority":"high"}'
   ```

2. **For each error, examine:**
   - What HTTP status code? (Hint: should be 400)
   - What's in the `errors` array?
   - What field caused the problem?

**Open:** `backend/src/models/Task.js`
- Find the Zod schema (line 14-22)
- Can you read the validation rules?

---

### Exercise 2.2: Add a New Field (45 min)
**What you'll learn:** How to modify the entire stack

**Task:** Add a `tags` field (array of strings) to tasks

**Step-by-step:**

1. **Backend Model** (`backend/src/models/Task.js`)
   ```javascript
   // Add to TaskSchema around line 21
   tags: z.array(z.string()).default([])
   ```

2. **Test it with curl:**
   ```bash
   curl -X POST http://localhost:3001/api/tasks \
     -H "Content-Type: application/json" \
     -d '{"title":"Tagged task","tags":["urgent","frontend"]}'
   ```

   Did it work? Can you see tags in the response?

3. **Frontend Type** (`src/types/task.ts`)
   - Add `tags?: string[]` to the Task interface

4. **Frontend Service** (`services/taskService.ts`)
   - Add `tags: z.array(z.string()).optional()` to CreateTaskSchema

5. **Test in UI:**
   - Start both servers
   - Try to create a task
   - Does it still work?

**Bonus:** Add a tags input field to the UI!

---

### Exercise 2.3: The Great Data Loss (10 min)
**What you'll learn:** Why we need a database

1. **Create some tasks via the UI**
2. **Stop the backend server** (Ctrl+C)
3. **Restart the backend**
4. **Refresh the frontend**

**What happened to your tasks?** Why?

**Where to look:**
- `backend/src/models/Task.js` line 34 - what is `this.tasks`?
- Line 38-51 - what happens in `_initializeSeedData()`?

---

## 📖 Exercise Track 3: Read the Tests

### Exercise 3.1: Test Reader (30 min)
**What you'll learn:** How professional APIs are tested

**Open:** `backend/src/tests/api.test.js`

1. **Read the first test** (line ~20-30)
   ```javascript
   it('should return health check', async () => { ... })
   ```
   - What URL is being tested?
   - What do we expect the response to contain?
   - What status code should it return?

2. **Find the "create task" test** (~line 60-80)
   - What data is being sent?
   - What status code means success? (201)
   - What properties do we check in the response?

3. **Find a validation test** (~line 180-200)
   - What invalid data is being sent?
   - What status code means validation failed? (400)
   - What error message do we expect?

**Challenge:** Pick one test, read it carefully, then run JUST that test:
```bash
cd backend
npm test -- --testNamePattern="should return health check"
```

---

### Exercise 3.2: Write Your Own Test (45 min)
**What you'll learn:** How to write API tests

**Task:** Write a test for updating a task's priority

1. **Open:** `backend/src/tests/api.test.js`

2. **Find the "UPDATE /api/tasks/:id" section** (~line 250)

3. **Add this new test:**
   ```javascript
   it('should update task priority', async () => {
     // TODO: Create a task first
     // TODO: Update its priority from 'medium' to 'urgent'
     // TODO: Check response status is 200
     // TODO: Check response has updated priority
     // TODO: Verify with GET that it was really updated
   });
   ```

4. **Fill in the TODOs** - look at other tests for examples!

5. **Run your test:**
   ```bash
   npm test -- --testNamePattern="should update task priority"
   ```

---

## 🧪 Exercise Track 4: Experiments

### Exercise 4.1: Break the URL (15 min)
**What you'll learn:** How routing works

**In** `backend/src/routes/tasks.js`:

1. **Change line 10 from:**
   ```javascript
   router.post('/', taskController.createTask);
   ```

   **To:**
   ```javascript
   router.post('/new', taskController.createTask);
   ```

2. **Restart backend**

3. **Try to create a task in the UI**
   - What happens?
   - Check Network tab - what error do you see?

4. **Fix it** - what else needs to change? (Hint: check `taskService.ts`)

5. **Undo your changes** to get back to working state

---

### Exercise 4.2: Change the Port (15 min)
**What you'll learn:** How frontend and backend connect

1. **In** `backend/src/server.js` line ~35:
   ```javascript
   const PORT = 3002;  // Changed from 3001
   ```

2. **Restart backend** - it now runs on port 3002

3. **Try to use the UI** - it breaks! Why?

4. **In** `services/taskService.ts` line 20:
   ```javascript
   const API_BASE_URL = 'http://localhost:3002';
   ```

5. **Restart frontend** - it works again!

**Question:** What happens if frontend and backend run on different ports? (CORS - that's Day 8!)

---

### Exercise 4.3: Make It Persistent (60 min - ADVANCED)
**What you'll learn:** Why databases exist

**Challenge:** Make the in-memory storage survive server restarts

**Hint:** Use Node's `fs` module to save/load the Map to a JSON file

**Files to modify:**
1. `backend/src/models/Task.js`
   - In `create()` - also save to file
   - In `update()` - also save to file
   - In `delete()` - also save to file
   - In `constructor()` - load from file if exists

**Starter code:**
```javascript
import fs from 'fs';

// In constructor
constructor() {
  this.tasks = new Map();
  this._loadFromFile();  // Load saved tasks
}

_loadFromFile() {
  try {
    const data = fs.readFileSync('./tasks.json', 'utf-8');
    const tasks = JSON.parse(data);
    tasks.forEach(task => this.tasks.set(task.id, task));
  } catch (err) {
    // File doesn't exist yet, that's ok
  }
}

_saveToFile() {
  const tasks = Array.from(this.tasks.values());
  fs.writeFileSync('./tasks.json', JSON.stringify(tasks, null, 2));
}
```

**Test:** Create tasks, restart server, check if they're still there!

---

## 🎯 Exercise Track 5: Conceptual Understanding

### Exercise 5.1: Explain It to a Friend (15 min)
**What you'll learn:** If you truly understand it

**Imagine explaining to someone who's never coded:**

Write answers to these questions in your own words:

1. **What is a REST API?**
   - (Don't copy from Google - use your own words!)

2. **Why do we need a backend?**
   - (Why not just use localStorage?)

3. **What does "in-memory storage" mean?**
   - (Use an analogy!)

4. **What happens when you click "Add Task"?**
   - (Describe the full journey of data)

5. **What's the difference between GET, POST, PUT, DELETE?**
   - (Give real examples from your app)

---

### Exercise 5.2: Draw the Architecture (20 min)
**What you'll learn:** The big picture

**Draw on paper:**

1. **Two boxes:** Frontend and Backend
2. **Draw arrows** for each API call
3. **Label each arrow** with: HTTP method, URL, what data flows

**Example:**
```
Frontend                        Backend
[TaskInput.tsx] ----POST /api/tasks----> [taskController.js]
                    {title: "..."}
                <-----200 OK--------------
                    {id: "...", ...}
```

**Draw all 5 operations:** GET all, POST create, GET by id, PUT update, DELETE

---

### Exercise 5.3: Compare Storage Methods (15 min)
**What you'll learn:** Why architecture matters

**Make a table comparing:**

| Feature | localStorage | In-Memory Map | Database (future) |
|---------|--------------|---------------|-------------------|
| Where stored? | | | |
| Survives page refresh? | | | |
| Survives server restart? | | | |
| Multiple users share data? | | | |
| Good for production? | | | |

**Fill it out based on what you've learned!**

---

## 📝 Daily Practice Ideas

### Week-long Mini Projects

**Monday:** Add a `notes` field to tasks (string)
**Tuesday:** Add a `completedAt` timestamp (only set when status becomes "done")
**Wednesday:** Add an endpoint `GET /api/tasks/priority/:priority` (get all high priority tasks)
**Thursday:** Add request logging middleware (log every API call)
**Friday:** Add a `PATCH /api/tasks/:id` endpoint (partial updates)
**Saturday:** Write tests for everything you added this week
**Sunday:** Document your changes in a personal learning journal

---

## 🎓 How to Know You've Mastered It

You can confidently say you understand Day 7 when you can:

✅ Explain what happens when you click a button in the UI
✅ Trace a request from React → Express → Model and back
✅ Read and understand the test file
✅ Add a new field to the entire stack (frontend + backend)
✅ Use curl to test endpoints without the UI
✅ Read the Network tab in DevTools
✅ Explain why in-memory storage is temporary
✅ Write a simple test for a new endpoint

---

## 🚀 Ready for More?

When you've done these exercises, you'll be ready for:
- **Day 8:** PostgreSQL database + Prisma ORM
- **Day 9:** Authentication + JWT tokens
- **Day 10:** Deployment to Vercel

**Remember:** The best way to learn is to break things, fix them, and understand WHY they broke!
