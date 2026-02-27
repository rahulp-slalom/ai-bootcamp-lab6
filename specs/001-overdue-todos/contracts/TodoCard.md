# TodoCard Component Contract

**Component**: `TodoCard`  
**Location**: `packages/frontend/src/components/TodoCard.js`  
**Purpose**: Display a single todo item with overdue visual indicators when applicable

## Component Signature

```javascript
function TodoCard({
  todo,
  onToggle,
  onEdit,
  onDelete,
  isLoading
}): JSX.Element
```

---

## Props

### `todo` (Object, required)

Todo item to display with the following shape:

```typescript
{
  id: number,           // Unique identifier
  title: string,        // Todo description (1-255 chars)
  completed: boolean,   // Completion status (0 or 1)
  dueDate: string | null, // ISO date string (YYYY-MM-DD) or null
  createdAt: string     // ISO timestamp
}
```

**Validation**:
- `id`: Must be a positive integer
- `title`: Non-empty string, max 255 characters
- `completed`: Boolean (0 for false, 1 for true)
- `dueDate`: ISO 8601 date string or null
- `createdAt`: ISO 8601 timestamp string

**Example**:
```javascript
{
  id: 1,
  title: "Complete user research",
  completed: false,
  dueDate: "2026-02-25",
  createdAt: "2026-02-20T10:00:00Z"
}
```

### `onToggle` (Function, required)

Callback when user toggles completion status.

**Signature**: `(todoId: number) => Promise<void>`

**Parameters**:
- `todoId`: ID of the todo to toggle

**Behavior**:
- Called when checkbox is clicked
- Should update backend and trigger re-render
- Component handles loading state during async operation

**Example**:
```javascript
const handleToggle = async (todoId) => {
  const updatedTodo = await todoService.toggleTodo(todoId);
  setTodos(prev => prev.map(t => t.id === todoId ? updatedTodo : t));
};
```

### `onEdit` (Function, required)

Callback when user saves edited todo.

**Signature**: `(todoId: number, title: string, dueDate: string | null) => Promise<void>`

**Parameters**:
- `todoId`: ID of the todo to update
- `title`: New title (trimmed, 1-255 chars)
- `dueDate`: New due date (ISO string or null)

**Behavior**:
- Called when "Save" button clicked in edit mode
- Should validate and update backend
- Throws error on validation failure (component displays error message)

**Example**:
```javascript
const handleEdit = async (todoId, title, dueDate) => {
  if (!title.trim() || title.length > 255) {
    throw new Error('Invalid title');
  }
  const updated = await todoService.updateTodo(todoId, { title, dueDate });
  setTodos(prev => prev.map(t => t.id === todoId ? updated : t));
};
```

### `onDelete` (Function, required)

Callback when user deletes todo.

**Signature**: `(todoId: number) => Promise<void>`

**Parameters**:
- `todoId`: ID of the todo to delete

**Behavior**:
- Called after confirmation dialog (handled by component)
- Should delete from backend and remove from UI
- Component handles loading state

**Example**:
```javascript
const handleDelete = async (todoId) => {
  await todoService.deleteTodo(todoId);
  setTodos(prev => prev.filter(t => t.id !== todoId));
};
```

### `isLoading` (Boolean, optional, default: false)

Disables interactive elements during async operations.

**Effect**:
- When `true`: Disables checkbox, edit/delete buttons, form inputs
- When `false`: All interactive elements enabled

---

## Rendering Behavior

### Standard Todo (Not Overdue)

```html
<div class="todo-card">
  <input type="checkbox" class="todo-checkbox" />
  <div class="todo-content">
    <h3 class="todo-title">Title</h3>
    <p class="todo-due-date">Due: February 28, 2026</p>
  </div>
  <div class="todo-actions">
    <button class="btn-icon btn-edit">✎</button>
    <button class="btn-icon btn-delete">✕</button>
  </div>
</div>
```

### Overdue Todo (Past Due + Incomplete)

**Condition**: `!todo.completed && todo.dueDate && new Date(todo.dueDate) < today`

```html
<div class="todo-card overdue">
  <input type="checkbox" class="todo-checkbox" />
  <div class="todo-content">
    <h3 class="todo-title">Title</h3>
    <p class="todo-due-date">
      <span class="overdue-icon" aria-label="Overdue" role="img">⏰</span>
      Due 2 days ago
    </p>
  </div>
  <div class="todo-actions">
    <button class="btn-icon btn-edit">✎</button>
    <button class="btn-icon btn-delete">✕</button>
  </div>
</div>
```

**Overdue Styling**:
- `.todo-card.overdue`: Background tint with danger color (8% opacity)
- `.todo-due-date`: Text color set to `var(--danger-color)`
- `.overdue-icon`: Clock emoji with danger color
- Icon includes `aria-label="Overdue"` for screen readers

### Completed Todo (Never Overdue)

```html
<div class="todo-card completed">
  <input type="checkbox" checked class="todo-checkbox" />
  <div class="todo-content">
    <h3 class="todo-title">Title</h3>
    <p class="todo-due-date">Due: February 25, 2026</p>
  </div>
  <div class="todo-actions">
    <button class="btn-icon btn-edit">✎</button>
    <button class="btn-icon btn-delete">✕</button>
  </div>
</div>
```

**Note**: Completed todos **never** receive overdue styling, even if `dueDate` is in the past.

### Edit Mode

```html
<div class="todo-card todo-card-edit">
  <div class="edit-form">
    <input type="text" value="Title" class="form-input" />
    <input type="date" value="2026-02-28" class="form-input" />
    <div class="edit-actions">
      <button class="btn btn-primary btn-sm">Save</button>
      <button class="btn btn-secondary btn-sm">Cancel</button>
    </div>
  </div>
</div>
```

---

## Due Date Formatting

### Relative Format (0-7 Days)

| Time Difference | Display Text | When Applied |
|-----------------|--------------|--------------|
| Due is today | "Due today" | dueDate === today |
| Due is tomorrow | "Due tomorrow" | dueDate === today + 1 day |
| 1 day overdue | "Due yesterday" | dueDate === today - 1 day |
| 2-7 days overdue | "Due X days ago" | dueDate between today - 7 and today - 2 |
| Future (2+ days) | "Due in X days" | dueDate >= today + 2 |

### Absolute Format (8+ Days)

For todos overdue by 8 or more days, display actual date:

**Format**: "Due MMM D, YYYY" (e.g., "Due Feb 15, 2026")

**Implementation**: Uses `Date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })`

---

## Accessibility Requirements

### Checkbox
- `aria-label`: "Mark '{title}' as {complete|incomplete}"
- Keyboard navigable (standard `<input type="checkbox">`)

### Edit/Delete Buttons
- `aria-label`: "Edit '{title}'" / "Delete '{title}'"
- `title` attribute for tooltip
- Keyboard navigable (standard `<button>`)

### Overdue Icon
- `role="img"`: Identifies emoji as image
- `aria-label="Overdue"`: Screen reader announcement
- Positioned inline next to due date text

### Contrast Requirements
- Text on background: 4.5:1 minimum (WCAG AA)
- Background tint: 3:1 minimum for UI components
- Danger color in light mode (#c62828): 6.57:1 on white ✓
- Danger color in dark mode (#ef5350): 4.89:1 on dark bg ✓

---

## State Management

### Internal State
- `isEditing` (boolean): Controls edit mode visibility
- `editTitle` (string): Temporary title during editing
- `editDueDate` (string): Temporary due date during editing
- `editError` (string | null): Validation error message

### Derived State (Computed)
- `isOverdue` (boolean): Calculated from `todo.dueDate`, `todo.completed`, and current date
- Not stored in state; recalculated on each render (optimized with `useMemo`)

---

## CSS Classes Applied

| Class | When Applied | Purpose |
|-------|--------------|---------|
| `todo-card` | Always | Base card styling |
| `completed` | When `todo.completed === true` | Strikethrough, reduced opacity |
| `overdue` | When `isOverdue() === true` | Danger background tint, text color |
| `todo-card-edit` | When `isEditing === true` | Edit mode container |

---

## Interaction Flow

### Marking Overdue Todo Complete

1. User views overdue todo (has `.overdue` class)
2. User clicks checkbox
3. `onToggle(todo.id)` called → backend updates `completed: true`
4. Parent re-renders TodoCard with updated todo
5. `isOverdue()` returns false (completed todos never overdue)
6. `.overdue` class removed, danger styling disappears

### Editing Overdue Todo's Due Date

1. User clicks edit button on overdue todo
2. Edit mode displays with current `dueDate` value
3. User changes date to future date
4. User clicks "Save" → `onEdit(id, title, newDueDate)` called
5. Backend updates todo
6. Parent re-renders TodoCard
7. `isOverdue()` returns false (due date now in future)
8. `.overdue` class removed

---

## Edge Cases

### Invalid Date Strings
If `todo.dueDate` contains an invalid date string:
- `new Date(invalidDate)` returns `Invalid Date`
- Comparison `Invalid Date < today` returns `false`
- Result: No overdue styling (safe default)

### Null Due Date
- `isOverdue()` returns `false`
- No due date text displayed
- No overdue styling

### System Time Changes
- Overdue status recalculated on each render
- Uses client's current system time
- If system time changes, next render reflects new overdue status

### Timezone Differences
- Both "today" and "dueDate" use same timezone (client local time)
- Normalizes to midnight for day-level comparison
- Consistent behavior regardless of client timezone

---

## Testing Contract

### Required Test Cases

1. **Overdue Detection**
   - Incomplete todo with yesterday's date → overdue styling
   - Incomplete todo with date 7 days ago → overdue styling
   - Incomplete todo with date 10 days ago → overdue styling
   - Completed todo with past date → no overdue styling
   - Incomplete todo with today's date → no overdue styling
   - Incomplete todo with future date → no overdue styling
   - Todo with no due date → no overdue styling

2. **Date Formatting**
   - Yesterday: "Due yesterday"
   - 3 days ago: "Due 3 days ago"
   - 10 days ago: "Due Feb 17, 2026"
   - Today: "Due today"
   - Tomorrow: "Due tomorrow"

3. **Theme Compatibility**
   - Overdue styling visible in light mode
   - Overdue styling visible in dark mode
   - Contrast ratios meet WCAG AA

4. **State Transitions**
   - Toggle overdue todo complete → styling removed
   - Edit overdue todo to future date → styling removed
   - Complete overdue todo → styling removed

5. **Accessibility**
   - Clock icon has aria-label
   - Screen reader announces overdue status
   - Keyboard navigation works

---

## Dependencies

### External
- React (already used)
- No additional libraries required

### Internal
- `packages/frontend/src/styles/theme.css`: Danger color variables
- `packages/frontend/src/App.css`: Base TodoCard styling

---

## Breaking Changes

**None.** This is additive functionality:
- Existing TodoCard props unchanged
- Existing CSS classes preserved
- No backend contract changes
- Backward compatible with existing todos
