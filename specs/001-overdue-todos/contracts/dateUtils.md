# Date Utility Functions Contract

**Module**: Date utility functions for overdue todo feature  
**Location**: `packages/frontend/src/components/TodoCard.js` (inline utilities) or `packages/frontend/src/utils/dateUtils.js` (if extracted)  
**Purpose**: Provide date comparison and formatting for overdue todo detection and display

---

## Function: `isOverdue`

### Purpose
Determine if a todo item should be marked as overdue based on its due date and completion status.

### Signature

```javascript
function isOverdue(todo: Todo): boolean
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todo` | Object | Yes | Todo object with `dueDate` and `completed` fields |
| `todo.dueDate` | string \| null | Yes | ISO 8601 date string (YYYY-MM-DD) or null |
| `todo.completed` | boolean | Yes | Completion status (0 or 1) |

### Returns

**Type**: `boolean`

**Values**:
- `true`: Todo is overdue (incomplete + due date in the past)
- `false`: Todo is not overdue (any other case)

### Logic

```javascript
function isOverdue(todo) {
  // Not overdue if no due date or already completed
  if (!todo.dueDate || todo.completed) {
    return false;
  }
  
  // Normalize dates to midnight for day-level comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(todo.dueDate);
  due.setHours(0, 0, 0, 0);
  
  // Overdue if due date is strictly before today
  return due < today;
}
```

### Truth Table

| `dueDate` | `completed` | Today vs Due | Result | Reason |
|-----------|-------------|--------------|--------|--------|
| null | false | N/A | `false` | No due date → can't be late |
| null | true | N/A | `false` | No due date → can't be late |
| "2026-02-28" | false | due > today | `false` | Future date → not yet late |
| "2026-02-27" | false | due === today | `false` | Today is not overdue |
| "2026-02-26" | false | due < today | `true` | Past + incomplete = overdue |
| "2026-02-20" | false | due < today | `true` | Past + incomplete = overdue |
| "2026-02-20" | true | due < today | `false` | Completed → never overdue |

### Edge Cases

#### Invalid Date String
```javascript
isOverdue({ dueDate: "invalid", completed: false })
// Returns: false
// Reason: new Date("invalid") returns Invalid Date, comparison returns false
```

#### Timezone Handling
- Uses client's local timezone for both "today" and "dueDate"
- Normalizes to midnight to compare days, not times
- Consistent behavior across all timezones

#### Leap Years, DST
- JavaScript Date object handles calendar complexities
- `setHours(0,0,0,0)` ensures time components don't affect comparison

### Testing Requirements

#### Mock Current Date
Must use `jest.setSystemTime()` to set a known "today" for deterministic tests:

```javascript
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-02-27T12:00:00Z'));
});

afterEach(() => {
  jest.useRealTimers();
});
```

#### Test Cases

1. **No Due Date**: `{ dueDate: null, completed: false }` → `false`
2. **Completed Past Due**: `{ dueDate: '2026-02-20', completed: true }` → `false`
3. **Incomplete Today**: `{ dueDate: '2026-02-27', completed: false }` → `false`
4. **Incomplete Tomorrow**: `{ dueDate: '2026-02-28', completed: false }` → `false`
5. **Incomplete Yesterday**: `{ dueDate: '2026-02-26', completed: false }` → `true`
6. **Incomplete 7 Days Ago**: `{ dueDate: '2026-02-20', completed: false }` → `true`
7. **Incomplete 30 Days Ago**: `{ dueDate: '2026-01-28', completed: false }` → `true`

---

## Function: `formatDueDate`

### Purpose
Format a due date string for display, with relative formatting for recent dates and absolute formatting for older dates.

### Signature

```javascript
function formatDueDate(dueDate: string | null, isOverdue: boolean): string | null
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `dueDate` | string \| null | Yes | ISO 8601 date string (YYYY-MM-DD) or null |
| `isOverdue` | boolean | Yes | Whether the todo is overdue (from `isOverdue()`) |

### Returns

**Type**: `string | null`

**Values**:
- `null`: If `dueDate` is null or invalid
- Relative string: "Due today", "Due yesterday", "Due X days ago", "Due tomorrow", "Due in X days"
- Absolute string: "Due MMM D, YYYY" (e.g., "Due Feb 15, 2026")

### Logic

```javascript
function formatDueDate(dueDate, isOverdue) {
  if (!dueDate) return null;
  
  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return null; // Invalid date
  
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = today - due;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Relative formats (0-7 days)
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due yesterday';
  if (diffDays > 1 && diffDays <= 7) return `Due ${diffDays} days ago`;
  if (diffDays === -1) return 'Due tomorrow';
  if (diffDays < -1 && diffDays >= -7) return `Due in ${Math.abs(diffDays)} days`;
  
  // Absolute format (8+ days)
  const formatted = due.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  return `Due ${formatted}`;
}
```

### Format Examples

| Due Date | Current Date | Difference | Output |
|----------|--------------|------------|--------|
| 2026-02-27 | 2026-02-27 | 0 days | "Due today" |
| 2026-02-26 | 2026-02-27 | 1 day ago | "Due yesterday" |
| 2026-02-25 | 2026-02-27 | 2 days ago | "Due 2 days ago" |
| 2026-02-20 | 2026-02-27 | 7 days ago | "Due 7 days ago" |
| 2026-02-19 | 2026-02-27 | 8 days ago | "Due Feb 19, 2026" |
| 2026-01-15 | 2026-02-27 | 43 days ago | "Due Jan 15, 2026" |
| 2026-02-28 | 2026-02-27 | 1 day future | "Due tomorrow" |
| 2026-03-01 | 2026-02-27 | 2 days future | "Due in 2 days" |
| 2026-03-05 | 2026-02-27 | 6 days future | "Due in 6 days" |
| 2026-03-10 | 2026-02-27 | 11 days future | "Due Mar 10, 2026" |

### Edge Cases

#### Null Due Date
```javascript
formatDueDate(null, false)
// Returns: null
```

#### Invalid Date String
```javascript
formatDueDate("not-a-date", false)
// Returns: null
```

#### Exactly 7 Days
```javascript
// Current date: 2026-02-27
formatDueDate("2026-02-20", true) // 7 days ago
// Returns: "Due 7 days ago"
```

#### Exactly 8 Days
```javascript
// Current date: 2026-02-27
formatDueDate("2026-02-19", true) // 8 days ago
// Returns: "Due Feb 19, 2026"
```

### Localization

**Current Implementation**: `en-US` locale only

**Format**: Month abbreviations ("Jan", "Feb", "Mar", etc.)

**Future Consideration**: If internationalization needed, locale could be passed as parameter:
```javascript
formatDueDate(dueDate, isOverdue, locale = 'en-US')
```

### Testing Requirements

#### Mock Current Date
Same as `isOverdue()` - use `jest.setSystemTime()`:

```javascript
jest.setSystemTime(new Date('2026-02-27T12:00:00Z'));
```

#### Test Cases

1. **Today**: `formatDueDate('2026-02-27', false)` → `"Due today"`
2. **Yesterday**: `formatDueDate('2026-02-26', true)` → `"Due yesterday"`
3. **2 Days Ago**: `formatDueDate('2026-02-25', true)` → `"Due 2 days ago"`
4. **7 Days Ago**: `formatDueDate('2026-02-20', true)` → `"Due 7 days ago"`
5. **8 Days Ago**: `formatDueDate('2026-02-19', true)` → `"Due Feb 19, 2026"`
6. **30 Days Ago**: `formatDueDate('2026-01-28', true)` → `"Due Jan 28, 2026"`
7. **Tomorrow**: `formatDueDate('2026-02-28', false)` → `"Due tomorrow"`
8. **3 Days Future**: `formatDueDate('2026-03-02', false)` → `"Due in 3 days"`
9. **10 Days Future**: `formatDueDate('2026-03-09', false)` → `"Due Mar 9, 2026"`
10. **Null Date**: `formatDueDate(null, false)` → `null`
11. **Invalid Date**: `formatDueDate('invalid', false)` → `null`

---

## Performance Considerations

### `isOverdue()`
- **Complexity**: O(1) - constant time date comparison
- **Cost**: ~10-20 microseconds per call
- **Optimization**: Use React `useMemo()` to cache result and only recalculate on dependency changes

```javascript
const overdueStatus = React.useMemo(() => 
  isOverdue(todo), 
  [todo.dueDate, todo.completed]
);
```

### `formatDueDate()`
- **Complexity**: O(1) - constant time date formatting
- **Cost**: ~30-50 microseconds per call (includes `toLocaleDateString`)
- **Optimization**: Combine with `isOverdue` in single `useMemo`:

```javascript
const dueDateDisplay = React.useMemo(() => {
  const overdue = isOverdue(todo);
  const formatted = formatDueDate(todo.dueDate, overdue);
  return { overdue, formatted };
}, [todo.dueDate, todo.completed]);
```

---

## Integration Example

### In TodoCard Component

```javascript
function TodoCard({ todo, onToggle, onEdit, onDelete, isLoading }) {
  // ... existing state

  // Compute overdue status and formatted date
  const { isOverdueStatus, formattedDate } = React.useMemo(() => {
    const overdue = isOverdue(todo);
    const formatted = formatDueDate(todo.dueDate, overdue);
    return { isOverdueStatus: overdue, formattedDate: formatted };
  }, [todo.dueDate, todo.completed]);

  // ... render logic

  return (
    <div className={`todo-card ${todo.completed ? 'completed' : ''} ${isOverdueStatus ? 'overdue' : ''}`}>
      {/* ... */}
      {formattedDate && (
        <p className="todo-due-date">
          {isOverdueStatus && (
            <span className="overdue-icon" aria-label="Overdue" role="img">⏰</span>
          )}
          {formattedDate}
        </p>
      )}
      {/* ... */}
    </div>
  );
}
```

---

## Exports

If utilities are extracted to separate file:

```javascript
// packages/frontend/src/utils/dateUtils.js
export function isOverdue(todo) {
  // ... implementation
}

export function formatDueDate(dueDate, isOverdue) {
  // ... implementation
}
```

---

## Dependencies

- **External**: None (uses native JavaScript Date API)
- **Runtime**: Browser or Node.js (both support Date)

---

## Breaking Changes

**None.** These are new utility functions with no impact on existing code.
