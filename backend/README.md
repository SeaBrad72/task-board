# Task Board REST API

RESTful API backend for the Task Board application built with Express.js.

## Features

✅ **RESTful API Design** - HTTP methods, proper status codes, JSON responses
✅ **Data Persistence** - JSON file storage (survives server restarts)
✅ **Async Operations** - Full async/await pattern for all data operations
✅ **Input Validation** - Zod schema validation for all requests
✅ **Error Handling** - Consistent error responses with detailed messages
✅ **CORS Support** - Cross-origin requests enabled
✅ **Security** - Helmet.js for security headers
✅ **Logging** - Morgan HTTP request logger
✅ **Testing** - 28 tests passing, 86.99% coverage with Jest and Supertest

## API Endpoints

### Base URL
```
http://localhost:3001
```

### Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-02-10T12:00:00.000Z"
}
```

### Get All Tasks
```
GET /api/tasks
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Complete Day 7",
      "completed": false,
      "priority": "high",
      "tags": ["bootcamp", "backend"],
      "dueDate": null,
      "createdAt": "2024-02-10T12:00:00.000Z",
      "updatedAt": "2024-02-10T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

### Get Single Task
```
GET /api/tasks/:id
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Complete Day 7",
    "completed": false,
    "priority": "high",
    "tags": ["bootcamp", "backend"],
    "dueDate": null,
    "createdAt": "2024-02-10T12:00:00.000Z",
    "updatedAt": "2024-02-10T12:00:00.000Z"
  }
}
```

### Create Task
```
POST /api/tasks
Content-Type: application/json

{
  "title": "New Task",
  "priority": "medium",
  "tags": ["work"],
  "dueDate": "2024-02-15T00:00:00.000Z"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "New Task",
    "completed": false,
    "priority": "medium",
    "tags": ["work"],
    "dueDate": "2024-02-15T00:00:00.000Z",
    "createdAt": "2024-02-10T12:00:00.000Z",
    "updatedAt": "2024-02-10T12:00:00.000Z"
  },
  "message": "Task created successfully"
}
```

### Update Task
```
PUT /api/tasks/:id
Content-Type: application/json

{
  "completed": true,
  "priority": "low"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "New Task",
    "completed": true,
    "priority": "low",
    "tags": ["work"],
    "dueDate": "2024-02-15T00:00:00.000Z",
    "createdAt": "2024-02-10T12:00:00.000Z",
    "updatedAt": "2024-02-10T12:15:00.000Z"
  },
  "message": "Task updated successfully"
}
```

### Delete Task
```
DELETE /api/tasks/:id
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "New Task",
    "completed": true,
    "priority": "low",
    "tags": ["work"],
    "dueDate": "2024-02-15T00:00:00.000Z",
    "createdAt": "2024-02-10T12:00:00.000Z",
    "updatedAt": "2024-02-10T12:15:00.000Z"
  },
  "message": "Task deleted successfully"
}
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "ErrorName",
  "message": "Human-readable error message",
  "errors": [] // Optional: validation errors array
}
```

### Status Codes

- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation error
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Validation Rules

### Task Schema
```typescript
{
  title: string (required, 1-200 characters)
  completed: boolean (default: false)
  priority: 'low' | 'medium' | 'high' (default: 'medium')
  tags: string[] (default: [])
  dueDate: ISO datetime string | null (optional)
}
```

## Installation & Usage

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Start production server
npm start
```

## Environment Variables

Create a `.env` file in the backend directory (see `.env.example`):

```env
# Server configuration
PORT=3001
NODE_ENV=development

# Database (for future PostgreSQL migration)
DATABASE_URL="file:./dev.db"
```

## Technology Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Validation:** Zod
- **Security:** Helmet.js, CORS
- **Logging:** Morgan
- **Testing:** Jest, Supertest
- **Storage:** File-based JSON persistence (ready for PostgreSQL migration)
- **Async Patterns:** Full async/await with Node.js fs.promises

## Day 8 Completed ✅

- [x] Data persistence (file-based JSON storage)
- [x] Async/await patterns throughout codebase
- [x] All tests updated for async operations
- [x] Data survives server restarts

## Next Steps (Day 9+)

- [ ] Frontend integration with React
- [ ] Deploy backend to Vercel serverless functions
- [ ] Upgrade to Vercel Postgres (Prisma migration ready)
- [ ] Add user authentication (JWT)
- [ ] Multi-user support with data isolation
- [ ] Phase 1.5: Task editing, soft deletes, keyboard shortcuts

## Architecture

```
backend/
├── src/
│   ├── controllers/      # Request handlers (async)
│   ├── middleware/       # Express middleware
│   ├── models/          # Data models & validation (async)
│   ├── routes/          # API route definitions
│   ├── utils/           # Error classes & utilities
│   ├── tests/           # Test files (28 tests)
│   └── server.js        # Express app setup
├── data/
│   └── tasks.json       # Persisted task data
├── prisma/
│   └── schema.prisma    # Database schema (future migration)
├── .env                 # Environment variables (gitignored)
├── .env.example         # Environment template
├── package.json
├── jest.config.js
└── README.md
```

---

**Day 8 of 28-Day Full-Stack Bootcamp** 🚀

**Status:** Backend complete with data persistence! Ready for frontend integration and deployment.
