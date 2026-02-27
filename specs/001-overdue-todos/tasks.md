# Tasks: Overdue Todo Items

**Feature**: Overdue Todo Items  
**Branch**: `001-overdue-todos`  
**Input**: Design documents from `/specs/001-overdue-todos/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths included in descriptions

## Path Conventions

This is a monorepo web application:
- **Backend**: `packages/backend/src/`
- **Frontend**: `packages/frontend/src/`
- **Tests**: `packages/frontend/src/components/__tests__/`

---

## Phase 1: Setup

**Purpose**: Verify project prerequisites and tooling

- [ ] T001 Verify React 18.2.0 and Jest 29.7.0 are installed per plan.md
- [ ] T002 Verify existing TodoCard.js component structure in packages/frontend/src/components/TodoCard.js
- [ ] T003 [P] Review existing theme CSS variables in packages/frontend/src/styles/theme.css

---

## Phase 2: Foundational (Date Utilities)

**Purpose**: Core date utility functions that ALL user stories depend on

**⚠️ CRITICAL**: These functions must be complete and tested before ANY user story implementation

- [ ] T004 [P] Implement isOverdue() function in packages/frontend/src/components/TodoCard.js per contracts/dateUtils.md
- [ ] T005 [P] Implement formatDueDate() function in packages/frontend/src/components/TodoCard.js per contracts/dateUtils.md
- [ ] T006 Write unit tests for isOverdue() with 7 test cases in packages/frontend/src/components/__tests__/TodoCard.test.js using jest.setSystemTime()
- [ ] T007 Write unit tests for formatDueDate() with 11 test cases in packages/frontend/src/components/__tests__/TodoCard.test.js using jest.setSystemTime()

**Checkpoint**: Date utilities complete and tested - user story implementation can begin

---

## Phase 3: User Story 1 - Visual Identification of Overdue Items (Priority: P1) 🎯 MVP

**Goal**: Users can visually distinguish overdue todos from normal todos through danger-colored styling and a clock icon

**Independent Test**: Create an incomplete todo with yesterday's date, view the list, verify the todo has danger-colored background tint, danger-colored text, and a clock icon next to the due date

### Implementation for User Story 1

- [ ] T008 [US1] Add useMemo hook to compute overdue status in TodoCard component in packages/frontend/src/components/TodoCard.js
- [ ] T009 [US1] Update TodoCard JSX to conditionally apply "overdue" CSS class based on isOverdue() result in packages/frontend/src/components/TodoCard.js
- [ ] T010 [US1] Add clock icon (⏰) with aria-label="Overdue" and role="img" next to due date in packages/frontend/src/components/TodoCard.js
- [ ] T011 [US1] Add .overdue CSS class with danger background tint (8% opacity) in packages/frontend/src/App.css
- [ ] T012 [US1] Style .overdue .todo-due-date with danger color text in packages/frontend/src/App.css
- [ ] T013 [US1] Style .overdue-icon with danger color in packages/frontend/src/App.css
- [ ] T014 [US1] Add CSS rule to prevent overdue styling on completed todos in packages/frontend/src/App.css

### Tests for User Story 1

- [ ] T015 [P] [US1] Test incomplete todo with yesterday's date shows overdue class in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T016 [P] [US1] Test incomplete todo with today's date does NOT show overdue styling in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T017 [P] [US1] Test completed todo with past date does NOT show overdue styling in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T018 [P] [US1] Test todo with no due date does NOT show overdue styling in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T019 [P] [US1] Test clock icon appears only for overdue todos in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T020 [US1] Test clock icon has proper aria-label and role attributes in packages/frontend/src/components/__tests__/TodoCard.test.js

**Checkpoint**: User Story 1 complete - overdue todos are visually distinct with danger styling and clock icon

---

## Phase 4: User Story 2 - Overdue Date Display Enhancement (Priority: P2)

**Goal**: Overdue due dates show relative time ("Due 3 days ago") instead of absolute dates for recent items (0-7 days)

**Independent Test**: Create todos with various past dates (yesterday, 3 days ago, 10 days ago) and verify relative format for 0-7 days, absolute format for 8+ days

### Implementation for User Story 2

- [ ] T021 [US2] Update useMemo hook to include formatted date from formatDueDate() in packages/frontend/src/components/TodoCard.js
- [ ] T022 [US2] Replace static due date display with formatted relative date in TodoCard JSX in packages/frontend/src/components/TodoCard.js
- [ ] T023 [US2] Remove old formatDate() function if no longer used in packages/frontend/src/components/TodoCard.js

### Tests for User Story 2

- [ ] T024 [P] [US2] Test todo due yesterday displays "Due yesterday" in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T025 [P] [US2] Test todo due 5 days ago displays "Due 5 days ago" in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T026 [P] [US2] Test todo due 7 days ago displays "Due 7 days ago" in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T027 [P] [US2] Test todo due 10 days ago displays absolute date "Due Feb 17, 2026" in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T028 [P] [US2] Test todo due today displays "Due today" without overdue styling in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T029 [P] [US2] Test todo due tomorrow displays "Due tomorrow" in packages/frontend/src/components/__tests__/TodoCard.test.js

**Checkpoint**: User Story 2 complete - overdue dates show helpful relative time context

---

## Phase 5: User Story 3 - Theme Consistency for Overdue State (Priority: P3)

**Goal**: Overdue styling works appropriately in both light and dark themes with proper contrast ratios

**Independent Test**: Toggle between light and dark modes while viewing overdue todos, verify danger colors meet WCAG AA contrast (4.5:1 text, 3:1 backgrounds) in both themes

### Implementation for User Story 3

- [ ] T030 [US3] Add dark theme overrides for .overdue background tint using rgba(239, 83, 80, 0.08) in packages/frontend/src/App.css
- [ ] T031 [US3] Verify danger color variables exist for both themes in packages/frontend/src/styles/theme.css
- [ ] T032 [US3] Ensure .overdue .todo-due-date uses var(--danger-color) for theme adaptation in packages/frontend/src/App.css

### Tests for User Story 3

- [ ] T033 [P] [US3] Test overdue styling renders in light mode with proper class in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T034 [P] [US3] Test overdue styling renders in dark mode with proper class in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T035 [US3] Manual test: Verify light mode danger color (#c62828) achieves 6.57:1 contrast on white backgrounds using browser DevTools
- [ ] T036 [US3] Manual test: Verify dark mode danger color (#ef5350) achieves 4.89:1 contrast on dark backgrounds using browser DevTools

**Checkpoint**: User Story 3 complete - overdue feature works consistently across both themes

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, integration testing, and validation

- [ ] T037 Integration test: Mark overdue todo as complete and verify styling disappears in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T038 Integration test: Edit overdue todo's due date to future and verify styling updates in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T039 Integration test: Toggle theme while viewing overdue todos and verify styling updates in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T040 [P] Verify 80%+ test coverage maintained by running Jest coverage report
- [ ] T041 [P] Manual test: Screen reader announcement of clock icon aria-label
- [ ] T042 Run through all quickstart.md test scenarios for end-to-end validation
- [ ] T043 Code cleanup: Remove any unused imports or helper functions in packages/frontend/src/components/TodoCard.js

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ← BLOCKS all user stories
    ↓
Phase 3 (US1: Visual ID) ← Can start after foundational
    ↓
Phase 4 (US2: Date Display) ← Builds on US1 (same component)
    ↓
Phase 5 (US3: Themes) ← Builds on US1 & US2 (CSS refinements)
    ↓
Phase 6 (Polish)
```

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2 (date utilities) - NO dependencies on other stories
- **User Story 2 (P2)**: Depends on Phase 2 + US1 (same component/file) - enhances existing functionality
- **User Story 3 (P3)**: Depends on US1 & US2 (refines CSS) - ensures theme compatibility

### Within Each User Story

- Implementation tasks before test tasks (unless practicing TDD)
- Core logic → JSX updates → CSS styling → testing
- Parallel test tasks marked [P] can run simultaneously

### Critical Path

```
T001-T003 (Setup) → T004-T007 (Foundational) → T008-T020 (US1) → T021-T029 (US2) → T030-T036 (US3) → T037-T043 (Polish)
```

### Parallel Opportunities

**Phase 1 (Setup)**:
- T001, T002, T003 can all run in parallel (verification only)

**Phase 2 (Foundational)**:
- T004 & T005 can run in parallel (different functions)
- T006 & T007 must wait for T004 & T005 respectively

**Phase 3 (User Story 1 Tests)**:
- T015, T016, T017, T018, T019 can all run in parallel (independent test cases)

**Phase 4 (User Story 2 Tests)**:
- T024, T025, T026, T027, T028, T029 can all run in parallel (independent test cases)

**Phase 5 (User Story 3 Tests)**:
- T033, T034 can run in parallel (different theme scenarios)

**Phase 6 (Polish)**:
- T040, T041 can run in parallel (different validation types)

---

## Parallel Example: User Story 1 Tests

```bash
# After T008-T014 implementation complete, run all US1 tests in parallel:
✓ T015: Test overdue class for yesterday's date
✓ T016: Test no overdue for today
✓ T017: Test no overdue for completed
✓ T018: Test no overdue for no due date
✓ T019: Test clock icon presence
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) - Recommended

1. **Complete Phase 1**: Setup (T001-T003) - ~10 min
2. **Complete Phase 2**: Foundational date utilities (T004-T007) - ~45 min
3. **Complete Phase 3**: User Story 1 implementation + tests (T008-T020) - ~1.5 hours
4. **STOP and VALIDATE**: 
   - Run all US1 tests
   - Manual test in browser (create overdue todo, verify styling)
   - Verify clock icon appears and has proper accessibility
5. **DEMO/DEPLOY**: MVP delivers core value - users can identify overdue todos visually

**Estimated MVP Time**: 2-3 hours

### Incremental Delivery (All Stories)

1. **Foundation**: Setup + Foundational → ~1 hour
2. **US1**: Visual identification → Test independently → Deploy (MVP!)
3. **US2**: Relative dates → Test independently → Deploy (enhanced UX)
4. **US3**: Theme consistency → Test independently → Deploy (polish)
5. **Polish**: Edge cases + validation → Final deployment

**Total Estimated Time**: 4-6 hours

### Sequential Order (Single Developer)

```
Setup → Foundational → US1 → US2 → US3 → Polish
```

Each phase builds on the previous, minimal context switching.

### Parallel Team Strategy (Multiple Developers)

Not recommended for this feature - all work is in the same component file (TodoCard.js). Sequential implementation avoids merge conflicts.

However, if needed:
1. **Dev A**: T004-T007 (date utilities + tests)
2. **Dev B**: T011-T014 (CSS styling)
3. Once T004-T007 complete, **Dev A** continues with T008-T010 (JSX changes)
4. Merge and continue with remaining phases

---

## Task Summary

| Phase | Task Count | Estimated Time |
|-------|-----------|----------------|
| Phase 1: Setup | 3 | 10 min |
| Phase 2: Foundational | 4 | 45 min |
| Phase 3: User Story 1 | 13 | 1.5 hours |
| Phase 4: User Story 2 | 9 | 1 hour |
| Phase 5: User Story 3 | 7 | 45 min |
| Phase 6: Polish | 7 | 45 min |
| **TOTAL** | **43 tasks** | **4-6 hours** |

### Tasks by User Story

- **US1** (Visual Identification): 13 tasks (6 implementation + 6 tests + 1 integration)
- **US2** (Date Display): 9 tasks (3 implementation + 6 tests)
- **US3** (Theme Consistency): 7 tasks (3 implementation + 4 tests)
- **Setup + Foundational**: 7 tasks
- **Polish**: 7 tasks

### Parallel Opportunities Identified

- **11 test tasks** can run in parallel within their phases (marked with [P])
- **3 setup tasks** can verify in parallel (marked with [P])
- **2 foundational tasks** can implement in parallel (marked with [P])

### Independent Test Criteria Met

✅ **US1**: Can be tested independently by creating overdue todo and verifying visual styling  
✅ **US2**: Can be tested independently by checking relative date format display  
✅ **US3**: Can be tested independently by toggling themes and verifying styling

### MVP Scope Recommendation

**Deliver User Story 1 Only**: This provides immediate value by helping users visually identify overdue tasks. US2 and US3 are enhancements that can be added incrementally.

**MVP Tasks**: T001-T020 (27 tasks, ~2-3 hours)

---

## Format Validation

✅ All 43 tasks follow checklist format: `- [ ] [ID] [P?] [Story?] Description with file path`  
✅ All tasks include exact file paths  
✅ All user story tasks include [US1], [US2], or [US3] labels  
✅ Parallelizable tasks marked with [P]  
✅ Task IDs are sequential (T001-T043)

---

## Notes

- All tasks modify **frontend only** - no backend changes required
- Primary file: `packages/frontend/src/components/TodoCard.js`
- 80%+ test coverage target maintained per testing guidelines
- WCAG AA contrast requirements verified in US3
- Tests use Jest fake timers (`jest.setSystemTime()`) for deterministic date testing
- Feature is frontend-only so no API contract changes needed
