# 📝 Task Board

**ADHD-optimized task management** focused on fast capture and "Today's Focus" workflow.

Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

**🚀 [Live Demo](https://task-board-henna-ten.vercel.app/)** | Deployed on Vercel

---

## ✨ Features (Phase 1)

- ⚡ **Quick Capture** - Fast task input with auto-focus
- 🎯 **Today's Focus** - Priority-sorted tasks for the day
- 📋 **All Tasks** - Organized by project (Development, Business, Personal, Learning)
- 💾 **localStorage** - Client-side persistence
- 📱 **Mobile-responsive** - Works on all devices
- 🎨 **Modern UI** - Lucide React icons, Tailwind CSS
- ✅ **80%+ test coverage** - Jest + React Testing Library

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd task-board

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage

### Adding Tasks
1. Type in the "Quick Add Task" input (auto-focused)
2. Select project, priority, and optional due date
3. Press "Add Task" (or Enter)

### Today's Focus Workflow
1. Review all tasks in the morning
2. Click "Add to Today" on tasks you want to focus on
3. Work through your Today's Focus list
4. Check off tasks as you complete them

### Managing Tasks
- **Change status:** Click the circle icon (todo → in-progress → done)
- **Remove from Today:** Click the X button
- **Delete task:** Click the trash icon

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

See [TESTING.md](./TESTING.md) for detailed testing documentation.

---

## 🏗️ Architecture

### Tech Stack
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v3, Lucide React icons
- **Validation:** Zod
- **Storage:** localStorage (Phase 1) → API (Phase 2)
- **Testing:** Jest, React Testing Library
- **CI/CD:** GitHub Actions

### Project Structure
```
task-board/
├── app/              # Next.js app router pages
├── components/       # React components
├── services/         # Data layer (taskService)
├── types/            # TypeScript type definitions
├── utils/            # Validation schemas (Zod)
├── docs/
│   └── adr/          # Architecture Decision Records
└── __tests__/        # Test files
```

### Key Design Patterns
- **Data Layer Abstraction:** TaskService hides storage implementation
- **Component Composition:** Reusable UI components
- **Type Safety:** TypeScript + Zod validation
- **Separation of Concerns:** Business logic separate from UI

See [ADR-003](./docs/adr/003-data-layer-abstraction.md) for data layer architecture.

---

## 📚 Documentation

- [Development Standards](../../DEVELOPMENT-STANDARDS.md)
- [Testing Guide](./TESTING.md)
- [Project Backlog](./BACKLOG.md) - Phases 2-4 roadmap
- [Architecture Decision Records](./docs/adr/)
  - [ADR-001: React & Next.js Choice](./docs/adr/001-react-nextjs-choice.md)
  - [ADR-002: Tailwind CSS v3](./docs/adr/002-tailwind-v3-choice.md)
  - [ADR-003: Data Layer Abstraction](./docs/adr/003-data-layer-abstraction.md)

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Code Quality
- **Linting:** ESLint with Next.js config
- **Type Checking:** TypeScript strict mode
- **Testing:** 80%+ coverage requirement
- **CI/CD:** Automated testing on push/PR

---

## 🗺️ Roadmap

**✅ Phase 1 (Complete):** localStorage MVP
- Core features: Quick Capture, Today's Focus, All Tasks
- Mobile-responsive UI
- 80%+ test coverage

**🚧 Phase 2 (Next):** Backend & Multi-Device Sync
- PostgreSQL/Supabase database
- User authentication
- REST API
- Multi-device sync

**📋 Phase 3:** Advanced Features
- Natural language input
- Voice input
- Quick capture widget
- Reminders & notifications
- Kanban view

**👥 Phase 4:** Collaboration
- Team features
- Shared projects
- Integrations (Calendar, Email, Slack)
- Mobile app

See [BACKLOG.md](./BACKLOG.md) for full roadmap.

---

## 🤝 Contributing

This is currently a personal learning project, but contributions are welcome!

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure tests pass (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Commit Message Format
```
<type>: <description>

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

- Built during Day 5 of Bradley's development bootcamp
- Uses [Lucide React](https://lucide.dev) for beautiful icons
- Powered by [Next.js](https://nextjs.org) and [React](https://react.dev)

---

**Status:** Phase 1 Complete ✅
**Last Updated:** 2026-02-09
