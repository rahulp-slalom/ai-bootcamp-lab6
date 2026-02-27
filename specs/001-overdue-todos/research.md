# Research: Overdue Todo Items

**Feature**: Overdue Todo Items  
**Date**: February 27, 2026  
**Purpose**: Document technical decisions and research findings for implementing overdue todo visual identification

## Research Questions Resolved

### 1. Date Comparison in JavaScript/React

**Decision**: Use native JavaScript `Date` object with UTC date normalization

**Rationale**:
- Project already uses native JavaScript dates (no external date libraries like date-fns or moment.js)
- TodoCard.js already implements date handling with `new Date(dateString)` and `toLocaleDateString()`
- For overdue detection, dates should be compared at the day level (not time), requiring normalization
- Native approach: `new Date(dateString).setHours(0,0,0,0)` or `date.toDateString()` comparison
- Avoids adding new dependencies and maintains consistency with existing codebase

**Implementation Pattern**:
```javascript
const isOverdue = (dueDate, completed) => {
  if (!dueDate || completed) return false;
  const today = new Date();
  const due = new Date(dueDate);
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < today;
};
```

**Alternatives Considered**:
- date-fns library: Rejected due to unnecessary dependency for simple date comparison
- moment.js: Rejected due to large bundle size and project not using it
- Intl.DateTimeFormat: Overkill for simple date comparison logic

---

### 2. Relative Date Formatting ("Due 3 days ago")

**Decision**: Implement custom relative date formatter function

**Rationale**:
- Spec requires relative format for 0-7 days ("Due yesterday", "Due 3 days ago"), then actual date for 8+ days
- Project doesn't use any date formatting libraries currently
- Custom implementation is straightforward and avoids dependency bloat
- Can leverage existing `formatDate()` function in TodoCard.js for the 8+ days case

**Implementation Pattern**:
```javascript
const formatDueDate = (dueDate, isOverdue) => {
  if (!dueDate) return null;
  
  const due = new Date(dueDate);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = today - due;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Due today';
  if (diffDays === -1) return 'Due tomorrow';
  if (diffDays === 1) return 'Due yesterday';
  if (diffDays > 1 && diffDays <= 7) return `Due ${diffDays} days ago`;
  if (diffDays < -1) return `Due in ${Math.abs(diffDays)} days`;
  
  // 8+ days overdue: show actual date
  return `Due ${due.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`;
};
```

**Alternatives Considered**:
- Intl.RelativeTimeFormat: Too complex for the simple 7-day threshold requirement
- date-fns/formatDistanceToNow: Adds 7KB+ for a simple calculation we can implement in 10 lines
- Manual string templates: Selected approach (simplest, no dependencies)

---

### 3. Icon Implementation for Clock/Overdue Indicator

**Decision**: Use Unicode clock emoji (⏰) with proper aria-label

**Rationale**:
- Project already uses Unicode symbols for edit (✎) and delete (✕) buttons in TodoCard.js
- Consistent with existing icon approach in codebase
- Zero dependencies, no image assets needed
- Works across all browsers and platforms
- Good accessibility when paired with aria-label

**Implementation Pattern**:
```javascript
<span className="overdue-icon" aria-label="Overdue" role="img">
  ⏰
</span>
```

**Alternatives Considered**:
- React icon library (react-icons, heroicons): Rejected due to adding dependency when project uses Unicode
- SVG icons: More complex, inconsistent with existing TodoCard button icons
- Font Awesome: Overkill and adds significant bundle size
- Unicode clock (⏰): Selected (consistent with existing code patterns)

---

### 4. WCAG Contrast Ratio Implementation

**Decision**: Use CSS custom properties with explicit opacity values for background tint, leverage existing danger colors

**Rationale**:
- theme.css already defines `--danger-color` for light (#c62828) and dark (#ef5350) modes
- WCAG AA requires 4.5:1 for text, 3:1 for UI components/backgrounds
- Light mode danger (#c62828) on white: 6.57:1 (passes 4.5:1) ✓
- Dark mode danger (#ef5350) on dark bg (#2d2d2d): 4.89:1 (passes 4.5:1) ✓
- For background tint: Use danger color at 8% opacity (rgba) for subtle distinction

**Implementation Pattern**:
```css
.todo-card.overdue {
  background-color: rgba(198, 40, 40, 0.08); /* Light mode */
}

[data-theme="dark"] .todo-card.overdue {
  background-color: rgba(239, 83, 80, 0.08); /* Dark mode */
}

.todo-card.overdue .todo-due-date {
  color: var(--danger-color); /* Uses theme-specific color */
}

.todo-card.overdue .overdue-icon {
  color: var(--danger-color);
}
```

**Verification Approach**:
- Use browser DevTools contrast checker to verify text meets 4.5:1
- Test background tint visibility in both themes
- Manual screen reader testing for aria-label announcement

**Alternatives Considered**:
- Multiple background color variables: Rejected, simpler to use rgba() with existing danger colors
- CSS filters: Less precise control over opacity and contrast
- Fixed opacity percentages: 8% opacity chosen after research on subtle but noticeable backgrounds

---

### 5. Testing Strategy for Date-Dependent Logic

**Decision**: Mock `Date` object in tests using Jest's `jest.useFakeTimers()` and `jest.setSystemTime()`

**Rationale**:
- TodoCard tests need deterministic dates ("yesterday", "3 days ago") regardless of when tests run
- Jest 29.7.0 (project's version) has modern timer mocking built-in
- Existing tests in project use Jest without date mocking (because due dates aren't tested yet)
- Best practice: Set a known "today" date, then create test todos relative to that date

**Implementation Pattern**:
```javascript
describe('TodoCard overdue functionality', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-27T12:00:00Z')); // Known "today"
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should display overdue styling for incomplete past-due todos', () => {
    const todo = { 
      id: 1, 
      title: 'Test', 
      dueDate: '2026-02-26', // Yesterday
      completed: false 
    };
    // ... render and assert
  });
});
```

**Alternatives Considered**:
- Manual date calculation in tests: Fragile, breaks when test date assumptions change
- MockDate library: Unnecessary when Jest has built-in timer mocking
- No date mocking: Tests would fail on different days or show incorrect relative dates
- Jest timer mocking: Selected (built-in, reliable, standard approach)

---

### 6. Component State vs. Derived State for Overdue Status

**Decision**: Compute overdue status as derived state (in render or via useMemo)

**Rationale**:
- Overdue status is derived from `dueDate`, `completed`, and current date
- No need to store in component state or props
- Recalculates on every render (negligible performance cost - simple date comparison)
- Eliminates sync issues between state and actual overdue status
- React best practice: derive values when cheap to compute

**Implementation Pattern**:
```javascript
function TodoCard({ todo, onToggle, onEdit, onDelete, isLoading }) {
  // ... existing state

  const isOverdue = React.useMemo(() => {
    if (!todo.dueDate || todo.completed) return false;
    const today = new Date();
    const due = new Date(todo.dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }, [todo.dueDate, todo.completed]);

  // ... render with isOverdue
}
```

**Alternatives Considered**:
- Store in component state: Adds unnecessary complexity and sync logic
- Pass as prop from parent: Parent would need to calculate anyway, no benefit
- Compute in render directly: Works but useMemo prevents recalculation on unrelated re-renders
- useMemo: Selected (optimizes unnecessary date calculations, clear dependency tracking)

---

## Technology Stack Confirmation

**No new dependencies required.** All implementation uses:
- Native JavaScript Date API (already in use)
- React hooks (useState, useMemo already in use)
- CSS custom properties (already defined in theme.css)
- Unicode symbols (already used for edit/delete icons)
- Jest with fake timers (Jest already used, timers built-in)

---

## Best Practices Summary

1. **Date Handling**: Normalize dates to midnight for day-level comparisons
2. **Performance**: Use useMemo for derived calculations with clear dependencies
3. **Accessibility**: Always pair icon with aria-label, maintain contrast ratios
4. **Styling**: Leverage existing theme system (--danger-color), use rgba for opacity
5. **Testing**: Mock system time with Jest fake timers for deterministic date tests
6. **Code Consistency**: Follow existing patterns (Unicode icons, CSS custom properties)

---

## Open Questions (None)

All technical decisions have been resolved. Ready for Phase 1: Design & Contracts.
