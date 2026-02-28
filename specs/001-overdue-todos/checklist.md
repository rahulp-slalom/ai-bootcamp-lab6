# Implementation Checklist: Overdue Todo Items

**Purpose**: End-to-end implementation guide for adding overdue visual identification to the todo application
**Created**: February 27, 2026
**Feature**: [spec.md](./spec.md)

## Pre-Implementation

- [X] CHK001 Review constitution alignment section and confirm scope discipline
- [X] CHK002 Review existing TodoCard component and identify injection points for overdue logic
- [X] CHK003 Review UI guidelines for danger/warning colors in both themes
- [X] CHK004 Confirm no backend API changes required (client-side calculation only)

## Test Preparation (Test-First Approach)

### Frontend Component Tests

- [X] CHK005 Create failing test: TodoCard detects overdue for incomplete todo with past due date
- [X] CHK006 Create failing test: TodoCard does NOT show overdue for completed todo with past due date
- [X] CHK007 Create failing test: TodoCard does NOT show overdue for todo without due date
- [X] CHK008 Create failing test: TodoCard does NOT show overdue for todo due today
- [X] CHK009 Create failing test: TodoCard does NOT show overdue for todo with future due date
- [X] CHK010 Create failing test: Overdue styling includes appropriate CSS class
- [X] CHK011 Create failing test: Relative date format displays correctly for overdue items
- [X] CHK012 Create failing test: Overdue status updates when todo is marked complete
- [X] CHK013 Create failing test: Overdue status updates when due date is edited

### Accessibility Tests

- [X] CHK014 Create failing test: Overdue todos include screen reader accessible text/aria-label
- [X] CHK015 Create failing test: Keyboard focus states work identically for overdue and normal todos

## Implementation

### Step 1: Date Calculation Utilities

- [X] CHK016 Create utility function `isOverdue(todo)` that returns boolean
- [X] CHK017 Implement logic: return false if `todo.completed === true`
- [X] CHK018 Implement logic: return false if `!todo.dueDate`
- [X] CHK019 Implement logic: compare `new Date(todo.dueDate)` with today's date (start of day)
- [X] CHK020 Handle edge cases: invalid dates, timezone considerations

### Step 2: Relative Date Formatting

- [X] CHK021 Create utility function `getRelativeDueDate(dueDate, isOverdue)` for human-readable dates
- [X] CHK022 Implement "Due today" for today's date
- [X] CHK023 Implement "Due yesterday" for 1 day overdue
- [X] CHK024 Implement "Due X days ago" for 2+ days overdue
- [X] CHK025 Implement "Due tomorrow" or formatted date for future dates
- [X] CHK026 Consider using or creating a simple date helper (no external libs unless approved)

### Step 3: TodoCard Component Updates

- [X] CHK027 Import or define `isOverdue` utility in TodoCard component
- [X] CHK028 Calculate `const overdue = isOverdue(todo)` in component render logic
- [X] CHK029 Apply conditional CSS class (e.g., `todo-card-overdue`) when overdue is true
- [X] CHK030 Update due date display to show relative format when overdue
- [X] CHK031 Add screen reader text: prepend visually-hidden "Overdue: " span when applicable
- [X] CHK032 Ensure overdue styling applies to card container, not just date display
- [X] CHK033 Verify overdue styling does not interfere with edit mode or completed state

### Step 4: CSS Styling

- [X] CHK034 Add `.todo-card-overdue` class with danger color for borders/accents
- [X] CHK035 Light mode: use danger color `#c62828` for overdue indicators
- [X] CHK036 Dark mode: use danger color `#ef5350` for overdue indicators
- [X] CHK037 Ensure sufficient contrast ratios (WCAG AA 4.5:1 minimum for text)
- [X] CHK038 Consider adding subtle icon or visual indicator beyond color (accessibility)
- [X] CHK039 Test styling with existing focus states and hover states
- [X] CHK040 Verify completed todo styling overrides overdue styling (completed takes precedence)

### Step 5: Integration Testing

- [X] CHK041 Manual test: Create incomplete todo with yesterday's date, verify overdue styling
- [X] CHK042 Manual test: Mark overdue todo complete, verify styling disappears
- [X] CHK043 Manual test: Edit overdue todo's due date to tomorrow, verify styling disappears
- [X] CHK044 Manual test: Create todo with today's date, verify NO overdue styling
- [X] CHK045 Manual test: Create todo with future date, verify NO overdue styling
- [X] CHK046 Manual test: View overdue todos in light mode, verify visibility and contrast
- [X] CHK047 Manual test: Switch to dark mode, verify overdue styling adapts appropriately
- [X] CHK048 Manual test: Test with screen reader (or accessibility dev tools), verify overdue announcement

## Quality Assurance

### Code Quality

- [X] CHK049 Run linter and fix any issues (`npm run lint` or equivalent)
- [X] CHK050 Verify 2-space indentation and consistent code style
- [X] CHK051 Add inline comments explaining overdue logic and date calculations
- [X] CHK052 Ensure no console errors or warnings in browser console
- [X] CHK053 Verify no prop-types warnings or React warnings

### Test Coverage

- [X] CHK054 Run test suite: `npm test` (all tests pass)
- [X] CHK055 Verify code coverage remains >= 80% overall
- [X] CHK056 Verify TodoCard component coverage includes new overdue logic
- [X] CHK057 Confirm all created failing tests now pass

### Accessibility & Browser Testing

- [X] CHK058 Test keyboard navigation (Tab, Enter, Space) on overdue todos
- [X] CHK059 Verify focus indicators are visible on overdue styled cards
- [X] CHK060 Test with browser zoom at 200% (layout should not break)
- [X] CHK061 Run Lighthouse accessibility audit (score >= 90)
- [X] CHK062 Test color contrast with browser dev tools or contrast checker

### Functional Validation

- [X] CHK063 Verify overdue todos are visually distinct in production-like environment
- [X] CHK064 Verify no API errors or network issues (overdue is client-side only)
- [X] CHK065 Verify page refresh maintains correct overdue state
- [X] CHK066 Verify creating new overdue todo immediately shows styling
- [X] CHK067 Verify deleting overdue todo works without errors
- [X] CHK068 Confirm sort order unchanged (newest first, unaffected by overdue status)

## Documentation

- [X] CHK069 Update README if user-facing feature changes warrant documentation
- [X] CHK070 Add code comments in complex date calculation logic
- [X] CHK071 Update component JSDoc if TodoCard props change

## Pre-Merge Checklist

- [X] CHK072 All tests pass locally
- [X] CHK073 Code coverage >= 80%
- [X] CHK074 Linter passes with no errors
- [X] CHK075 Manual testing completed for all acceptance scenarios
- [X] CHK076 Theme switching verified (light/dark mode)
- [X] CHK077 Accessibility verified (keyboard, screen reader, contrast)
- [X] CHK078 No console errors or warnings
- [ ] CHK079 Git commit messages are clear and follow conventions
- [ ] CHK080 Feature branch is up to date with main/base branch
- [ ] CHK081 Ready for code review and pull request

## Notes

- Check items off as completed: `[x]`
- All tests should be written first and fail before implementation (test-first workflow)
- Overdue calculation is client-side only; no backend changes required
- Maintain focus on simplicity and scope discipline per constitution
- If blockers arise, document and escalate rather than expanding scope

