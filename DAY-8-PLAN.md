# Day 8 Plan: PostgreSQL + Prisma Integration

**Date:** February 10, 2026
**Goal:** Replace in-memory storage with PostgreSQL database using Prisma ORM
**Estimated Time:** 3-4 hours

---

## 🎯 Success Criteria

### Must Have
- [ ] PostgreSQL database running locally
- [ ] Prisma schema matching our Task model
- [ ] Database migrations working
- [ ] All 6 API endpoints work with database
- [ ] All 28 tests passing (updated for database)
- [ ] 90%+ test coverage maintained
- [ ] Data persists across server restarts

### Should Have
- [ ] Database seeding script
- [ ] Connection pooling configured
- [ ] Environment variables for database URL
- [ ] Error handling for database failures
- [ ] Database indexes for performance

### Nice to Have
- [ ] Vercel deployment with remote PostgreSQL
- [ ] Database backup/restore instructions
- [ ] Performance benchmarks (API response times)

---

## 🗺️ Implementation Phases

### Phase 1: Setup PostgreSQL & Prisma (30 min)
**Goal:** Get database tools installed and configured

**Tasks:**
1. Install PostgreSQL locally
2. Install Prisma CLI and dependencies
3. Initialize Prisma in backend folder
4. Configure database connection string
5. Verify connection to database

**Files Created:**
- `backend/prisma/schema.prisma` - Database schema definition
- `backend/.env` - Database connection URL (gitignored)
- `backend/.env.example` - Template for environment variables

**Verification:**
```bash
psql --version  # Should show PostgreSQL version
npx prisma --version  # Should show Prisma version
```

---

### Phase 2: Design Database Schema (20 min)
**Goal:** Translate our Task model to Prisma schema

**Current Task Structure:**
```javascript
{
  id: "uuid",
  title: "string",
  project: "personal|work|learning|health",
  priority: "low|medium|high|urgent",
  status: "todo|in-progress|done",
  dueDate: "ISO date string (optional)",
  focusedToday: boolean,
  createdAt: "ISO date string",
  updatedAt: "ISO date string"
}
```

**Prisma Schema:**
```prisma
model Task {
  id            String   @id @default(uuid())
  title         String
  project       String
  priority      String
  status        String
  dueDate       DateTime?
  focusedToday  Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

**Considerations:**
- Should we use ENUMs for project/priority/status?
- Do we need indexes on status, project, or focusedToday?
- Should we add a `deletedAt` field for soft deletes (Phase 1.5 feature)?

---

### Phase 3: Migrate Data Layer (45 min)
**Goal:** Replace Map-based TaskModel with Prisma queries

**Files to Update:**
- `backend/src/models/Task.js` → Major refactor
- Keep same public API (create, findAll, findById, update, delete, count)
- Replace Map operations with Prisma queries

**Migration Strategy:**
```javascript
// OLD (in-memory Map)
create(taskData) {
  const task = { id: uuidv4(), ...taskData, ... };
  this.tasks.set(task.id, task);
  return task;
}

// NEW (Prisma)
async create(taskData) {
  const task = await prisma.task.create({
    data: taskData
  });
  return task;
}
```

**Key Changes:**
- All methods become `async`
- Replace `this.tasks.set()` with `prisma.task.create()`
- Replace `this.tasks.get()` with `prisma.task.findUnique()`
- Replace `Array.from(this.tasks.values())` with `prisma.task.findMany()`
- Add proper error handling for database failures

---

### Phase 4: Update Tests (45 min)
**Goal:** Make all 28 tests work with real database

**Testing Strategy:**
1. **Test Database:** Use separate test database
2. **Reset Before Each Test:** Clear database between tests
3. **Seed Data:** Create test fixtures
4. **Async/Await:** Update all test assertions for async

**Files to Update:**
- `backend/src/tests/api.test.js`

**Test Setup Example:**
```javascript
beforeEach(async () => {
  // Clear all tasks before each test
  await prisma.task.deleteMany({});
});

afterAll(async () => {
  // Disconnect from database
  await prisma.$disconnect();
});
```

**Critical Tests:**
- Create task → Verify it's in database
- Get all tasks → Verify sorting works
- Update task → Verify changes persist
- Delete task → Verify it's gone from database
- Server restart → Verify data persists

---

### Phase 5: Database Seeding (20 min)
**Goal:** Auto-populate development database with sample tasks

**Files to Create:**
- `backend/prisma/seed.js` - Seed script

**Seed Data:**
- 5-10 sample tasks covering all projects/priorities
- Mix of todo, in-progress, done
- Some with due dates, some focused today

**Integration:**
```json
// package.json
{
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

**Usage:**
```bash
npx prisma db seed  # Populate with sample data
```

---

### Phase 6: Environment & Configuration (15 min)
**Goal:** Proper configuration for local dev and production

**Environment Variables:**
```bash
# .env (gitignored)
DATABASE_URL="postgresql://user:password@localhost:5432/taskboard"
NODE_ENV="development"
```

**Configuration Files:**
- `.env.example` - Template for developers
- `backend/prisma/.env` - Prisma-specific config
- Update `.gitignore` - Ensure .env is ignored

**Verification:**
- ✅ .env is gitignored
- ✅ No database credentials in code
- ✅ .env.example documents required variables

---

### Phase 7: Testing & Verification (30 min)
**Goal:** Ensure everything works end-to-end

**Manual Testing Checklist:**
1. [ ] Start backend server
2. [ ] Create task via API → Check database
3. [ ] List tasks via API → Verify data
4. [ ] Update task via API → Verify in database
5. [ ] Delete task via API → Verify gone from database
6. [ ] Restart server → Verify data persists
7. [ ] Frontend integration → Verify UI works

**Automated Testing:**
```bash
npm test  # All 28 tests should pass
npm test -- --coverage  # Should maintain 90%+
```

**Database Verification:**
```bash
# Connect to database
psql taskboard

# Check tasks table
SELECT * FROM "Task";

# Verify schema
\d "Task"
```

---

### Phase 8: Documentation (20 min)
**Goal:** Document database setup and usage

**Files to Create/Update:**
- `backend/DATABASE.md` - Database setup guide
- `backend/README.md` - Update with database info
- `DAY-8-RETROSPECTIVE.md` - Learnings and metrics

**Documentation Topics:**
- PostgreSQL installation instructions
- Prisma migration commands
- Database seeding
- Common troubleshooting
- Schema changes workflow

---

## 🔧 Technical Decisions

### Why Prisma?
- ✅ Type-safe database queries
- ✅ Auto-generated TypeScript types
- ✅ Migration system built-in
- ✅ Great developer experience
- ✅ Works with Vercel serverless

### Why PostgreSQL?
- ✅ Free tier on Vercel/Supabase
- ✅ JSON support (future: task metadata)
- ✅ ACID compliance (data integrity)
- ✅ Excellent performance
- ✅ Industry standard

### Database Schema Choices
- **UUIDs for IDs:** Better for distributed systems, harder to guess
- **Timestamps:** Track when tasks created/updated
- **Nullable dueDate:** Not all tasks need deadlines
- **String enums:** Flexible, easy to add new values later
- **No soft deletes yet:** Keep it simple, add in Phase 1.5

---

## 📊 Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Test Coverage | ≥90% | `npm test -- --coverage` |
| API Response Time | <100ms | Manual timing with curl |
| Database Connection | <50ms | Prisma query logs |
| Zero Data Loss | 100% | Restart server, verify tasks persist |
| Tests Passing | 28/28 | `npm test` |

---

## 🚨 Risks & Mitigation

### Risk 1: PostgreSQL Installation Issues
**Mitigation:**
- Document installation for macOS/Linux/Windows
- Provide Docker alternative
- Fall back to SQLite for local dev if needed

### Risk 2: Test Database Pollution
**Mitigation:**
- Use separate test database (`taskboard_test`)
- Clear database before each test
- Never point tests at production database

### Risk 3: Breaking Changes to API
**Mitigation:**
- Keep same API contract (no frontend changes)
- All methods become async (minor change)
- Extensive testing before deployment

### Risk 4: Migration Complexity
**Mitigation:**
- Start fresh (no existing data to migrate)
- Simple schema (single table)
- Prisma handles migrations automatically

---

## 🎓 Learning Objectives

By the end of Day 8, you'll understand:

1. **ORMs (Object-Relational Mappers)**
   - What Prisma does
   - How it maps JavaScript objects to database tables
   - Type safety benefits

2. **Database Design**
   - Schema definition
   - Primary keys and UUIDs
   - Timestamps and defaults
   - Nullable fields

3. **Migrations**
   - Creating migrations
   - Running migrations
   - Rolling back migrations

4. **Database Testing**
   - Test database setup
   - Clearing data between tests
   - Testing async operations

5. **Environment Configuration**
   - Environment variables
   - Secrets management
   - Local vs production config

---

## 📚 Resources

### Prisma Documentation
- [Getting Started](https://www.prisma.io/docs/getting-started)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [CRUD Operations](https://www.prisma.io/docs/concepts/components/prisma-client/crud)
- [Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)

### PostgreSQL
- [Installation Guide](https://www.postgresql.org/download/)
- [Basic Commands](https://www.postgresql.org/docs/current/tutorial-start.html)
- [psql CLI Reference](https://www.postgresql.org/docs/current/app-psql.html)

### Testing with Databases
- [Jest Setup/Teardown](https://jestjs.io/docs/setup-teardown)
- [Testing Async Code](https://jestjs.io/docs/asynchronous)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing/unit-testing)

---

## 🎯 Post-Day 8: What's Next?

After completing Day 8, we'll be ready for:

### Day 9: Vercel Deployment
- Deploy backend to Vercel serverless functions
- Connect to remote PostgreSQL (Vercel Postgres or Supabase)
- Environment variables in Vercel dashboard
- CI/CD pipeline for automatic deployments

### Phase 1.5: Quick Wins
- Task editing (in-place updates)
- Soft deletes (archive feature)
- Task descriptions
- Keyboard shortcuts

### Phase 2: Multi-User Features
- User authentication (NextAuth.js)
- Per-user task lists
- Team collaboration
- Task assignment

---

**Ready to start?** Let's begin with Phase 1: Installing PostgreSQL and Prisma! 🚀
