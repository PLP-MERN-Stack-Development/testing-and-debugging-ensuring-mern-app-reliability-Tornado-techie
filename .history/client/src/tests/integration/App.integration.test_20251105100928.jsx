import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../App';

// Mock the bugService
jest.mock('../../services/BugService', () => ({
  bugAPI: {
    getBugs: jest.fn(() => Promise.resolve({ bugs: [] })),
    createBug: jest.fn(),
    updateBug: jest.fn(),
    deleteBug: jest.fn(),
    searchBugs: jest.fn()
  }
}));

import { bugAPI } from '../../services/BugService';

describe('App Integration Tests', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Setup default mock implementations
    bugAPI.getBugs.mockResolvedValue({ bugs: [] });
    bugAPI.createBug.mockImplementation((bugData) => 
      Promise.resolve({ ...bugData, _id: '1', createdAt: new Date().toISOString() })
    );
    bugAPI.updateBug.mockImplementation((id, bugData) => 
      Promise.resolve({ ...bugData, _id: id })
    );
    bugAPI.deleteBug.mockResolvedValue({ message: 'Bug deleted successfully' });
    bugAPI.searchBugs.mockResolvedValue([]);
  });

  it('should load and display the bug tracker app', async () => {
    render(<App />);
    
    expect(screen.getByText('🐛 MERN Bug Tracker')).toBeInTheDocument();
    expect(screen.getByText('Track and manage software bugs effectively')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(bugAPI.getBugs).toHaveBeenCalledTimes(1);
    });
  });

  it('should show and hide the bug form', async () => {
    render(<App />);
    
    const reportButton = screen.getByTestId('toggle-form-button');
    
    // Show form
    fireEvent.click(reportButton);
    expect(screen.getByTestId('bug-form-section')).toBeInTheDocument();
    
    // Hide form
    fireEvent.click(reportButton);
    expect(screen.queryByTestId('bug-form-section')).not.toBeInTheDocument();
  });

  it('should create a new bug', async () => {
    render(<App />);
    
    // Show form
    fireEvent.click(screen.getByTestId('toggle-form-button'));
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/title \*/i), {
      target: { value: 'Integration Test Bug' }
    });
    fireEvent.change(screen.getByLabelText(/description \*/i), {
      target: { value: 'This is an integration test bug' }
    });
    fireEvent.change(screen.getByLabelText(/reporter \*/i), {
      target: { value: 'Integration Tester' }
    });
    
    // Submit form
    fireEvent.click(screen.getByText(/report bug/i));
    
    await waitFor(() => {
      expect(bugAPI.createBug).toHaveBeenCalledWith({
        title: 'Integration Test Bug',
        description: 'This is an integration test bug',
        priority: 'medium',
        status: 'open',
        stepsToReproduce: [''],
        expectedBehavior: '',
        actualBehavior: '',
        environment: { os: '', browser: '', device: '' },
        reporter: 'Integration Tester',
        assignee: '',
        tags: []
      });
    });
  });

  it('should search for bugs', async () => {
    render(<App />);
    
    const searchInput = screen.getByTestId('search-input');
    const searchForm = searchInput.closest('form');
    
    fireEvent.change(searchInput, { target: { value: 'login' } });
    fireEvent.submit(searchForm);
    
    await waitFor(() => {
      expect(bugAPI.searchBugs).toHaveBeenCalledWith('login');
    });
  });

  it('should filter bugs by status', async () => {
    render(<App />);
    
    const statusFilter = screen.getByTestId('status-filter');
    fireEvent.change(statusFilter, { target: { value: 'open' } });
    
    await waitFor(() => {
      expect(bugAPI.getBugs).toHaveBeenCalledWith({ status: 'open' });
    });
  });

  it('should display error message when API fails', async () => {
    bugAPI.getBugs.mockRejectedValueOnce({
      response: { data: { error: 'Failed to fetch bugs' } }
    });
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('error-banner')).toBeInTheDocument();
    });
  });
});