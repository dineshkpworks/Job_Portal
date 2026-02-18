import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { getJobs, filterJobs } from '../services/jobService';
import { getSavedJobIds } from '../services/savedJobService';
import { getApplicationIds } from '../services/applicationService';

const JobContext = createContext(null);

export function JobProvider({ children, userId }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    experience: '',
    category: '',
  });

  const loadJobs = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const list = await getJobs({ signal });
      if (!signal?.aborted) setJobs(list);
    } catch (e) {
      if (e?.name === 'AbortError') return;
      if (!signal?.aborted) {
        setError(e.message || 'Failed to load jobs');
        setJobs([]);
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  const loadUserData = useCallback(async (uid) => {
    if (!uid) {
      setSavedIds(new Set());
      setAppliedIds(new Set());
      return;
    }
    try {
      const [saved, applied] = await Promise.all([
        getSavedJobIds(uid),
        getApplicationIds(uid),
      ]);
      setSavedIds(new Set(saved));
      setAppliedIds(new Set(applied));
    } catch {
      setSavedIds(new Set());
      setAppliedIds(new Set());
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    loadJobs(ac.signal);
    return () => ac.abort();
  }, [loadJobs]);

  useEffect(() => {
    loadUserData(userId ?? null);
  }, [userId, loadUserData]);

  const updateFilters = useCallback((next) => {
    setFilters((prev) => ({ ...prev, ...next }));
  }, []);

  const filteredJobs = filterJobs(jobs, filters);

  const value = {
    jobs: filteredJobs,
    allJobs: jobs,
    loading,
    error,
    filters,
    updateFilters,
    loadJobs,
    loadUserData,
    savedIds,
    appliedIds,
    setSavedIds,
    setAppliedIds,
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobContext() {
  const ctx = useContext(JobContext);
  if (!ctx) throw new Error('useJobContext must be used within JobProvider');
  return ctx;
}
