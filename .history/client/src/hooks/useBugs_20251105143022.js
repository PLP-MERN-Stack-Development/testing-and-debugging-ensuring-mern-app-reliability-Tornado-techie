import { useState, useEffect, useCallback } from 'react';
import { bugAPI } from '../services/bugService';

export const useBugs = (initialFilters = {}) => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchBugs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching bugs with filters:', filters);
      const data = await bugAPI.getBugs(filters);
      setBugs(data.bugs || data);
    } catch (err) {
      console.error('Error fetching bugs:', err);
      setError(err.response?.data?.error || 'Failed to fetch bugs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBugs();
  }, [fetchBugs]);

  const createBug = async (bugData) => {
    try {
      setError(null);
      const newBug = await bugAPI.createBug(bugData);
      setBugs(prev => [newBug, ...prev]);
      return newBug;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create bug';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const updateBug = async (id, bugData) => {
    try {
      setError(null);
      const updatedBug = await bugAPI.updateBug(id, bugData);
      setBugs(prev => prev.map(bug => bug._id === id ? updatedBug : bug));
      return updatedBug;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update bug';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const deleteBug = async (id) => {
    try {
      setError(null);
      await bugAPI.deleteBug(id);
      setBugs(prev => prev.filter(bug => bug._id !== id));
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete bug';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const updateBugStatus = async (id, status) => {
    try {
      setError(null);
      const updatedBug = await bugAPI.updateBug(id, { status });
      setBugs(prev => prev.map(bug => bug._id === id ? updatedBug : bug));
      return updatedBug;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update bug status';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const searchBugs = async (query) => {
    if (!query.trim()) {
      await fetchBugs();
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const results = await bugAPI.searchBugs(query);
      setBugs(results);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to search bugs';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    bugs,
    loading,
    error,
    filters,
    setFilters,
    createBug,
    updateBug,
    deleteBug,
    updateBugStatus,
    searchBugs,
    refetch: fetchBugs
  };
};