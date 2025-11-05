import React from 'react';
import BugCard from './BugCard';
import './BugList.css';

const BugList = ({ bugs, onEdit, onDelete, onStatusChange, loading = false }) => {
  if (loading) {
    return <div className="loading">Loading bugs...</div>;
  }

  if (!bugs || bugs.length === 0) {
    return (
      <div className="no-bugs" data-testid="no-bugs-message">
        <h3>No bugs reported yet</h3>
        <p>Be the first to report a bug!</p>
      </div>
    );
  }

  const bugsByStatus = {
    'open': bugs.filter(bug => bug.status === 'open'),
    'in-progress': bugs.filter(bug => bug.status === 'in-progress'),
    'resolved': bugs.filter(bug => bug.status === 'resolved'),
    'closed': bugs.filter(bug => bug.status === 'closed')
  };

  return (
    <div className="bug-list" data-testid="bug-list">
      {Object.entries(bugsByStatus).map(([status, statusBugs]) => (
        statusBugs.length > 0 && (
          <div key={status} className="status-column">
            <h3 className={`status-header status-${status}`}>
              {status.replace('-', ' ').toUpperCase()} ({statusBugs.length})
            </h3>
            <div className="bugs-column">
              {statusBugs.map(bug => (
                <BugCard
                  key={bug._id}
                  bug={bug}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default BugList;