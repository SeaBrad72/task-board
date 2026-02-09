# ADR-003: Data Layer Abstraction Pattern

**Date:** 2026-02-09
**Status:** Accepted
**Deciders:** Bradley James, Claude (Phase 1 architecture design)

## Context

Building a task board with localStorage in Phase 1, but planning to add backend API in Phase 2. Need to decide how to structure data access to minimize refactoring when switching storage implementations.

**Key Requirements:**
1. Phase 1 uses localStorage (no backend)
2. Phase 2 will add backend API
3. Want to avoid rewriting UI components when changing storage
4. Need clean separation of concerns

## Decision

**Implement a data layer abstraction via `TaskService` class**

Create a service layer that abstracts storage implementation details from UI components. Components call `taskService.getTasks()` without knowing if it uses localStorage, API, or something else.

## Architecture

```typescript
// services/taskService.ts
class TaskService {
  async getTasks(): Promise<Task[]> {
    // Phase 1: localStorage implementation
    // Phase 2: Swap to fetch('/api/tasks')
  }

  async createTask(input): Promise<Task> { ... }
  async updateTask(id, updates): Promise<Task> { ... }
  async deleteTask(id): Promise<void> { ... }
}

export const taskService = new TaskService();
```

**UI Components:**
```typescript
// app/page.tsx
async function loadTasks() {
  const tasks = await taskService.getTasks(); // No knowledge of storage
  setTasks(tasks);
}
```

## Alternatives Considered

### Option A: Direct localStorage calls in components
```typescript
// Component directly accessing localStorage
const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
```

**Pros:**
- Simpler initially
- No abstraction overhead
- Fewer files

**Cons:**
- ❌ Storage logic scattered across components
- ❌ Hard to test (localStorage in components)
- ❌ Phase 2 requires rewriting every component
- ❌ No validation or error handling layer
- ❌ Difficult to add features (caching, offline sync)

**Decision:** Rejected (creates technical debt)

### Option B: Data Layer Abstraction (Chosen)
```typescript
// Service layer abstracts storage
const tasks = await taskService.getTasks();
```

**Pros:**
- ✅ **Phase 2 migration is trivial** (swap service implementation only)
- ✅ Clean separation of concerns
- ✅ Easy to test (mock taskService)
- ✅ Single place for validation (Zod schemas)
- ✅ Centralized error handling
- ✅ Can add caching, offline support later

**Cons:**
- Slightly more code upfront
- One extra layer of abstraction

**Decision:** Accepted

### Option C: React Query / SWR
**Pros:**
- Built-in caching, revalidation
- Server state management

**Cons:**
- Overkill for Phase 1 (no server)
- Extra dependency
- Learning curve

**Decision:** Rejected for Phase 1 (consider for Phase 2)

## Implementation Details

### Phase 1 (localStorage):
```typescript
class TaskService {
  private STORAGE_KEY = 'task-board-tasks';

  async getTasks(): Promise<Task[]> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored).map(this.deserializeTask);
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    const validated = CreateTaskSchema.parse(input); // Zod validation
    const task = { id: crypto.randomUUID(), ...validated, ... };
    const tasks = await this.getTasks();
    tasks.push(task);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    return task;
  }
}
```

### Phase 2 (API):
```typescript
class TaskService {
  async getTasks(): Promise<Task[]> {
    const response = await fetch('/api/tasks');
    return response.json(); // Same return type!
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    const validated = CreateTaskSchema.parse(input); // Same validation!
    const response = await fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(validated),
    });
    return response.json();
  }
}
```

**Components don't change at all** - they still call `taskService.getTasks()`!

## Consequences

### Positive
- ✅ **Zero UI component changes** needed for Phase 2
- ✅ Easy to test (mock taskService in tests)
- ✅ Centralized validation with Zod
- ✅ Type-safe with TypeScript
- ✅ Can swap storage implementations freely
- ✅ Easier to add features (caching, optimistic updates)

### Negative
- ⚠️ Slightly more upfront code (extra service layer)
- ⚠️ Async even when not needed (localStorage is sync)

### Neutral
- Dynamic imports avoid SSR issues (`await import('./taskService')`)
- All business logic in one place
- Consistent API surface across phases

## Migration Path to Phase 2

**Step 1:** Add API routes
```typescript
// app/api/tasks/route.ts
export async function GET() {
  const tasks = await db.query('SELECT * FROM tasks');
  return Response.json(tasks);
}
```

**Step 2:** Update TaskService (one file!)
```typescript
- const stored = localStorage.getItem(this.STORAGE_KEY);
+ const response = await fetch('/api/tasks');
+ const tasks = await response.json();
```

**Step 3:** Done! UI components work unchanged.

## Follow-Up Actions

- [x] Implement TaskService with localStorage
- [x] Use Zod for input validation
- [x] Write unit tests for TaskService
- [ ] **Phase 2:** Swap to API endpoints
- [ ] **Phase 2:** Add authentication to TaskService
- [ ] **Phase 3:** Add caching layer (React Query or SWR)
- [ ] **Phase 3:** Optimistic UI updates

## Lessons Learned

**Design for change from the start:**
Even though Phase 1 only needs localStorage, designing for the known Phase 2 requirement (API backend) saved future refactoring work. The small upfront cost of abstraction pays dividends later.

**Separation of concerns:**
Keeping storage logic separate from UI logic made components cleaner, more testable, and easier to reason about.

## Related ADRs

- [ADR-001: React & Next.js Choice](./001-react-nextjs-choice.md)
- [ADR-002: Tailwind CSS v3](./002-tailwind-v3-choice.md)

## References

- [Zod validation schemas](../../utils/validation.ts)
- [TaskService implementation](../../services/taskService.ts)
- [TaskService tests](../../services/__tests__/taskService.test.ts)
