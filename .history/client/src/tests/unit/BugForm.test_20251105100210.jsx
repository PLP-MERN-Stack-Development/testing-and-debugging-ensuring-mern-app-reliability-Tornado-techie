import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BugForm from '../../components/BugForm';

// Mock console.error to avoid expected error messages in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Warning:')) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

describe('BugForm Component', () => {
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
    initialData: {},
    isEditing: false
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders the form with all fields', () => {
    render(<BugForm {...defaultProps} />);
    
    expect(screen.getByLabelText(/title \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reporter \*/i)).toBeInTheDocument();
    expect(screen.getByText(/report bug/i)).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    render(<BugForm {...defaultProps} />);
    
    const submitButton = screen.getByText(/report bug/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
      expect(screen.getByText('Reporter name is required')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<BugForm {...defaultProps} />);
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/title \*/i), {
      target: { value: 'Test Bug Title' }
    });
    fireEvent.change(screen.getByLabelText(/description \*/i), {
      target: { value: 'Test bug description' }
    });
    fireEvent.change(screen.getByLabelText(/reporter \*/i), {
      target: { value: 'John Doe' }
    });

    const submitButton = screen.getByText(/report bug/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Bug Title',
        description: 'Test bug description',
        priority: 'medium',
        status: 'open',
        stepsToReproduce: [''],
        expectedBehavior: '',
        actualBehavior: '',
        environment: { os: '', browser: '', device: '' },
        reporter: 'John Doe',
        assignee: '',
        tags: []
      });
    });
  });

  it('allows adding and removing steps to reproduce', () => {
    render(<BugForm {...defaultProps} />);
    
    const addStepButton = screen.getByText(/add step/i);
    fireEvent.click(addStepButton);

    // Should now have two step inputs
    const stepInputs = screen.getAllByPlaceholderText(/step \d+/i);
    expect(stepInputs).toHaveLength(2);

    // Remove a step
    const removeButtons = screen.getAllByText(/remove/i);
    fireEvent.click(removeButtons[0]);

    // Should have one step input remaining
    const remainingInputs = screen.getAllByPlaceholderText(/step \d+/i);
    expect(remainingInputs).toHaveLength(1);
  });

  it('pre-fills form when editing', () => {
    const initialData = {
      title: 'Existing Bug',
      description: 'Existing description',
      priority: 'high',
      status: 'in-progress',
      reporter: 'Jane Doe'
    };

    render(<BugForm {...defaultProps} initialData={initialData} isEditing={true} />);
    
    expect(screen.getByLabelText(/title \*/i)).toHaveValue('Existing Bug');
    expect(screen.getByLabelText(/description \*/i)).toHaveValue('Existing description');
    expect(screen.getByLabelText(/priority/i)).toHaveValue('high');
    expect(screen.getByLabelText(/status/i)).toHaveValue('in-progress');
    expect(screen.getByLabelText(/reporter \*/i)).toHaveValue('Jane Doe');
    expect(screen.getByText(/update bug/i)).toBeInTheDocument();
  });

  it('handles tag addition and removal', () => {
    render(<BugForm {...defaultProps} />);
    
    const tagInput = screen.getByPlaceholderText(/add a tag/i);
    const addTagButton = screen.getByText(/add tag/i);

    // Add a tag
    fireEvent.change(tagInput, { target: { value: 'ui' } });
    fireEvent.click(addTagButton);

    expect(screen.getByText('ui')).toBeInTheDocument();

    // Remove the tag
    const removeTagButton = screen.getByText('×');
    fireEvent.click(removeTagButton);

    expect(screen.queryByText('ui')).not.toBeInTheDocument();
  });
});