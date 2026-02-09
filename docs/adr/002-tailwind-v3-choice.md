# ADR-002: Tailwind CSS v3 Over v4

**Date:** 2026-02-09
**Status:** Accepted
**Deciders:** Bradley James, Claude (Technical constraint-driven)

## Context

During Phase 1 implementation, encountered a critical blocker with Tailwind CSS v4:

**Problem:** Tailwind v4 uses `lightningcss` which requires native binary compilation for each platform. When npm installed dependencies in the Linux VM, it compiled for Linux. When Bradley ran the dev server on his Mac (ARM64), the native module was missing, causing build failure.

**Error:**
```
Cannot find module '../lightningcss.darwin-arm64.node'
```

Attempted fixes:
1. Reinstalling `node_modules` on Mac → Failed (same error)
2. Clearing cache and reinstalling → Failed (same error)
3. Multiple npm install attempts → Failed (persistent issue)

## Decision

**Downgraded from Tailwind v4 → Tailwind v3.4.17**

This was a **forced technical decision**, not a preference-based choice.

## Alternatives Considered

### Option A: Continue debugging Tailwind v4
**Pros:**
- Newest version with latest features
- Better performance (Lightning CSS is faster)
- Future-proof

**Cons:**
- Blocking development progress
- Native module compatibility issues
- Unstable on ARM64 Mac
- Poor developer experience

**Decision:** Rejected (wasting time on tooling instead of learning)

### Option B: Use Tailwind v3 (Chosen)
**Pros:**
- **Stable and battle-tested**
- No native module dependencies
- Works on all platforms (Mac, Linux, Windows)
- Same API and utility classes
- Still actively maintained

**Cons:**
- Missing some v4 optimizations
- Slightly larger CSS bundle
- Will need to upgrade in future

**Decision:** Accepted

### Option C: Switch to different CSS framework (Bootstrap, etc.)
**Pros:**
- Avoid Tailwind issues entirely

**Cons:**
- Different API/learning curve
- Less popular than Tailwind
- Would waste time already invested

**Decision:** Rejected (Tailwind is still the right choice)

## Consequences

### Positive
- ✅ Unblocked development immediately
- ✅ Stable, proven technology
- ✅ No platform-specific build issues
- ✅ All Tailwind utility classes work the same
- ✅ Bradley can develop on Mac without Linux VM

### Negative
- ⚠️ Missing Tailwind v4 performance improvements
- ⚠️ Will need to upgrade to v4 eventually (when stable)
- ⚠️ Slightly larger CSS bundle size

### Neutral
- Configuration is simpler (standard `tailwind.config.js`)
- PostCSS setup is straightforward
- No behavioral differences in Phase 1

## Implementation Changes

**Removed:**
```json
"@tailwindcss/postcss": "^4",
"tailwindcss": "^4"
```

**Added:**
```json
"tailwindcss": "^3.4.17",
"postcss": "^8.4.49",
"autoprefixer": "^10.4.20"
```

**Updated files:**
- `package.json`: Downgraded Tailwind version
- `tailwind.config.js`: Standard v3 config format
- `postcss.config.js`: Standard PostCSS + Autoprefixer
- `app/globals.css`: Changed from `@import "tailwindcss"` to `@tailwind` directives

## Follow-Up Actions

- [x] Remove Tailwind v4 packages
- [x] Install Tailwind v3 stable
- [x] Update configuration files
- [x] Test on both Linux VM and Mac
- [ ] **Future:** Revisit Tailwind v4 when ARM64 support is stable
- [ ] **Phase 2:** Monitor Tailwind v4 release notes for stability

## Lessons Learned

1. **Avoid cutting-edge tools during learning:** Tailwind v4 was too new/unstable
2. **Platform compatibility matters:** Native modules can cause cross-platform issues
3. **Pragmatism over perfection:** v3 works perfectly fine for Phase 1 needs
4. **Developer experience is critical:** Tooling should help, not block progress

## Related ADRs

- [ADR-001: React & Next.js Choice](./001-react-nextjs-choice.md)
- [ADR-003: Data Layer Abstraction](./003-data-layer-abstraction.md)
