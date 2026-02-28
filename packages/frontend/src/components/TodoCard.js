import React, { useState, useMemo } from 'react';

// Date utility functions for overdue detection and formatting

/**
 * Determine if a todo is overdue
 * @param {Object} todo - Todo object with dueDate and completed fields
 * @returns {boolean} - True if overdue, false otherwise
 */
export function isOverdue(todo) {
  if (!todo.dueDate || todo.completed) {
    return false;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(todo.dueDate);
  due.setHours(0, 0, 0, 0);
  
  return due < today;
}

/**
 * Format due date with relative text for recent dates
 * @param {string|null} dueDate - ISO date string (YYYY-MM-DD) or null
 * @param {boolean} isOverdueStatus - Whether the todo is overdue
 * @returns {string|null} - Formatted date string or null
 */
export function formatDueDate(dueDate, isOverdueStatus) {
  if (!dueDate) return null;
  
  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return null;
  
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

function TodoCard({ todo, onToggle, onEdit, onDelete, isLoading }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');
  const [editError, setEditError] = useState(null);

  // Compute overdue status and formatted date
  const overdueStatus = useMemo(() => isOverdue(todo), [todo.dueDate, todo.completed]);
  const formattedDueDate = useMemo(() => formatDueDate(todo.dueDate, overdueStatus), [todo.dueDate, overdueStatus]);

  const handleToggle = async () => {
    try {
      await onToggle(todo.id);
    } catch (err) {
      console.error('Failed to toggle todo:', err);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditError(null);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
    setEditDueDate(todo.dueDate || '');
    setEditError(null);
  };

  const handleEditSubmit = async () => {
    if (!editTitle.trim()) {
      setEditError('Title cannot be empty');
      return;
    }

    if (editTitle.length > 255) {
      setEditError('Title cannot exceed 255 characters');
      return;
    }

    try {
      await onEdit(todo.id, editTitle.trim(), editDueDate || null);
      setIsEditing(false);
      setEditError(null);
    } catch (err) {
      setEditError(err.message || 'Failed to update todo');
    }
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this todo? This action cannot be undone.')) {
      onDelete(todo.id);
    }
  };

  if (isEditing) {
    return (
      <div className="todo-card todo-card-edit">
        <div className="edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            maxLength={255}
            className="form-input"
            placeholder="Todo title"
            disabled={isLoading}
            aria-label="Edit todo title"
          />
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="form-input"
            disabled={isLoading}
            aria-label="Edit due date"
          />
          <div className="edit-actions">
            <button
              onClick={handleEditSubmit}
              disabled={isLoading}
              className="btn btn-primary btn-sm"
            >
              Save
            </button>
            <button
              onClick={handleEditCancel}
              disabled={isLoading}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
          </div>
          {editError && <div className="form-error">{editError}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-card ${todo.completed ? 'completed' : ''} ${overdueStatus ? 'overdue' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed === 1}
        onChange={handleToggle}
        disabled={isLoading}
        className="todo-checkbox"
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />

      <div className="todo-content">
        <h3 className="todo-title">{todo.title}</h3>
        {todo.dueDate && (
          <p className="todo-due-date">
            {overdueStatus && (
              <span className="overdue-icon" aria-label="Overdue" role="img">
                ⏰
              </span>
            )}
            {formattedDueDate}
          </p>
        )}
      </div>

      <div className="todo-actions">
        <button
          onClick={handleEditClick}
          disabled={isLoading}
          className="btn-icon btn-edit"
          title="Edit todo"
          aria-label={`Edit "${todo.title}"`}
        >
          ✎
        </button>
        <button
          onClick={handleDeleteClick}
          disabled={isLoading}
          className="btn-icon btn-delete"
          title="Delete todo"
          aria-label={`Delete "${todo.title}"`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default TodoCard;
