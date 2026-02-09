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
- ✅ 80%+ test coverage
- 🔄 CI/CD with GitHub Actions

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v3, Zod, Jest

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

- [ ] **User Accounts**
  - Sign up / Login (email + password)
  - OAuth (Google, GitHub)
  - User profile settings

### Architecture Changes
- Swap `taskService` to use fetch('/api/tasks') instead of localStorage
- Add authentication middleware
- Database schema design

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

- [ ] **Subtasks & Dependencies**
  - Break tasks into subtasks
  - Task dependencies (blocking/blocked by)
  - Progress visualization

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
- ✅ Bradley uses it daily
- ✅ 80%+ test coverage

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
