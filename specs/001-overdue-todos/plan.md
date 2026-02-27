# Implementation Plan: Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: February 27, 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement visual identification for overdue todo items by calculating overdue status client-side and applying distinct styling (clock icon, danger-colored text and background tint) to incomplete todos with past due dates. The feature leverages existing frontend date handling capabilities and the theme system to provide clear visual feedback across light and dark modes without requiring backend changes.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: JavaScript (Node.js 16+, React 18.2.0)
**Primary Dependencies**: React, React DOM, Express.js 4.18.2, axios 1.6.2, better-sqlite3 11.10.0
**Storage**: SQLite via better-sqlite3 (backend), no additional storage needed for this feature
**Testing**: Jest 29.7.0 with @testing-library/react 14.0.0 for frontend, Jest with supertest 6.3.3 for backend
**Target Platform**: Web browsers (modern browsers per browserslist) + Node.js server
**Project Type**: Web application (monorepo: React frontend + Express backend)
**Performance Goals**: Standard web UI responsiveness (<100ms for date calculations, <200ms UI updates)
**Constraints**: 80%+ test coverage (per testing guidelines), WCAG AA contrast ratios (4.5:1 text, 3:1 backgrounds)
**Scale/Scope**: Single-user todo app, ~10 React components, existing monorepo with 2 packages (frontend/backend)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on the feature specification's Constitution Alignment section and project documentation:

### Gate 1: Scope Discipline ✓ PASS
- **Requirement**: Feature must stay within single-user todo app scope, no complex systems
- **Status**: PASS - Enhances existing due date display with visual feedback, no new entities or workflows
- **Evidence**: Only modifies TodoCard component rendering; no filtering, search, or multi-user features added

### Gate 2: API Contract Stability ✓ PASS
- **Requirement**: Minimize backend changes, preserve existing API contracts
- **Status**: PASS - Zero backend changes required
- **Evidence**: Backend already stores `dueDate` and `completed` fields; all overdue logic is client-side date comparison

### Gate 3: Testing Coverage ✓ PASS
- **Requirement**: Maintain 80%+ test coverage with comprehensive behavior tests
- **Status**: PASS - Feature includes detailed test scenarios for all acceptance criteria
- **Evidence**: Spec defines 13+ test scenarios covering overdue detection, styling, themes, and edge cases

### Gate 4: Accessibility & UI Consistency ✓ PASS
- **Requirement**: WCAG AA compliance, theme system integration
- **Status**: PASS - Uses existing theme colors, includes ARIA labels, works in both themes
- **Evidence**: Spec mandates 4.5:1 text contrast, 3:1 background contrast, screen reader support via clock icon aria-label

### Post-Design Re-evaluation (Phase 1 Complete)

**Date**: February 27, 2026

All constitution gates continue to PASS after completing design phase:

✅ **Gate 1 - Scope**: Design confirms frontend-only changes to TodoCard.js. Two utility functions (`isOverdue`, `formatDueDate`) added inline. No new entities, no backend changes, no scope creep.

✅ **Gate 2 - API Contracts**: data-model.md confirms zero API changes. Uses existing GET /api/todos and PUT /api/todos/:id unchanged. Backward compatible.

✅ **Gate 3 - Testing**: contracts/ define 25+ specific test cases. quickstart.md provides full test implementation. All edge cases covered with Jest fake timers for deterministic date testing.

✅ **Gate 4 - Accessibility**: 
- contracts/TodoCard.md specifies clock icon with `aria-label="Overdue"` and `role="img"`
- Light mode danger color (#c62828) achieves 6.57:1 contrast on white
- Dark mode danger color (#ef5350) achieves 4.89:1 contrast on dark background
- Background tint uses 8% opacity for subtle distinction (meets 3:1 for UI components)

**Conclusion**: No constitution violations detected. Design adheres to all project principles. Ready for implementation (Phase 2).

### Summary
**All gates PASS (initial + post-design).** No constitution violations. Feature is frontend-only enhancement to existing functionality with comprehensive testing and accessibility requirements.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
packages/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── index.js
│   │   └── services/
│   │       └── todoService.js
│   └── __tests__/
│       └── app.test.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── TodoCard.js          # PRIMARY: Overdue styling logic
    │   │   ├── TodoList.js
    │   │   ├── TodoForm.js
    │   │   ├── ConfirmDialog.js
    │   │   ├── ThemeToggle.js
    │   │   └── __tests__/
    │   │       ├── TodoCard.test.js  # PRIMARY: New overdue tests
    │   │       ├── TodoList.test.js
    │   │       └── TodoForm.test.js
    │   ├── services/
    │   │   ├── todoService.js
    │   │   └── __tests__/
    │   │       └── todoService.test.js
    │   ├── styles/
    │   │   └── theme.css            # Danger colors already defined
    │   ├── App.js
    │   └── App.css
    └── public/
        └── index.html
```

**Structure Decision**: Web application (Option 2). This feature is **frontend-only**, primarily modifying `TodoCard.js` component to add overdue detection logic and visual styling. Backend requires no changes as `dueDate` and `completed` fields already exist. All implementations will be in `packages/frontend/src/components/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
