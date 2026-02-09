# ADR-001: React & Next.js for Frontend Framework

**Date:** 2026-02-09
**Status:** Accepted
**Deciders:** Bradley James, Claude (Day 5 bootcamp discussion)

## Context

Building an interactive task board application as part of Day 5 bootcamp project. Need to choose between:
- Vanilla JavaScript (Day 5 curriculum default)
- React framework (modern approach)

User Bradley indicated this is a **long-term tool** he plans to actually use and evolve, not a throwaway learning project. The decision needed to balance learning fundamentals vs. building something maintainable and scalable.

## Decision

**Chose React with Next.js 16** instead of vanilla JavaScript.

**Rationale:**
1. **Long-term viability:** Bradley will use this tool beyond the bootcamp
2. **Team collaboration:** Future Phase 4 includes multi-user features
3. **Ecosystem:** Rich library ecosystem (date-fns, Zod, Lucide icons)
4. **Industry standard:** React is widely used, better for portfolio
5. **Developer experience:** Hot reloading, TypeScript integration, better tooling

## Alternatives Considered

### Option A: Vanilla JavaScript + DOM Manipulation
**Pros:**
- Better for learning fundamentals
- No framework overhead
- Simpler mental model for Day 5
- Direct DOM manipulation understanding

**Cons:**
- More boilerplate for state management
- Harder to scale to complex features
- Manual re-rendering logic
- Less maintainable long-term

**Decision:** Rejected for Phase 1, but added to backlog as separate learning project

### Option B: React (Chosen)
**Pros:**
- Component reusability
- Declarative UI (easier to reason about)
- Strong TypeScript support
- Rich ecosystem for future phases
- Better for collaboration (Phase 4)
- Industry-standard patterns

**Cons:**
- Steeper initial learning curve
- Abstracts away some DOM fundamentals
- Framework-specific concepts (hooks, JSX)

**Decision:** Accepted

### Option C: Vue or Svelte
**Pros:**
- Simpler learning curve than React
- Good performance
- Growing ecosystems

**Cons:**
- Less widespread adoption than React
- Smaller talent pool for future collaboration
- Bradley already familiar with React concepts

**Decision:** Rejected (not seriously considered)

## Consequences

### Positive
- ✅ Scalable architecture for Phases 2-4
- ✅ Component reusability (QuickCapture, TodaysFocus, TaskList)
- ✅ Easy to add features (natural language input, Kanban view)
- ✅ Rich ecosystem (testing, UI libraries, integrations)
- ✅ Good for portfolio/resume

### Negative
- ⚠️ Missed learning vanilla DOM manipulation (mitigated: added to backlog)
- ⚠️ Framework-specific knowledge (React hooks, Next.js routing)
- ⚠️ Larger initial bundle size

### Neutral
- Next.js App Router provides built-in routing for future pages
- TypeScript + React types ensure type safety
- SSR capabilities available but not needed in Phase 1

## Follow-Up Actions

- [x] Create React components with proper separation of concerns
- [x] Use TypeScript for type safety
- [ ] **Backlog:** Create separate "Vanilla DOM Manipulation" learning project
- [ ] **Phase 2:** Leverage Next.js API routes for backend
- [ ] **Phase 3:** Use React ecosystem for advanced features (DnD, animations)

## Notes

This decision was made collaboratively during Day 5 architecture discussion. Bradley explicitly confirmed: "I would say let's go with React" after discussing the long-term nature of the project.

The vanilla JS fundamentals Bradley wanted to learn were preserved through the bootcamp structure, and we committed to a separate side project for pure DOM manipulation practice.

## Related ADRs

- [ADR-002: Tailwind CSS v3](./002-tailwind-v3-choice.md)
- [ADR-003: Data Layer Abstraction](./003-data-layer-abstraction.md)
