# Feature Specification: Overdue Todo Items

**Feature Branch**: `001-overdue-todos`  
**Created**: February 27, 2026  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items - Users need a clear, visual way to identify which todos have not been completed by their due date."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Identification of Overdue Items (Priority: P1)

As a todo application user, when I view my todo list, any incomplete task with a due date that has passed should be visually distinct so I can immediately identify tasks requiring urgent attention without manually comparing dates.

**Why this priority**: This is the core value proposition of the feature. Without visual distinction, users gain no benefit from the overdue detection system. This delivers immediate, actionable value.

**Independent Test**: Can be fully tested by creating an incomplete todo with yesterday's date, viewing the list, and verifying that the overdue todo is visually distinct (e.g., different color styling). Delivers immediate value by helping users spot overdue tasks at a glance.

**Acceptance Scenarios**:

1. **Given** I have an incomplete todo with a due date of yesterday, **When** I view my todo list, **Then** that todo should be displayed with overdue styling (distinct visual treatment)
2. **Given** I have an incomplete todo with a due date of today, **When** I view my todo list, **Then** that todo should NOT be displayed with overdue styling (today is not overdue)
3. **Given** I have a completed todo with a due date of yesterday, **When** I view my todo list, **Then** that todo should NOT be displayed with overdue styling (completed tasks are never overdue)
4. **Given** I have an incomplete todo with no due date, **When** I view my todo list, **Then** that todo should NOT have overdue styling (no due date means not overdue)
5. **Given** I have an incomplete todo with a due date in the future, **When** I view my todo list, **Then** that todo should NOT have overdue styling

---

### User Story 2 - Overdue Date Display Enhancement (Priority: P2)

As a user viewing an overdue todo, I want the due date display to clearly indicate it's overdue (e.g., "Due 3 days ago" instead of just the date) so I understand how late the task is without mental calculation.

**Why this priority**: Enhances the user experience by providing context about how overdue an item is. While lower priority than visual distinction, it adds meaningful information for prioritization decisions.

**Independent Test**: Can be tested independently by creating overdue todos with various past dates and verifying the relative time display (e.g., "Due yesterday", "Due 5 days ago"). Delivers additional context beyond basic visual identification.

**Acceptance Scenarios**:

1. **Given** I have an overdue todo that was due yesterday, **When** I view the todo, **Then** the due date should display as "Due yesterday" or similar relative format
2. **Given** I have an overdue todo that was due 5 days ago, **When** I view the todo, **Then** the due date should display as "Due 5 days ago" or similar relative format
3. **Given** I have a todo due today, **When** I view the todo, **Then** the due date should display as "Due today"
4. **Given** I have a todo due tomorrow, **When** I view the todo, **Then** the due date should display normally (not overdue) such as "Due tomorrow" or the formatted date

---

### User Story 3 - Theme Consistency for Overdue State (Priority: P3)

As a user who switches between light and dark themes, I want overdue todos to be clearly visible and appropriately styled in both themes so the feature works consistently regardless of my theme preference.

**Why this priority**: Ensures accessibility and consistency with existing theme system. While important for polish, the feature provides value even without perfect theme tuning.

**Independent Test**: Can be tested by toggling between light and dark modes while viewing overdue todos and verifying appropriate contrast and visibility in both themes. Ensures feature quality across the app's theme system.

**Acceptance Scenarios**:

1. **Given** I have overdue todos in my list and light mode enabled, **When** I view the list, **Then** overdue todos should use appropriate light mode warning/danger colors with sufficient contrast
2. **Given** I have overdue todos in my list and dark mode enabled, **When** I view the list, **Then** overdue todos should use appropriate dark mode warning/danger colors with sufficient contrast
3. **Given** I switch from light to dark mode while viewing overdue todos, **When** the theme changes, **Then** overdue styling should update appropriately without page refresh

---

### Edge Cases

- What happens when a todo becomes overdue while the user is viewing the list? (No auto-refresh needed; overdue status updates on next manual refresh/interaction)
- How does the system handle timezones for due date comparison? (Use local browser time for date comparison; due date inputs are already date-only without time)
- What if a user marks an overdue todo as complete? (Overdue styling immediately disappears as completed todos are never considered overdue)
- How are todos sorted when multiple are overdue? (Maintain existing sort order: newest first by creation date; overdue status does not affect sort order)
- What happens when editing an overdue todo's due date to a future date? (After save, overdue styling should disappear as it's no longer overdue)

## Constitution Alignment *(mandatory)*

- **Scope Discipline**: This feature stays within the simple single-user todo scope by enhancing the existing view functionality without adding filtering, search, or complex prioritization systems. It builds on the existing due date feature (already in scope) to provide better visual feedback. No new entity types or workflows are introduced.

- **API Contract Impact**: Minimal backend impact. The backend already stores due dates; overdue calculation happens client-side by comparing stored due date against current date. No API contract changes required—frontend reads existing `dueDate` field and `completed` status. Backend remains unchanged unless we add optional server-side filtering later (out of initial scope).

- **Testing Impact**: Requires new behavior tests for TodoCard component to verify overdue styling logic and date comparison. Tests must cover:
  - Overdue detection for incomplete todos with past due dates
  - No overdue styling for completed todos, todos without due dates, or future-dated todos
  - Relative date display for overdue items
  - Theme-specific styling in light/dark modes
  - Target: maintain 80%+ coverage with new TodoCard test cases

- **UI/Accessibility Impact**: 
  - Overdue styling should use danger color from existing palette (light mode: `#c62828`, dark mode: `#ef5350`)
  - Visual distinction must not rely solely on color—consider adding an icon or text indicator for accessibility
  - Screen readers should announce overdue status (add `aria-label` or visually hidden text like "Overdue: ")
  - Keyboard navigation and focus states must work identically for overdue and normal todos
  - Relative date format ("Due 3 days ago") provides semantic value for all users

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST calculate overdue status client-side by comparing todo's due date (if present) against current date, considering a todo overdue only if incomplete AND due date < today
- **FR-002**: System MUST apply distinct visual styling to overdue todos that is immediately recognizable and consistent with the application's danger/warning color palette
- **FR-003**: Overdue styling MUST NOT be applied to completed todos regardless of their due date
- **FR-004**: Overdue styling MUST NOT be applied to todos without a due date or with due dates today or in the future
- **FR-005**: System MUST display overdue dates in a relative format (e.g., "Due yesterday", "Due 3 days ago") that clearly communicates the overdue state
- **FR-006**: Overdue visual treatment MUST be accessible to screen reader users through appropriate ARIA labels or hidden text (e.g., "Overdue: " prefix)
- **FR-007**: Overdue styling MUST adapt appropriately to both light and dark themes with sufficient color contrast per WCAG guidelines
- **FR-008**: When a user marks an overdue todo as complete or updates its due date to future/today, overdue styling MUST immediately disappear
- **FR-009**: Overdue status MUST NOT affect the existing sort order (newest first by creation date)

### Key Entities *(include if feature involves data)*

- **Todo (existing entity, no changes)**: Already includes `dueDate` (ISO date string or null), `completed` (boolean), `title`, `id`, and `createdAt`
- **Overdue State (computed)**: Derived client-side; not persisted. Calculated as: `!completed && dueDate && new Date(dueDate) < startOfToday()`

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify overdue todos within 2 seconds of viewing their list without needing to read individual dates (verified through visual distinction testing)
- **SC-002**: Overdue styling meets WCAG AA contrast ratio requirements (4.5:1 for text) in both light and dark themes
- **SC-003**: 100% of overdue detection logic is covered by automated tests, including all edge cases (completed, no due date, today, future, past)
- **SC-004**: Overdue relative date format is displayed consistently and accurately for dates ranging from today to 30+ days ago
- **SC-005**: Screen reader users receive clear overdue status announcements (verified through accessibility testing with screen reader simulation)
