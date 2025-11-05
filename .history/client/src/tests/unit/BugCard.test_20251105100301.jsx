import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BugCard from '../../components/BugCard';

describe('BugCard Component', () => {
  const mockBug = {
    _id: '1',
    title: 'Test Bug',
    description: 'This is a test bug description',
    status: 'open',
    priority: 'high',
    reporter: 'John Doe',
    assignee: 'Jane Smith',
    tags: ['ui', 'bug'],
    createdAt: '2023-10-01T00:00:00.000Z'
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnStatusChange = jest.fn();

  const defaultProps = {
    bug: mockBug,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    onStatusChange: mockOnStatusChange
  };

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
    mockOnStatusChange.mockClear();
  });

  it('renders bug information correctly', () => {
    render(<BugCard {...defaultProps} />);
    
    expect(screen.getByText('Test Bug')).toBeInTheDocument();
    expect(screen.getByText('This is a test bug description')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('ui')).toBeInTheDocument();
    expect(screen.getByText('bug')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<BugCard {...defaultProps} />);
    
    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockBug);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<BugCard {...defaultProps} />);
    
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('calls onStatusChange when status is changed', () => {
    render(<BugCard {...defaultProps} />);
    
    const statusSelect = screen.getByTestId('status-select');
    fireEvent.change(statusSelect, { target: { value: 'in-progress' } });

    expect(mockOnStatusChange).toHaveBeenCalledWith('1', 'in-progress');
  });

  it('applies correct priority class', () => {
    render(<BugCard {...defaultProps} />);
    
    const bugCard = screen.getByTestId('bug-card');
    expect(bugCard).toHaveClass('priority-high');
  });

  it('renders without assignee when not provided', () => {
    const bugWithoutAssignee = { ...mockBug, assignee: undefined };
    render(<BugCard {...defaultProps} bug={bugWithoutAssignee} />);
    
    expect(screen.queryByText('Assignee:')).not.toBeInTheDocument();
  });

  it('renders without tags when not provided', () => {
    const bugWithoutTags = { ...mockBug, tags: [] };
    render(<BugCard {...defaultProps} bug={bugWithoutTags} />);
    
    expect(screen.queryByText('ui')).not.toBeInTheDocument();
  });
});