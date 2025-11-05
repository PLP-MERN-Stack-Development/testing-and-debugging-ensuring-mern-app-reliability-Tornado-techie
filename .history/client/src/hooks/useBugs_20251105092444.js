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
      const updatedBug = await bugAPI.updateBug(id