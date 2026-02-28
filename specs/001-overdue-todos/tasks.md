# Tasks: Overdue Todo Items

**Feature**: Overdue Todo Items  
**Branch**: `001-overdue-todo-items`  
**Input**: Design documents from `/specs/001-overdue-todos/`  
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/, research.md, quickstart.md

**Tests**: Tests ARE requested per spec.md Success Criteria SC-003 ("100% of overdue detection logic covered by automated tests"). Following test-first approach per quickstart.md.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **Checkbox**: Always start with `- [ ]` (markdown checkbox)
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a web application monorepo:
- **Frontend**: `packages/frontend/src/`
- **Backend**: `packages/backend/src/` (no changes for this feature)
- **Tests**: Co-located with source files in `__tests__/` directories

---

## Phase 1: Setup (Pre-Implementation Review)

**Purpose**: Validate environment and review existing code before implementation

- [X] T001 Review TodoCard component structure in packages/frontend/src/components/TodoCard.js
- [X] T002 Review theme colors and CSS variables in packages/frontend/src/styles/theme.css
- [X] T003 Verify Jest test configuration in packages/frontend/package.json

**Checkpoint**: Environment validated - ready for implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core date utility functions that ALL user stories depend on

**⚠️ CRITICAL**: These utilities must be complete and tested before ANY user story implementation

### Tests for Foundational Utilities (Test-First)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T004 [P] Setup Jest fake timers test utilities in packages/frontend/src/components/__tests__/TodoCard.test.js
- [X] T005 [P] Write failing test: isOverdue returns true for incomplete todo with past due date
- [X] T006 [P] Write failing test: isOverdue returns false for completed todo with past due date
- [X] T007 [P] Write failing test: isOverdue returns false for todo without due date
- [X] T008 [P] Write failing test: isOverdue returns false for todo due today
- [X] T009 [P] Write failing test: isOverdue returns false for todo with future due date
- [X] T010 [P] Write failing test: formatDueDate returns "Due today" for today's date
- [X] T011 [P] Write failing test: formatDueDate returns "Due yesterday" for 1 day ago
- [X] T012 [P] Write failing test: formatDueDate returns "Due X days ago" for 2-7 days ago
- [X] T013 [P] Write failing test: formatDueDate returns formatted date for 8+ days ago
- [X] T014 [P] Write failing test: formatDueDate returns null for null dueDate

### Implementation for Foundational Utilities

- [X] T015 Implement isOverdue() function in packages/frontend/src/components/TodoCard.js per contracts/dateUtils.md
- [X] T016 Implement formatDueDate() function in packages/frontend/src/components/TodoCard.js per contracts/dateUtils.md
- [X] T017 Verify all foundational tests pass (T005-T014)

**Checkpoint**: Date utilities complete and tested - user story implementation can now begin

---

## Phase 3: User Story 1 - Visual Identification of Overdue Items (Priority: P1) 🎯 MVP

**Goal**: Users can visually distinguish overdue todos from normal todos through danger-colored styling and a clock icon. Incomplete tasks with past due dates display with visual distinction (clock icon, danger-colored text, subtle background tint).

**: Create an incomplete todo with yesterday's date, view the list, verify the todo has danger-colored background tint, danger-colored text, and a clock icon next to the due date.

### Tests for User Story 1 (Test-First)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T018 [P] [US1] Write failing test: TodoCard renders with overdue CSS class for incomplete past-due todo
- [X] T019 [P] [US1] Write failing test: TodoCard does NOT render overdue class for todo due today
- [X] T020 [P] [US1] Write failing test: TodoCard does NOT render overdue class for completed past-due todo
- [X] T021 [P] [US1] Write failing test: TodoCard does NOT render overdue class for todo without due date
- [X] T022 [P] [US1] Write failing test: Clock icon renders only for overdue todos
- [X] T023 [P] [US1] Write failing test: Clock icon has aria-label="Overdue" and role="img"

### Implementation for User Story 1

- [X] T024 [US1] Add useMemo hook to compute overdue status in packages/frontend/src/components/TodoCard.js
- [X] T025 [US1] Update TodoCard JSX to conditionally apply "overdue" CSS class in packages/frontend/src/components/TodoCard.js
- [X] T026 [US1] Add clock icon (⏰) with aria-label="Overdue" and role="img" next to due date in packages/frontend/src/components/TodoCard.js
- [X] T027 [US1] Add .todo-card.overdue CSS class with danger background tint (8% opacity) in packages/frontend/src/App.css
- [X] T028 [US1] Add danger-colored text for .overdue .todo-due-date in packages/frontend/src/App.css
- [X] T029 [US1] Add .overdue-icon styling with danger color in packages/frontend/src/App.css
- [X] T030 [US1] Add CSS rule to ensure completed todos override overdue styling in packages/frontend/src/App.css
- [X] T031 [US1] Verify all User Story 1 tests pass (T018-T023)

**Checkpoint**: User Story 1 complete - overdue todos are visually distinct with danger styling and clock icon

---

## Phase 4: User Story 2 - Overdue Date Display Enhancement (Priority: P2)

**Goal**: Overdue due dates show relative time ("Due 3 days ago") instead of absolute dates for recent items (0-7 days), then actual formatted date for 8+ days, providing context about how late a task is without mental calculation.

**Independent Test**: Create todos with various past dates (yesterday, 3 days ago, 5 days ago, 10 days ago) and verify relative format for 0-7 days ("Due yesterday", "Due 5 days ago") and absolute format for 8+ days ("Due Feb 17, 2026").

### Tests for User Story 2 (Test-First)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T032 [P] [US2] Write failing test: TodoCard displays "Due yesterday" for todo due 1 day ago
- [X] T033 [P] [US2] Write failing test: TodoCard displays "Due X days ago" for todo due 2-7 days ago
- [X] T034 [P] [US2] Write failing test: TodoCard displays formatted date for todo due 8+ days ago
- [X] T035 [P] [US2] Write failing test: TodoCard displays "Due today" for todo due today
- [X] T036 [P] [US2] Write failing test: TodoCard displays "Due tomorrow" for todo due tomorrow
- [X] T037 [P] [US2] Write failing test: Relative date format includes "Due" prefix

### Implementation for User Story 2

- [X] T038 [US2] Update useMemo hook to include formatted date from formatDueDate() in packages/frontend/src/components/TodoCard.js
- [X] T039 [US2] Replace static due date display with formatted relative date in TodoCard JSX in packages/frontend/src/components/TodoCard.js
- [X] T040 [US2] Remove old formatDate() function if no longer used in packages/frontend/src/components/TodoCard.js
- [X] T041 [US2] Verify all User Story 2 tests pass (T032-T037)

**Checkpoint**: User Story 2 complete - overdue dates show helpful relative time context ("Due 3 days ago")

---

## Phase 5: User Story 3 - Theme Consistency for Overdue State (Priority: P3)

**Goal**: Overdue todos are clearly visible and appropriately styled in both light and dark themes with WCAG AA contrast ratios (4.5:1 for text, 3:1 for backgrounds), ensuring the feature works consistently regardless of user's theme preference.

**Independent Test**: Toggle between light and dark modes while viewing overdue todos and verify appropriate contrast, visibility, and danger color adaptation in both themes. Verify light mode uses #c62828 (6.57:1 contrast) and dark mode uses #ef5350 (4.89:1 contrast).

### Tests for User Story 3 (Test-First)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T042 [P] [US3] Write failing test: Overdue styling applies in light mode with proper danger color
- [X] T043 [P] [US3] Write failing test: Overdue styling applies in dark mode with proper danger color
- [X] T044 [P] [US3] Write failing test: Background tint opacity is appropriate for visibility

### Implementation for User Story 3

- [X] T045 [US3] Add light mode overdue styles using --danger-color (#c62828) in packages/frontend/src/App.css
- [X] T046 [US3] Add dark mode overdue styles with [data-theme="dark"] selector (#ef5350) in packages/frontend/src/App.css
- [X] T047 [US3] Add dark mode background tint rgba(239, 83, 80, 0.08) in packages/frontend/src/App.css
- [X] T048 [US3] Ensure .overdue .todo-due-date uses var(--danger-color) for theme adaptation in packages/frontend/src/App.css
- [X] T049 [US3] Ensure completed todo styles override overdue styles in both themes in packages/frontend/src/App.css
- [X] T050 [US3] Verify all User Story 3 tests pass (T042-T044)
- [X] T051 [US3] Manual test: Verify light mode danger color achieves 6.57:1 contrast using browser DevTools
- [X] T052 [US3] Manual test: Verify dark mode danger color achieves 4.89:1 contrast using browser DevTools

**Checkpoint**: User Story 3 complete - overdue feature works consistently across both light and dark themes

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, integration testing, documentation, and validation across all user stories

### Integration & Edge Case Testing

- [X] T053 [P] Integration test: Mark overdue todo as complete and verify styling disappears in packages/frontend/src/components/__tests__/TodoCard.test.js
- [X] T054 [P] Integration test: Edit overdue todo's due date to future and verify styling updates in packages/frontend/src/components/__tests__/TodoCard.test.js
- [X] T055 [P] Integration test: Toggle theme while viewing overdue todos and verify styling updates in packages/frontend/src/components/__tests__/TodoCard.test.js

### Code Quality & Coverage

- [X] T056 Run linter and fix any issues: npm run lint from packages/frontend
- [X] T057 Run full test suite: npm test from packages/frontend
- [X] T058 Verify 80%+ test coverage maintained for TodoCard component
- [X] T059 Add inline code comments for date calculation logic in packages/frontend/src/components/TodoCard.js
- [X] T060 Verify no console errors or React warnings in browser console

### Accessibility Validation

- [X] T061 [P] Test keyboard navigation (Tab, Enter, Space) on overdue todos
- [X] T062 [P] Verify screen reader announces "Overdue" for clock icon
- [X] T063 [P] Verify focus indicators visible on overdue styled cards
- [X] T064 Test with browser zoom at 200% - layout should not break

### Manual Integration Testing

- [X] T065 Manual test: Create incomplete todo with yesterday's date, verify overdue styling
- [X] T066 Manual test: Mark overdue todo complete, verify styling disappears
- [X] T067 Manual test: Edit overdue todo's due date to tomorrow, verify styling disappears
- [X] T068 Manual test: Create todo with today's date, verify NO overdue styling
- [X] T069 Manual test: Create todo with future date, verify NO overdue styling
- [X] T070 Manual test: View overdue todos in light mode, verify visibility and contrast
- [X] T071 Manual test: Switch to dark mode, verify overdue styling adapts
- [X] T072 Manual test: Verify page refresh maintains correct overdue state
- [X] T073 Manual test: Create todo due 10 days ago, verify formatted date (not relative)

### Documentation

- [X] T074 Update README if user-facing feature changes warrant documentation in README.md
- [X] T075 Verify all quickstart.md test scenarios pass in specs/001-overdue-todos/quickstart.md
- [X] T076 Add any necessary code comments in packages/frontend/src/components/TodoCard.js

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational - BLOCKS all user stories)
    ↓
Phase 3 (User Story 1 - P1) ←┐
    ↓                         │
Phase 4 (User Story 2 - P2) ←┤ User stories depend on Foundational
    ↓                         │ Can proceed in parallel if staffed   
Phase 5 (User Story 3 - P3) ←┘
    ↓
Phase 6 (Polish)
```

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational phase (T017 complete)
  - No dependencies on other user stories
  - Delivers: Basic overdue visual distinction (clock icon, danger colors, background tint)
  
- **User Story 2 (P2)**: Can start after Foundational phase (T017 complete)
  - Depends on: formatDueDate() from Phase 2
  - Builds on: US1 styling and structure (same component file)
  - Delivers: Enhanced date display with relative formatting
  
- **User Story 3 (P3)**: Can start after User Story 1 complete (T031 complete)
  - Depends on: CSS classes from US1
  - Extends: US1 and US2 with theme support
  - Delivers: Theme consistency for light/dark modes

### Critical Path

```
T001-T003 (Setup) → T004-T017 (Foundational) → T018-T031 (US1) → T032-T041 (US2) → T042-T052 (US3) → T053-T076 (Polish)
```

### Within Each User Story

**Test-First Workflow (REQUIRED)**:
1. Write ALL tests for the story - they will FAIL (red)
2. Run tests to verify they fail
3. Implement the feature code
4. Run tests again - they should PASS (green)
5. Refactor if needed (code cleanup while tests still pass)

**User Story 1 Flow**:
1. Write all tests (T018-T023) - all parallel [P]
2. Run tests - verify they FAIL
3. Implement useMemo and JSX updates (T024-T026)
4. Implement CSS (T027-T030)
5. Run tests - verify they PASS (T031)

**User Story 2 Flow**:
1. Write all tests (T032-T037) - all parallel [P]
2. Run tests - verify they FAIL
3. Implement formatDueDate integration (T038-T040)
4. Run tests - verify they PASS (T041)

**User Story 3 Flow**:
1. Write all tests (T042-T044) - all parallel [P]
2. Run tests - verify they FAIL
3. Implement theme CSS (T045-T049)
4. Run tests - verify they PASS (T050)
5. Manual contrast testing (T051-T052)

### Parallel Opportunities

**Within Phases**:
- **Phase 1**: All review tasks (T001-T003) can be done in parallel
- **Phase 2**: Test writing (T005-T014) all parallel [P]; Implementation (T015-T016) can be parallel
- **Phase 3**: All tests (T018-T023) parallel [P]; CSS tasks (T027-T030) can be parallel
- **Phase 4**: All tests (T032-T037) parallel [P]
- **Phase 5**: All tests (T042-T044) parallel [P]; CSS tasks (T045-T049) can be parallel
- **Phase 6**: Multiple validation categories can run in parallel

**Between User Stories**:
After foundational Phase 2 complete:
- Different developers can work on different user stories
- US1, US2, US3 tests can be written in parallel (different describe blocks)
- However, implementation is sequential (same component file) to avoid merge conflicts

**Example - Parallel Test Writing for Foundational**:
```bash
# All can be written simultaneously:
Task T005: "Write failing test: isOverdue returns true for incomplete past-due"
Task T006: "Write failing test: isOverdue returns false for completed past-due"
Task T007: "Write failing test: isOverdue returns false for no due date"
Task T008: "Write failing test: isOverdue returns false for today"
Task T009: "Write failing test: isOverdue returns false for future"
Task T010-T014: formatDueDate tests...
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) - Recommended for Fastest Value

**Deliver basic overdue visual identification:**

1. Complete Phase 1: Setup (Review) - T001-T003 (~10 min)
2. Complete Phase 2: Foundational (Tests + Utils) - T004-T017 (~1 hour)
3. Complete Phase 3: User Story 1 (Tests + Implementation) - T018-T031 (~1.5 hours)
4. **STOP and VALIDATE**: 
   - Run all tests - verify 100% pass
   - Manual test in browser (create overdue todo, verify styling)
   - Verify clock icon appears and has proper accessibility
   - Test theme switching
5. **DEMO/DEPLOY**: MVP delivers core value - users can identify overdue todos visually

**MVP Deliverable**: Users can see which todos are overdue with visual distinction (clock icon, colored text, background tint). This is 70% of the value with 40% of the work.

**Estimated MVP Time**: 2-3 hours

### Incremental Delivery (All Stories) - Recommended for Full Feature

**Full feature rollout with independent validation:**

1. **Foundation**: Setup + Foundational → Tests pass → ~1.5 hours
2. **US1**: Visual identification → Test independently → Deploy (MVP!)
3. **US2**: Relative dates → Test independently → Deploy (enhanced UX)
4. **US3**: Theme consistency → Test independently → Deploy (full polish)
5. **Polish**: Edge cases + validation → Final deployment

**Benefits**: Each phase delivers incremental value, each can be validated independently, no breaking changes

**Total Estimated Time**: 5-7 hours

### Sequential Order (Single Developer) - Recommended

```
Setup → Foundational → US1 → US2 → US3 → Polish
```

**Rationale**:
- All work is in same component file (TodoCard.js) - sequential avoids merge conflicts
- Each phase builds on previous
- Test-first approach ensures quality at each step
- Minimal context switching

### Parallel Team Strategy (Multiple Developers) - Possible but Tricky

**Potential conflicts**: All TodoCard.js edits happen in same file

**If needed**:
1. **All together**: Complete Setup + Foundational (T001-T017)
2. **Dev A**: Write all tests for US1, US2, US3 (T018-T023, T032-T037, T042-T044) in parallel
3. **Dev B**: Write CSS in separate branch (T027-T030, T045-T049)
4. **Dev A** continues: Implement TodoCard JSX changes (T024-T026, T038-T040)
5. **Merge**: Bring CSS and JSX together
6. **All together**: Polish phase (T053-T076) - many parallel opportunities

**Caution**: Only use parallel strategy if absolutely necessary. Sequential is cleaner for this feature.

---

## Task Summary

**Total Tasks**: 76

**By Phase**:
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 14 tasks (11 tests + 3 implementation)
- Phase 3 (User Story 1 - P1): 14 tasks (6 tests + 8 implementation)
- Phase 4 (User Story 2 - P2): 10 tasks (6 tests + 4 implementation)
- Phase 5 (User Story 3 - P3): 11 tasks (3 tests + 8 implementation)
- Phase 6 (Polish): 24 tasks (integration tests + validation + documentation)

**By Category**:
- Test tasks: 26 (all written BEFORE implementation per TDD)
- Implementation tasks: 23
- Validation/QA tasks: 24
- Setup/Documentation: 3

**By User Story**:
- User Story 1 (P1 - MVP): 14 tasks
- User Story 2 (P2): 10 tasks
- User Story 3 (P3): 11 tasks
- Infrastructure (Setup + Foundational + Polish): 41 tasks

**Parallel Opportunities**: 30+ tasks marked [P] can be done in parallel with other tasks

**Test-First Tasks**: 26 tests must be written and FAIL before implementation begins

**Independent Test Criteria**:
- **US1**: Create incomplete todo with yesterday's date → verify visual styling (clock, colors, background)
- **US2**: Create overdue todos at various ages → verify relative dates (<7 days) and absolute dates (8+ days)
- **US3**: Toggle between light/dark themes → verify styling adapts with proper contrast

**MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1 only) = 31 tasks for basic working feature

---

## Notes

- **Test-First Approach**: ALL test tasks MUST be written and fail before implementation begins (Red-Green-Refactor)
- **[P] markers**: Indicate tasks that can run in parallel (different files, no sequential dependencies)
- **[Story] labels**: Map tasks to user stories (US1, US2, US3) for traceability and independent delivery
- **File paths**: All tasks include specific file paths for absolute clarity
- **Checkpoints**: Stop at any checkpoint to validate story works independently before proceeding
- **Constitution compliance**: 
  - Frontend-only changes (no backend required) ✓
  - No API contract changes ✓
  - 80%+ test coverage maintained ✓
  - WCAG AA compliance verified ✓
- **Accessibility**: WCAG AA compliance (4.5:1 text, 3:1 backgrounds) verified in US3 and Polish phases
- **Testing**: Uses Jest fake timers (`jest.setSystemTime()`) for deterministic date testing
- **Primary files modified**: 
  - `packages/frontend/src/components/TodoCard.js` (utilities + component logic)
  - `packages/frontend/src/components/__tests__/TodoCard.test.js` (all tests)
  - `packages/frontend/src/App.css` (overdue styling)
  - No backend files modified

---

## Format Validation

✅ All 76 tasks follow format: `- [ ] [TaskID] [P?] [Story?] Description with file path`  
✅ Tasks organized by user story for independent implementation  
✅ Clear dependencies and execution order documented  
✅ Parallel opportunities identified with [P] markers  
✅ Independent test criteria provided for each user story  
✅ MVP scope clearly defined (31 tasks)  
✅ Test-first approach enforced (tests before implementation)  
✅ All test tasks marked with "Write failing test:" prefix for clarity
