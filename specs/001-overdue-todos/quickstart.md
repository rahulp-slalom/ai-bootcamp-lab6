# Quickstart: Overdue Todo Items

**Feature**: Overdue Todo Items  
**Estimated Time**: 2-4 hours  
**Difficulty**: Intermediate  
**Prerequisites**: Basic React, CSS, Jest experience

## Overview

Implement visual identification for overdue todos by adding client-side date comparison and conditional styling to the TodoCard component. No backend changes required.

---

## Implementation Checklist

### Phase 1: Date Utilities (30 min)
- [ ] Add `isOverdue()` function to TodoCard.js
- [ ] Add `formatDueDate()` function to TodoCard.js
- [ ] Add `useMemo` hooks for computed values

### Phase 2: UI & Styling (45 min)
- [ ] Add `.overdue` CSS class with danger color background tint
- [ ] Add clock icon (⏰) before overdue due dates
- [ ] Update due date display to use relative formatting
- [ ] Ensure WCAG AA contrast in both light/dark themes

### Phase 3: Testing (1-2 hours)
- [ ] Write tests for `isOverdue()` logic (7+ test cases)
- [ ] Write tests for `formatDueDate()` formatting (10+ test cases)
- [ ] Write TodoCard rendering tests for overdue scenarios
- [ ] Write TodoCard interaction tests (toggle, edit)
- [ ] Verify 80%+ code coverage maintained

### Phase 4: Manual QA (30 min)
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Verify screen reader compatibility
- [ ] Test edge cases (timezone, DST, invalid dates)

---

## Step-by-Step Implementation

### Step 1: Add Date Utility Functions

**File**: `packages/frontend/src/components/TodoCard.js`

Add these functions at the top of the file (before the TodoCard component):

```javascript
// Determine if a todo is overdue
function isOverdue(todo) {
  if (!todo.dueDate || todo.completed) {
    return false;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(todo.dueDate);
  due.setHours(0, 0, 0, 0);
  
  return due < today;
}

// Format due date with relative text for recent dates
function formatDueDate(dueDate, isOverdueStatus) {
  if (!dueDate) return null;
  
  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return null;
  
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = today - due;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due yesterday';
  if (diffDays > 1 && diffDays <= 7) return `Due ${diffDays} days ago`;
  if (diffDays === -1) return 'Due tomorrow';
  if (diffDays < -1 && diffDays >= -7) return `Due in ${Math.abs(diffDays)} days`;
  
  const formatted = due.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  return `Due ${formatted}`;
}
```

### Step 2: Update TodoCard Component

Inside the TodoCard function, add computed values using `useMemo`:

```javascript
function TodoCard({ todo, onToggle, onEdit, onDelete, isLoading }) {
  const [isEditing, setIsEditing] = useState(false);
  // ... existing state

  // Compute overdue status and formatted date
  const dueDateInfo = React.useMemo(() => {
    const overdueStatus = isOverdue(todo);
    const formatted = formatDueDate(todo.dueDate, overdueStatus);
    return { isOverdue: overdueStatus, formatted };
  }, [todo.dueDate, todo.completed]);

  // ... rest of component
}
```

### Step 3: Update JSX Rendering

Replace the existing todo-card div and due date rendering:

**Before**:
```javascript
return (
  <div className={`todo-card ${todo.completed ? 'completed' : ''}`}>
    {/* ... */}
    {todo.dueDate && (
      <p className="todo-due-date">
        Due: {formatDate(todo.dueDate)}
      </p>
    )}
    {/* ... */}
  </div>
);
```

**After**:
```javascript
return (
  <div className={`todo-card ${todo.completed ? 'completed' : ''} ${dueDateInfo.isOverdue ? 'overdue' : ''}`}>
    {/* ... */}
    {dueDateInfo.formatted && (
      <p className="todo-due-date">
        {dueDateInfo.isOverdue && (
          <span className="overdue-icon" aria-label="Overdue" role="img">
            ⏰{' '}
          </span>
        )}
        {dueDateInfo.formatted}
      </p>
    )}
    {/* ... */}
  </div>
);
```

**Note**: Remove the old `formatDate()` function if no longer used elsewhere.

### Step 4: Add CSS Styling

**File**: `packages/frontend/src/App.css`

Add these styles for overdue todos:

```css
/* Overdue todo styling */
.todo-card.overdue {
  background-color: rgba(198, 40, 40, 0.08); /* Light mode danger tint */
  border-left: 3px solid var(--danger-color);
}

[data-theme="dark"] .todo-card.overdue {
  background-color: rgba(239, 83, 80, 0.08); /* Dark mode danger tint */
}

.todo-card.overdue .todo-due-date {
  color: var(--danger-color);
  font-weight: 500;
}

.overdue-icon {
  color: var(--danger-color);
  margin-right: 4px;
}

/* Ensure completed todos never show overdue styling */
.todo-card.completed.overdue {
  background-color: var(--bg-surface);
  border-left: none;
}

.todo-card.completed .todo-due-date,
.todo-card.completed .overdue-icon {
  color: var(--text-secondary);
}
```

---

## Testing Implementation

### Step 5: Write Utility Function Tests

**File**: `packages/frontend/src/components/__tests__/TodoCard.test.js`

Add date mocking and utility tests:

```javascript
describe('Date Utility Functions', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-27T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('isOverdue', () => {
    it('returns false for todos without due dates', () => {
      const todo = { dueDate: null, completed: false };
      expect(isOverdue(todo)).toBe(false);
    });

    it('returns false for completed todos with past due dates', () => {
      const todo = { dueDate: '2026-02-20', completed: true };
      expect(isOverdue(todo)).toBe(false);
    });

    it('returns false for todos due today', () => {
      const todo = { dueDate: '2026-02-27', completed: false };
      expect(isOverdue(todo)).toBe(false);
    });

    it('returns false for todos due in the future', () => {
      const todo = { dueDate: '2026-03-01', completed: false };
      expect(isOverdue(todo)).toBe(false);
    });

    it('returns true for incomplete todos with past due dates', () => {
      const todo = { dueDate: '2026-02-26', completed: false };
      expect(isOverdue(todo)).toBe(true);
    });

    it('returns true for todos overdue by multiple days', () => {
      const todo = { dueDate: '2026-02-20', completed: false };
      expect(isOverdue(todo)).toBe(true);
    });
  });

  describe('formatDueDate', () => {
    it('returns "Due today" for today\'s date', () => {
      expect(formatDueDate('2026-02-27', false)).toBe('Due today');
    });

    it('returns "Due yesterday" for yesterday', () => {
      expect(formatDueDate('2026-02-26', true)).toBe('Due yesterday');
    });

    it('returns relative format for 2-7 days ago', () => {
      expect(formatDueDate('2026-02-25', true)).toBe('Due 2 days ago');
      expect(formatDueDate('2026-02-20', true)).toBe('Due 7 days ago');
    });

    it('returns absolute date for 8+ days ago', () => {
      expect(formatDueDate('2026-02-19', true)).toBe('Due Feb 19, 2026');
      expect(formatDueDate('2026-01-15', true)).toBe('Due Jan 15, 2026');
    });

    it('returns "Due tomorrow" for tomorrow', () => {
      expect(formatDueDate('2026-02-28', false)).toBe('Due tomorrow');
    });

    it('returns null for null date', () => {
      expect(formatDueDate(null, false)).toBe(null);
    });
  });
});
```

### Step 6: Write TodoCard Rendering Tests

Add these tests to the existing TodoCard test suite:

```javascript
describe('TodoCard Overdue Functionality', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-27T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('applies overdue styling to incomplete past-due todos', () => {
    const todo = {
      id: 1,
      title: 'Overdue task',
      dueDate: '2026-02-20',
      completed: false
    };

    render(<TodoCard todo={todo} onToggle={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />);
    
    const card = screen.getByText('Overdue task').closest('.todo-card');
    expect(card).toHaveClass('overdue');
  });

  it('displays clock icon for overdue todos', () => {
    const todo = {
      id: 1,
      title: 'Overdue task',
      dueDate: '2026-02-20',
      completed: false
    };

    render(<TodoCard todo={todo} onToggle={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />);
    
    const icon = screen.getByLabelText('Overdue');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent('⏰');
  });

  it('does not apply overdue styling to completed todos', () => {
    const todo = {
      id: 1,
      title: 'Completed overdue task',
      dueDate: '2026-02-20',
      completed: true
    };

    render(<TodoCard todo={todo} onToggle={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />);
    
    const card = screen.getByText('Completed overdue task').closest('.todo-card');
    expect(card).not.toHaveClass('overdue');
    expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
  });

  it('displays relative date format for recent overdue todos', () => {
    const todo = {
      id: 1,
      title: 'Recent overdue',
      dueDate: '2026-02-25',
      completed: false
    };

    render(<TodoCard todo={todo} onToggle={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />);
    
    expect(screen.getByText(/Due 2 days ago/)).toBeInTheDocument();
  });

  it('displays absolute date format for old overdue todos', () => {
    const todo = {
      id: 1,
      title: 'Old overdue',
      dueDate: '2026-02-10',
      completed: false
    };

    render(<TodoCard todo={todo} onToggle={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />);
    
    expect(screen.getByText(/Due Feb 10, 2026/)).toBeInTheDocument();
  });
});
```

### Step 7: Run Tests

```bash
# From project root
npm run test:frontend

# Or from frontend directory
cd packages/frontend
npm test
```

**Expected Results**:
- All new tests pass
- Existing tests still pass
- Code coverage remains above 80%

---

## Manual Testing

### Test in Browser

1. **Start the application**:
   ```bash
   npm run start
   ```

2. **Create test todos with past dates**:
   - Open browser console and modify existing todos:
   ```javascript
   // In browser console (navigate to http://localhost:3000):
   // Create a todo via UI, then inspect network request to get ID
   // Manually edit localStorage or use API
   ```

3. **Verify visual styling**:
   - [ ] Overdue todos have light red/pink background tint
   - [ ] Overdue todos have clock icon before due date
   - [ ] Overdue due date text is red/danger colored
   - [ ] Completed todos with past dates have NO overdue styling

4. **Test theme switching**:
   - [ ] Toggle dark mode (if ThemeToggle component exists)
   - [ ] Verify overdue styling visible in both modes
   - [ ] Check contrast using browser DevTools

5. **Test interactions**:
   - [ ] Mark overdue todo complete → styling disappears
   - [ ] Edit overdue todo's date to future → styling disappears
   - [ ] Uncheck completed overdue todo → styling reappears

6. **Test accessibility**:
   - [ ] Tab through todos with keyboard
   - [ ] Enable screen reader (VoiceOver/NVDA/JAWS)
   - [ ] Verify "Overdue" is announced for clock icon
   - [ ] Verify relative date is announced

---

## Troubleshooting

### Issue: Overdue styling not showing

**Causes**:
- className not applied correctly
- CSS not loaded
- Date comparison logic error

**Debug**:
```javascript
// Add console.log in TodoCard
console.log('Due Date:', todo.dueDate, 'Overdue:', dueDateInfo.isOverdue);
```

### Issue: Tests failing with date mismatches

**Cause**: Forgot to mock system time

**Fix**: Ensure `jest.useFakeTimers()` and `jest.setSystemTime()` in beforeEach

### Issue: Clock icon not displaying

**Cause**: Font encoding issue

**Fix**: Ensure file is saved as UTF-8, or use HTML entity `&#x23F0;`

---

## Success Criteria

✅ **Functional**:
- Overdue todos display clock icon and danger styling
- Completed todos never show overdue styling
- Relative date format works for 0-7 days
- Absolute date format works for 8+ days

✅ **Testing**:
- All tests pass
- 80%+ code coverage maintained
- All 13+ acceptance scenarios covered

✅ **Accessibility**:
- WCAG AA contrast ratios met
- Screen reader announces overdue status
- Keyboard navigation works

✅ **Visual**:
- Works in light and dark themes
- Styling matches design system

---

## Next Steps

After implementation:
1. Commit changes with descriptive message
2. Run full test suite: `npm test`
3. Push to feature branch: `git push origin 001-overdue-todos`
4. Create pull request with checklist from spec
5. Request code review

---

## Reference Files

- **Feature Spec**: `specs/001-overdue-todos/spec.md`
- **Research**: `specs/001-overdue-todos/research.md`
- **Data Model**: `specs/001-overdue-todos/data-model.md`
- **Contracts**: `specs/001-overdue-todos/contracts/`
- **Component**: `packages/frontend/src/components/TodoCard.js`
- **Tests**: `packages/frontend/src/components/__tests__/TodoCard.test.js`
- **Styles**: `packages/frontend/src/App.css`, `packages/frontend/src/styles/theme.css`
