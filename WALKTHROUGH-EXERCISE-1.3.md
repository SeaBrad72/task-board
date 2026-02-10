# Exercise 1.3 Walkthrough: The 5-File Treasure Hunt

## 🎯 What You Just Learned

You traced a **CREATE TASK** request through your entire application stack!

---

## 📝 The Complete Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: Frontend Component (QuickCapture.tsx)              │
│  Line 48: taskService.createTask({ title, project, ... })   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: Frontend Service (taskService.ts)                  │
│  Lines 85-90:                                                │
│    fetch('http://localhost:3001/api/tasks', {               │
│      method: 'POST',                                         │
│      body: JSON.stringify(validated)                         │
│    })                                                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
              ╔═══════════════════════════╗
              ║   HTTP Request Over Wire   ║
              ║   POST /api/tasks          ║
              ║   Content-Type: JSON       ║
              ╚═══════════════════════════╝
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: Backend Router (backend/src/routes/tasks.js)       │
│  Line 13: router.post('/', taskController.createTask)       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: Controller (backend/src/controllers/taskController.js) │
│  Lines 42-45:                                                │
│    1. TaskSchema.parse(req.body)  ← Validate with Zod       │
│    2. taskModel.create(validatedData)  ← Create in DB       │
│    3. res.status(201).json({ data: task })  ← Send response │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 5: Model (backend/src/models/Task.js)                 │
│  Lines 42-51:                                                │
│    1. id: uuidv4()  ← Generate unique ID                    │
│    2. this.tasks.set(id, task)  ← Store in Map              │
│    3. return task  ← Return created task                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
              ╔═══════════════════════════╗
              ║  HTTP Response Over Wire   ║
              ║  Status: 201 Created       ║
              ║  Body: { success, data }   ║
              ╚═══════════════════════════╝
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  BACK TO: Frontend Service (taskService.ts)                 │
│  Line 93-94: Parse response, return task to component       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  BACK TO: Component (QuickCapture.tsx)                      │
│  Line 57: onTaskCreated(task)  ← Update UI                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  USER SEES NEW TASK! ✅                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Key Files Reference

| File | Location | Purpose |
|------|----------|---------|
| **QuickCapture.tsx** | `components/QuickCapture.tsx` | User interface - form and submit handler |
| **taskService.ts** | `services/taskService.ts` | API client - makes HTTP requests |
| **tasks.js** | `backend/src/routes/tasks.js` | Route definitions - maps URLs to controllers |
| **taskController.js** | `backend/src/controllers/taskController.js` | Business logic - validates and orchestrates |
| **Task.js** | `backend/src/models/Task.js` | Data layer - stores and retrieves tasks |

---

## 🧪 Try It In DevTools

### Step-by-Step Instructions:

1. **Start both servers:**
   ```bash
   # Terminal 1: Frontend
   npm run dev

   # Terminal 2: Backend
   cd backend && npm run dev
   ```

2. **Open your browser:** http://localhost:3000

3. **Open DevTools:** Press `F12` or right-click → Inspect

4. **Go to Network tab:** Click "Network" at the top

5. **Filter for API calls:** Type "tasks" in the filter box

6. **Add a task:** Fill out the Quick Add form and click submit

7. **Click on the `tasks` request** that appears

8. **Examine each tab:**
   - **Headers:** See `POST`, `http://localhost:3001/api/tasks`
   - **Payload:** See the JSON you sent `{ title: "...", priority: "high", ... }`
   - **Response:** See the task that came back with `id`, `createdAt`, etc.
   - **Timing:** See how fast it was (should be <100ms)

---

## 📊 Data Transformations

Watch how the data changes as it flows through the system:

### Input (from user form):
```javascript
{
  title: "Learn REST APIs",
  project: "personal",
  priority: "high",
  status: "todo"
}
```

### After Model adds metadata:
```javascript
{
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",  // ← Added by uuidv4()
  title: "Learn REST APIs",
  project: "personal",
  priority: "high",
  status: "todo",
  createdAt: "2026-02-10T03:30:00.123Z",        // ← Added by model
  updatedAt: "2026-02-10T03:30:00.123Z"         // ← Added by model
}
```

### After Controller wraps it:
```javascript
{
  success: true,                                // ← Added by controller
  data: {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    title: "Learn REST APIs",
    project: "personal",
    priority: "high",
    status: "todo",
    createdAt: "2026-02-10T03:30:00.123Z",
    updatedAt: "2026-02-10T03:30:00.123Z"
  },
  message: "Task created successfully"          // ← Added by controller
}
```

---

## 🎯 Challenge Questions

Now that you've seen the flow, test your understanding:

### Q1: What happens if you send an invalid priority?
<details>
<summary>Click to reveal answer</summary>

- **Where it fails:** `taskController.js` line 42 (Zod validation)
- **What happens:** `TaskSchema.parse()` throws a ZodError
- **Response:** 400 Bad Request with error details
- **Try it:**
  ```bash
  curl -X POST http://localhost:3001/api/tasks \
    -H "Content-Type: application/json" \
    -d '{"title":"Test","priority":"super-urgent"}'
  ```
</details>

### Q2: Where is the task ID generated?
<details>
<summary>Click to reveal answer</summary>

- **File:** `backend/src/models/Task.js`
- **Line:** 44
- **Function:** `uuidv4()` from the `uuid` package
- **Format:** "a1b2c3d4-e5f6-7890-abcd-ef1234567890" (UUID v4)
</details>

### Q3: What HTTP status code means "successfully created"?
<details>
<summary>Click to reveal answer</summary>

- **Status Code:** 201 Created
- **Where set:** `taskController.js` line 47
- **Why 201 not 200:**
  - 200 = "OK, here's the data you requested"
  - 201 = "OK, I created something new for you"
</details>

### Q4: Where does the data live after creation?
<details>
<summary>Click to reveal answer</summary>

- **Location:** In-memory JavaScript `Map` object
- **File:** `backend/src/models/Task.js` line 34
- **Storage:** `this.tasks = new Map()`
- **Persistence:** ❌ Data lost when server restarts
- **Day 8:** Will migrate to PostgreSQL database for persistence
</details>

---

## 🚀 Next Steps

### You've completed the 5-File Treasure Hunt! 🎉

**What you learned:**
- ✅ How frontend and backend communicate
- ✅ What MVC (Model-View-Controller) architecture looks like
- ✅ How validation protects your API
- ✅ Where data lives in memory

**Continue learning:**
- Try **Exercise 2.1:** Break the API with invalid data
- Try **Exercise 2.2:** Add a new field to the entire stack
- Try **Exercise 3.1:** Read the test file to see all edge cases
- Try **Exercise 4.3:** Make the data persist to a file (ADVANCED)

---

## 📚 Glossary

- **Frontend:** Code that runs in the browser (React components)
- **Backend:** Code that runs on the server (Express.js API)
- **API Endpoint:** A URL that accepts requests (e.g., `POST /api/tasks`)
- **Controller:** Handles business logic and orchestration
- **Model:** Manages data storage and retrieval
- **Validation:** Checking data is correct before processing
- **Zod:** Runtime validation library (like TypeScript but at runtime)
- **UUID:** Universally Unique Identifier (random ID generator)
- **Map:** JavaScript data structure for key-value storage (faster than arrays)

---

**Exercise Complete!** ✅
**Time to complete:** ~30 minutes
**Difficulty:** Beginner-friendly
**Next:** Try Exercise 2.1 to learn by breaking things!
