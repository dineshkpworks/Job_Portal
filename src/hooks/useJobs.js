import { useJobContext } from '../context/JobContext';

export function useJobs() {
  const {
    jobs,
    loading,
    error,
    filters,
    updateFilters,
    loadJobs,
    savedIds,
    appliedIds,
    setSavedIds,
    setAppliedIds,
  } = useJobContext();
  return {
    jobs,
    loading,
    error,
    filters,
    updateFilters,
    loadJobs,
    savedIds,
    appliedIds,
    setSavedIds,
    setAppliedIds,
  };
}
