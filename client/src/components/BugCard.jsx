import React from 'react';
import './BugCard.css';

const BugCard = ({ bug, onEdit, onDelete, onStatusChange }) => {
  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(bug._id, newStatus);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`bug-card ${getPriorityClass(bug.priority)}`} data-testid="bug-card">
      <div className="bug-header">
        <h4 className="bug-title" title={bug.title}>{bug.title}</h4>
        <span className={`priority-badge ${getPriorityClass(bug.priority)}`}>
          {bug.priority}
        </span>
      </div>
      
      <p className="bug-description">{bug.description}</p>
      
      <div className="bug-meta">
        <div className="meta-item">
          <strong>Reporter:</strong> {bug.reporter}
        </div>
        {bug.assignee && (
          <div className="meta-item">
            <strong>Assignee:</strong> {bug.assignee}
          </div>
        )}
        <div className="meta-item">
          <strong>Reported:</strong> {formatDate(bug.createdAt)}
        </div>
      </div>

      {bug.tags && bug.tags.length > 0 && (
        <div className="bug-tags">
          {bug.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="bug-actions">
        <select
          value={bug.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="status-select"
          data-testid="status-select"
        >
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <button
          onClick={() => onEdit(bug)}
          className="btn btn-edit"
          data-testid="edit-button"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(bug._id)}
          className="btn btn-delete"
          data-testid="delete-button"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default BugCard;