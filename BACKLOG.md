# Task Board - Project Backlog

## Project Vision
ADHD-optimized task management tool focused on **fast capture** and **Today's Focus** workflow. Built for Bradley's actual use, designed to scale from solo → team collaboration.

---

## ✅ Completed: Phase 1 (localStorage MVP)

**Goal:** Functional task board with core features

**Completed Features:**
- ⚡ Quick Capture form (ADHD-optimized, auto-focus)
- 🎯 Today's Focus section (priority sorting)
- 📋 All Tasks view (grouped by project)
- 💾 localStorage persistence
- 📱 Mobile-responsive design
- 🎨 Lucide React icons
- ✅ 73.84% test coverage (integration-first approach)
- 🔄 CI/CD with GitHub Actions

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v3, Zod, Jest

---

## 🎯 Phase 1.5: Quick Wins & Polish

**Goal:** Small improvements to make Phase 1 more usable before backend work

**Priority:** Address these before starting Phase 2 backend work

### Features
- [ ] **Remove from Today's Focus**
  - Add "Remove from Today" button on focused tasks
  - Keyboard shortcut to toggle focus status
  - Currently: can only promote to Today, not demote
  - **Impact:** High (common workflow need)
  - **Effort:** 1-2 hours

- [ ] **Archive & Undelete**
  - Soft delete (archive) instead of permanent delete
  - "Archived" view to see deleted tasks
  - Undelete/restore from archive
  - Auto-archive completed tasks after N days (optional)
  - **Impact:** Medium (safety net for accidental deletes)
  - **Effort:** 3-4 hours

- [ ] **Keyboard Shortcuts** (Quick wins)
  - `n` = New task (focus Quick Capture)
  - `Escape` = Clear/cancel form
  - `?` = Show keyboard shortcuts help
  - **Impact:** Medium (power user feature)
  - **Effort:** 2-3 hours

- [ ] **Task Editing** ⭐ HIGH PRIORITY
  - Edit task title, priority, project, status in-place
  - Edit mode: click task to open inline editor
  - Update all task properties without deleting
  - Currently: must delete and recreate
  - **Impact:** High (common need)
  - **Effort:** 4-5 hours

- [ ] **Task Descriptions/Context**
  - Add rich text description field to tasks
  - Expand/collapse description in task card
  - Markdown support for formatting
  - **Impact:** High (adds crucial context)
  - **Effort:** 3-4 hours

- [ ] **Due Date Improvements**
  - Show overdue tasks prominently
  - "Due today" badge in Today's Focus
  - Sort by due date option
  - **Impact:** Medium
  - **Effort:** 2-3 hours

**Total Estimated Effort:** 1-2 days of focused work

---

## 🚀 Phase 2: Backend & Multi-Device Sync

**Goal:** Replace localStorage with backend API for persistence across devices

### Features
- [ ] **Backend API** (Next.js API routes or separate service)
  - RESTful endpoints: GET/POST/PUT/DELETE /api/tasks
  - PostgreSQL or Supabase database
  - User authentication (NextAuth.js)

- [ ] **Data Migration**
  - Migrate localStorage data to backend on first login
  - Export/import functionality for backup

- [ ] **Multi-Device Sync**
  - Real-time updates (optional: WebSockets or polling)
  - Conflict resolution for offline edits

- [ ] **User Accounts** ⭐ HIGH PRIORITY
  - Sign up / Login (email + password)
  - OAuth (Google, GitHub)
  - User profile settings
  - Secure credential storage

- [ ] **Project Views**
  - Dedicated page/view for each project
  - Deep link to project view (e.g., /project/development)
  - Filters and sorting per project

- [ ] **Multi-Project Tags**
  - Associate single task to multiple projects
  - Tags system (task can be "development" AND "business")
  - Tag-based filtering and views
  - **Impact:** Medium (advanced organization)
  - **Effort:** 5-6 hours

- [ ] **Level of Effort (LOE) Field**
  - Add LOE field: XS, S, M, L, XL (or hours estimate)
  - Filter/group tasks by effort
  - Weekly capacity planning (sum of LOE)
  - **Impact:** Medium (planning tool)
  - **Effort:** 3-4 hours

### Architecture Changes
- Swap `taskService` to use fetch('/api/tasks') instead of localStorage
- Add authentication middleware
- Database schema design

### Research & Planning
- [ ] **ClickUp Gap Analysis**
  - Review ClickUp features Bradley actually uses
  - Identify must-have features to port over
  - Prioritize integration vs. native implementation
  - Document findings and recommendations

**Estimated Effort:** 2-3 weeks

---

## 📈 Phase 3: Advanced Features & ADHD Optimizations

**Goal:** Power user features + ADHD-specific optimizations

### Features
- [ ] **Natural Language Input** (High Priority)
  - "Buy milk tomorrow at 3pm" → parsed task
  - Voice input integration (Web Speech API)
  - AI-powered task parsing

- [ ] **Quick Capture Widget**
  - Global keyboard shortcut (Cmd+K)
  - Overlay widget (doesn't require opening app)
  - Desktop and mobile widgets

- [ ] **Reminders & Notifications**
  - Due date reminders
  - Daily review prompt (morning)
  - End-of-day summary
  - Push notifications (web + mobile)

- [ ] **Kanban View**
  - Drag & drop between columns
  - Custom columns per project
  - Swimlanes for priority

- [ ] **Advanced Filtering**
  - Filter by multiple criteria (project + priority + status)
  - Saved filter views
  - Quick filters (shortcuts)

- [ ] **Time Tracking** (Optional)
  - Pomodoro timer integration
  - Estimated vs. actual time
  - Daily/weekly time reports

- [ ] **Subtasks & Dependencies** ⭐ HIGH PRIORITY
  - Break tasks into subtasks (checklist items)
  - Task dependencies (blocking/blocked by)
  - Progress visualization
  - Auto-calculate parent task progress from subtasks

- [ ] **Percentage Completeness**
  - Manual progress slider (0-100%)
  - Auto-calculated from subtasks (if subtasks exist)
  - Visual progress bar on task cards
  - Filter by completion percentage
  - **Impact:** Medium (progress tracking)
  - **Effort:** 4-5 hours

- [ ] **Task Scheduling**
  - Schedule tasks for specific date/time
  - Calendar view integration
  - Time blocks for focused work
  - Move scheduled tasks to Today's Focus automatically
  - **Impact:** High (time management)
  - **Effort:** 6-8 hours

- [ ] **Recurring Tasks**
  - Daily, weekly, monthly repeats
  - Custom recurrence patterns

### ADHD-Specific Enhancements
- [ ] Dopamine rewards (completion animations, streaks)
- [ ] Break tasks into smaller chunks automatically
- [ ] "Overwhelm mode" (hide all but top 3 tasks)
- [ ] Energy level tagging (high/low energy tasks)
- [ ] Context switching cost warnings

**Estimated Effort:** 4-6 weeks

---

## 👥 Phase 4: Collaboration & Productivity Ecosystem

**Goal:** Team collaboration + integrate with existing tools

### Features
- [ ] **Team Collaboration**
  - Shared projects/boards
  - Task assignment
  - Comments & @mentions
  - Activity feed

- [ ] **Permissions & Roles**
  - Owner, Admin, Member, Viewer
  - Project-level permissions
  - Public/private boards

- [ ] **Integrations**
  - Calendar sync (Google Calendar, Outlook)
  - Email → Task (forward emails to create tasks)
  - Slack/Discord notifications
  - GitHub issues sync
  - API for third-party apps

- [ ] **Advanced Analytics**
  - Completion rates by project/priority
  - Productivity trends (best times of day)
  - Burndown charts
  - Team velocity

- [ ] **Templates & Automation**
  - Project templates
  - Automated task creation (recurring, triggered)
  - Rules engine (if X then Y)

- [ ] **Mobile App** (Optional)
  - Native iOS/Android apps
  - React Native or Swift/Kotlin
  - Offline-first architecture

**Estimated Effort:** 8-12 weeks

---

## 🎨 UI/UX Polish (Ongoing)

Can be tackled in any phase:

- [ ] **Theming**
  - Dark mode
  - Custom color themes
  - Accessibility (WCAG AA compliance)

- [ ] **Animations & Micro-interactions**
  - Task completion celebration
  - Smooth transitions
  - Loading states

- [ ] **Mobile Optimizations**
  - Swipe gestures (complete, delete)
  - Bottom sheet navigation
  - Pull to refresh

- [ ] **Onboarding**
  - Interactive tutorial
  - Sample data/tasks
  - Tips & best practices

- [ ] **Keyboard Shortcuts**
  - Vim-style navigation (j/k)
  - Quick actions (a=add, /=search)
  - Shortcuts cheat sheet

---

## 🔬 Technical Debt & Improvements

- [ ] **Testing**
  - Component tests for TodaysFocus, TaskList
  - Integration tests (full app flow)
  - E2E tests (Playwright)
  - Visual regression tests

- [ ] **Performance**
  - Lazy loading for large task lists
  - Virtual scrolling (react-window)
  - Optimistic UI updates
  - Service worker for offline

- [ ] **Documentation**
  - API documentation
  - Component storybook
  - Architecture diagrams
  - Contributing guide

- [ ] **DevOps**
  - Staging environment
  - Feature flags
  - Error tracking (Sentry)
  - Analytics (PostHog, Mixpanel)

---

## 💡 Ideas Parking Lot

Ideas to evaluate later:

- AI task prioritization (suggest what to work on)
- Gamification (XP, levels, achievements)
- Social features (share Today's Focus)
- Chrome extension (quick capture from browser)
- Email digest (daily summary)
- Integration marketplace
- White-label version for other teams
- **Product:** Sell as SaaS tool

---

## 📊 Success Metrics

**Phase 1 (Complete):**
- ✅ App functional and testable
- ⏳ Bradley uses it daily (TBD after Mac testing)
- ✅ 73.84% test coverage (behavior-focused)

**Phase 2:**
- Daily active usage across 2+ devices
- Zero data loss incidents
- <100ms API response times

**Phase 3:**
- 90%+ task capture via Quick Add Widget
- 50%+ reduction in "forgetting tasks"
- Positive user feedback on ADHD features

**Phase 4:**
- 5+ active team members using collaboration
- 3+ external integrations in use
- NPS score > 50

---

## 🔗 Related Resources

- [Development Standards](./DEVELOPMENT-STANDARDS.md)
- [Testing Guide](./TESTING.md)
- [Architecture Decision Records](./docs/adr/)
- [Day 5 Retrospective](./DAY-5-RETROSPECTIVE.md)

---

**Last Updated:** 2026-02-09
**Next Review:** Start of Phase 2
