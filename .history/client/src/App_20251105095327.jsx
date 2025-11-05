import React, { useState } from 'react';
import BugForm from './components/BugForm';
import BugList from './components/BugList';
import ErrorBoundary from './components/ErrorBoundary';
import { useBugs } from './hooks/useBugs';
import './App.css';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [editingBug, setEditingBug] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    bugs,
    loading,
    error,
    filters,
    setFilters,
    createBug,
    updateBug,
    deleteBug,
    updateBugStatus,
    searchBugs
  } = useBugs();

  const handleCreateBug = async (bugData) => {
    try {
      await createBug(bugData);
      setShowForm(false);
      alert('Bug reported successfully!');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleUpdateBug = async (bugData) => {
    try {
      await updateBug(editingBug._id, bugData);
      setEditingBug(null);
      alert('Bug updated successfully!');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleEditBug = (bug) => {
    setEditingBug(bug);
    setShowForm(true);
  };

  const handleDeleteBug = async (bugId) => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      try {
        await deleteBug(bugId);
        alert('Bug deleted successfully!');
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchBugs(searchQuery);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    searchBugs('');
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <header className="app-header">
          <h1>🐛 MERN Bug Tracker</h1>
          <p>Track and manage software bugs effectively</p>
        </header>

        <main className="app-main">
          {error && (
            <div className="error-banner" data-testid="error-banner">
              {error}
              <button onClick={() => {}}>×</button>
            </div>
          )}

          <div className="controls">
            <button 
              onClick={() => setShowForm(!showForm)}
              className="btn btn-primary"
              data-testid="toggle-form-button"
            >
              {showForm ? 'Cancel' : 'Report New Bug'}
            </button>

            <div className="search-filters">
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search bugs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="search-input"
                />
                <button type="submit">Search</button>
              </form>

              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                data-testid="status-filter"
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={filters.priority || ''}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                data-testid="priority-filter"
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>

              <button onClick={clearFilters} className="btn btn-secondary">
                Clear Filters
              </button>
            </div>
          </div>

          {(showForm || editingBug) && (
            <div className="form-section" data-testid="bug-form-section">
              <h2>{editingBug ? 'Edit Bug' : 'Report New Bug'}</h2>
              <BugForm
                onSubmit={editingBug ? handleUpdateBug : handleCreateBug}
                initialData={editingBug || {}}
                isEditing={!!editingBug}
              />
            </div>
          )}

          <div className="bugs-section">
            <h2>Bug Reports ({bugs.length})</h2>
            <BugList
              bugs={bugs}
              onEdit={handleEditBug}
              onDelete={handleDeleteBug}
              onStatusChange={updateBugStatus}
              loading={loading}
            />
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;