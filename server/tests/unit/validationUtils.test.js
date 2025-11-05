import { validateBugData, sanitizeBugData } from '../../src/utils/validationUtils.js';

describe('Validation Utilities', () => {
  describe('validateBugData', () => {
    it('should return no errors for valid bug data', () => {
      const validBug = {
        title: 'Test Bug',
        description: 'This is a test bug description',
        status: 'open',
        priority: 'medium',
        reporter: 'John Doe'
      };

      const errors = validateBugData(validBug);
      expect(errors).toHaveLength(0);
    });

    it('should return error for missing title', () => {
      const invalidBug = {
        description: 'This is a test bug description',
        reporter: 'John Doe'
      };

      const errors = validateBugData(invalidBug);
      expect(errors).toContain('Title is required');
    });

    it('should return error for title too long', () => {
      const invalidBug = {
        title: 'A'.repeat(101),
        description: 'This is a test bug description',
        reporter: 'John Doe'
      };

      const errors = validateBugData(invalidBug);
      expect(errors).toContain('Title cannot exceed 100 characters');
    });

    it('should return error for invalid status', () => {
      const invalidBug = {
        title: 'Test Bug',
        description: 'This is a test bug description',
        status: 'invalid-status',
        reporter: 'John Doe'
      };

      const errors = validateBugData(invalidBug);
      expect(errors).toContain('Invalid status value');
    });

    it('should return error for invalid priority', () => {
      const invalidBug = {
        title: 'Test Bug',
        description: 'This is a test bug description',
        priority: 'invalid-priority',
        reporter: 'John Doe'
      };

      const errors = validateBugData(invalidBug);
      expect(errors).toContain('Invalid priority value');
    });
  });

  describe('sanitizeBugData', () => {
    it('should trim string fields', () => {
      const unsanitizedBug = {
        title: '  Test Bug  ',
        description: '  This is a test  ',
        reporter: '  John Doe  ',
        assignee: '  Jane Smith  '
      };

      const sanitized = sanitizeBugData(unsanitizedBug);
      expect(sanitized.title).toBe('Test Bug');
      expect(sanitized.description).toBe('This is a test');
      expect(sanitized.reporter).toBe('John Doe');
      expect(sanitized.assignee).toBe('Jane Smith');
    });

    it('should not modify non-string fields', () => {
      const bugData = {
        title: 'Test Bug',
        status: 'open',
        priority: 'high',
        tags: ['ui', 'bug']
      };

      const sanitized = sanitizeBugData(bugData);
      expect(sanitized.status).toBe('open');
      expect(sanitized.priority).toBe('high');
      expect(sanitized.tags).toEqual(['ui', 'bug']);
    });
  });
});