import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard, { isOverdue, formatDueDate } from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/Due Dec 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });
});
// Phase 2: Date Utility Functions Tests
describe('isOverdue function', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Set a known "today" for deterministic testing: February 27, 2026
    jest.setSystemTime(new Date('2026-02-27T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return true for incomplete todo with past due date', () => {
    const todo = { dueDate: '2026-02-26', completed: false };
    expect(isOverdue(todo)).toBe(true);
  });

  it('should return false for completed todo with past due date', () => {
    const todo = { dueDate: '2026-02-20', completed: true };
    expect(isOverdue(todo)).toBe(false);
  });

  it('should return false for todo without due date', () => {
    const todo = { dueDate: null, completed: false };
    expect(isOverdue(todo)).toBe(false);
  });

  it('should return false for todo due today', () => {
    const todo = { dueDate: '2026-02-27', completed: false };
    expect(isOverdue(todo)).toBe(false);
  });

  it('should return false for todo with future due date', () => {
    const todo = { dueDate: '2026-02-28', completed: false };
    expect(isOverdue(todo)).toBe(false);
  });
});

describe('formatDueDate function', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Set a known "today" for deterministic testing: February 27, 2026
    jest.setSystemTime(new Date('2026-02-27T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return "Due today" for today\'s date', () => {
    expect(formatDueDate('2026-02-27', false)).toBe('Due today');
  });

  it('should return "Due yesterday" for 1 day ago', () => {
    expect(formatDueDate('2026-02-26', true)).toBe('Due yesterday');
  });

  it('should return "Due X days ago" for 2-7 days ago', () => {
    expect(formatDueDate('2026-02-25', true)).toBe('Due 2 days ago');
    expect(formatDueDate('2026-02-20', true)).toBe('Due 7 days ago');
  });

  it('should return formatted date for 8+ days ago', () => {
    const result = formatDueDate('2026-02-19', true);
    expect(result).toContain('Due');
    expect(result).toContain('Feb');
    expect(result).toContain('19');
    expect(result).toContain('2026');
  });

  it('should return null for null dueDate', () => {
    expect(formatDueDate(null, false)).toBe(null);
  });
});

// Phase 3: User Story 1 - Overdue Visual Identification Tests
describe('TodoCard overdue functionality', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Set a known "today" for deterministic testing: February 27, 2026
    jest.setSystemTime(new Date('2026-02-27T12:00:00Z'));
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  it('should render with overdue CSS class for incomplete past-due todo', () => {
    const overdueTodo = {
      id: 1,
      title: 'Overdue Task',
      dueDate: '2026-02-26',
      completed: false,
      createdAt: '2026-02-20T00:00:00Z'
    };
    const { container } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('overdue');
  });

  it('should NOT render overdue class for todo due today', () => {
    const todayTodo = {
      id: 1,
      title: 'Today Task',
      dueDate: '2026-02-27',
      completed: false,
      createdAt: '2026-02-20T00:00:00Z'
    };
    const { container } = render(<TodoCard todo={todayTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).not.toHaveClass('overdue');
  });

  it('should NOT render overdue class for completed past-due todo', () => {
    const completedOverdue = {
      id: 1,
      title: 'Completed Task',
      dueDate: '2026-02-20',
      completed: true,
      createdAt: '2026-02-15T00:00:00Z'
    };
    const { container } = render(<TodoCard todo={completedOverdue} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).not.toHaveClass('overdue');
  });

  it('should NOT render overdue class for todo without due date', () => {
    const noDateTodo = {
      id: 1,
      title: 'No Date Task',
      dueDate: null,
      completed: false,
      createdAt: '2026-02-20T00:00:00Z'
    };
    const { container } = render(<TodoCard todo={noDateTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).not.toHaveClass('overdue');
  });

  it('should render clock icon for overdue todos', () => {
    const overdueTodo = {
      id: 1,
      title: 'Overdue Task',
      dueDate: '2026-02-26',
      completed: false,
      createdAt: '2026-02-20T00:00:00Z'
    };
    render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
    
    const clockIcon = screen.getByLabelText('Overdue');
    expect(clockIcon).toBeInTheDocument();
    expect(clockIcon).toHaveAttribute('role', 'img');
  });

  it('should NOT render clock icon for non-overdue todos', () => {
    const normalTodo = {
      id: 1,
      title: 'Normal Task',
      dueDate: '2026-03-01',
      completed: false,
      createdAt: '2026-02-20T00:00:00Z'
    };
    render(<TodoCard todo={normalTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
  });
});

// Phase 4: User Story 2 - Relative Date Display Tests
describe('TodoCard relative date display', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-27T12:00:00Z'));
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  it('should display "Due yesterday" for todo due 1 day ago', () => {
    const todo = {
      id: 1,
      title: 'Task',
      dueDate: '2026-02-26',
      completed: false,
      createdAt: '2026-02-20T00:00:00Z'
    };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText(/Due yesterday/)).toBeInTheDocument();
  });

  it('should display "Due X days ago" for todo due 2-7 days ago', () => {
    const todo = {
      id: 1,
      title: 'Task',
      dueDate: '2026-02-25',
      completed: false,
      createdAt: '2026-02-20T00:00:00Z'
    };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText(/Due 2 days ago/)).toBeInTheDocument();
  });

  it('should display formatted date for todo due 8+ days ago', () => {
    const todo = {
      id: 1,
      title: 'Task',
      dueDate: '2026-02-15',
      completed: false,
      createdAt: '2026-02-10T00:00:00Z'
    };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    
    const dueText = screen.getByText(/Due Feb/);
    expect(dueText).toBeInTheDocument();
  });

  it('should display "Due today" for todo due today', () => {
    const todo = {
      id: 1,
      title: 'Task',
      dueDate: '2026-02-27',
      completed: false,
      createdAt: '2026-02-20T00:00:00Z'
    };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText(/Due today/)).toBeInTheDocument();
  });

  it('should display "Due tomorrow" for todo due tomorrow', () => {
    const todo = {
      id: 1,
      title: 'Task',
      dueDate: '2026-02-28',
      completed: false,
      createdAt: '2026-02-20T00:00:00Z'
    };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText(/Due tomorrow/)).toBeInTheDocument();
  });

  it('should include "Due" prefix in relative date format', () => {
    const todo = {
      id: 1,
      title: 'Task',
      dueDate: '2026-02-26',
      completed: false,
      createdAt: '2026-02-20T00:00:00Z'
    };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText(/^Due/)).toBeInTheDocument();
  });
});

// Phase 6: Integration Tests
describe('TodoCard integration tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-27T12:00:00Z'));
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockHandlers = {
    onToggle: jest.fn().mockResolvedValue(undefined),
    onEdit: jest.fn().mockResolvedValue(undefined),
    onDelete: jest.fn().mockResolvedValue(undefined)
  };

  it('should update styling when overdue todo is marked complete', async () => {
    const overdueTodo = {
      id: 1,
      title: 'Overdue Task',
      dueDate: '2026-02-26',
      completed: false,
      createdAt: '2026-02-20T00:00:00Z'
    };
    
    const { container, rerender } = render(
      <TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />
    );
    
    // Initially overdue
    let card = container.querySelector('.todo-card');
    expect(card).toHaveClass('overdue');
    
    // Simulate completing the todo
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    // Rerender with completed todo
    const completedTodo = { ...overdueTodo, completed: true };
    rerender(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    // Should no longer be overdue
    card = container.querySelector('.todo-card');
    expect(card).not.toHaveClass('overdue');
  });

  it('should update styling when overdue todo due date is edited to future', () => {
    const overdueTodo = {
      id: 1,
      title: 'Overdue Task',
      dueDate: '2026-02-26',
      completed: false,
      createdAt: '2026-02-20T00:00:00Z'
    };
    
    const { container, rerender } = render(
      <TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />
    );
    
    // Initially overdue
    let card = container.querySelector('.todo-card');
    expect(card).toHaveClass('overdue');
    
    // Rerender with future due date
    const updatedTodo = { ...overdueTodo, dueDate: '2026-03-01' };
    rerender(<TodoCard todo={updatedTodo} {...mockHandlers} isLoading={false} />);
    
    // Should no longer be overdue
    card = container.querySelector('.todo-card');
    expect(card).not.toHaveClass('overdue');
  });
});