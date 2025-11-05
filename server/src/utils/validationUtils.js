// Utility functions for validation (for unit testing)
export const validateBugData = (bugData) => {
  const errors = [];
  
  if (!bugData.title || bugData.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (bugData.title.length > 100) {
    errors.push('Title cannot exceed 100 characters');
  }
  
  if (!bugData.description || bugData.description.trim().length === 0) {
    errors.push('Description is required');
  } else if (bugData.description.length > 1000) {
    errors.push('Description cannot exceed 1000 characters');
  }
  
  if (bugData.status && !['open', 'in-progress', 'resolved', 'closed'].includes(bugData.status)) {
    errors.push('Invalid status value');
  }
  
  if (bugData.priority && !['low', 'medium', 'high', 'critical'].includes(bugData.priority)) {
    errors.push('Invalid priority value');
  }
  
  return errors;
};

export const sanitizeBugData = (bugData) => {
  const sanitized = { ...bugData };
  
  if (sanitized.title) sanitized.title = sanitized.title.trim();
  if (sanitized.description) sanitized.description = sanitized.description.trim();
  if (sanitized.reporter) sanitized.reporter = sanitized.reporter.trim();
  if (sanitized.assignee) sanitized.assignee = sanitized.assignee.trim();
  
  return sanitized;
};