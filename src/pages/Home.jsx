import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { saveJob, removeSavedJob } from '../services/savedJobService';
import { seedIndiaJobsToFirestore } from '../services/firebaseService';
import { clearJobsCache } from '../services/jobService';
import SearchBar from '../components/jobs/SearchBar';
import FilterPanel from '../components/jobs/FilterPanel';
import JobList from '../components/jobs/JobList';
import ApplyModal from '../components/jobs/ApplyModal';
import interviewHero from '@/assets/images/interview-hero.jpg';

const SEARCH_DEBOUNCE_MS = 300;

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
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
  } = useJobs();
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [applyJob, setApplyJob] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);
  useEffect(() => {
    updateFilters({ search: debouncedSearch });
  }, [debouncedSearch, updateFilters]);

  const handleSearch = useCallback((value) => setSearchInput(value), []);

  const handleFilterChange = useCallback(
    (next) => updateFilters(next),
    [updateFilters]
  );

  const handleSave = useCallback(
    async (jobId) => {
      if (!user?.uid) {
        navigate('/login');
        return;
      }
      try {
        await saveJob(user.uid, jobId);
        setSavedIds((prev) => new Set(prev).add(jobId));
      } catch { }
    },
    [user?.uid, navigate, setSavedIds]
  );

  const handleUnsave = useCallback(
    async (jobId) => {
      if (!user?.uid) return;
      try {
        await removeSavedJob(user.uid, jobId);
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
      } catch { }
    },
    [user?.uid, setSavedIds]
  );

  const handleApplyClick = useCallback(
    (job) => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      if (appliedIds.has(job.id)) return;
      setApplyJob(job);
    },
    [isAuthenticated, navigate, appliedIds]
  );

  const handleSeedIndiaJobs = useCallback(async () => {
    setSeeding(true);
    try {
      await seedIndiaJobsToFirestore();
      clearJobsCache();
      await loadJobs();
    } finally {
      setSeeding(false);
    }
  }, [loadJobs]);

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-[#e5e7eb] dark:border-gray-700 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111827] dark:text-white mb-2 sm:mb-4">
              Find your next opportunity
            </h1>
            <p className="text-sm sm:text-base text-[#6b7280] dark:text-gray-400 mb-6 sm:mb-8">
              Search remote jobs by keyword, location, and category.
            </p>
            <div className="max-w-lg">
              <SearchBar value={searchInput} onChange={handleSearch} placeholder="Search jobs, companies..." />
            </div>
          </div>
          {/* Image Card: Hidden on mobile & tablet; show on RIGHT side for lg and above */}
          <div className="hidden lg:flex justify-end items-center">
            <div className="bg-white rounded-2xl shadow-lg p-2 border border-gray-100">
              <img
                src={interviewHero}
                alt="Professional interview conversation"
                className="w-full max-w-[420px] h-auto rounded-xl object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main: collapsible filters on tablet/mobile; sidebar + scrollable list on desktop. */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-8 pt-8 pb-12">
        {/* Filters: toggle button on md/sm, always visible sidebar on lg */}
        <div className="lg:contents">
          <div className="flex items-center justify-between gap-3 lg:hidden flex-wrap">
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              className="inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-[#111827] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-expanded={filtersOpen}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {filtersOpen ? 'Hide filters' : 'Filters'}
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#6b7280] dark:text-gray-400">Listings</span>
              <button
                type="button"
                onClick={handleSeedIndiaJobs}
                disabled={seeding}
                className="text-sm text-[#2563eb] hover:underline disabled:opacity-50 transition-opacity duration-200"
              >
                {seeding ? 'Seeding…' : 'Load sample jobs'}
              </button>
            </div>
          </div>
          {filtersOpen && (
            <div className="mt-3 lg:hidden">
              <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
            </div>
          )}
        </div>

        <aside className="hidden lg:block flex-shrink-0 w-64 lg:sticky lg:top-8 self-start">
          <div className="flex flex-col">
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
            <div className="mt-3 flex items-center justify-between flex-shrink-0">
              <span className="text-sm text-[#6b7280] dark:text-gray-400">Listings</span>
              <button
                type="button"
                onClick={handleSeedIndiaJobs}
                disabled={seeding}
                className="text-sm text-[#2563eb] hover:underline disabled:opacity-50 transition-opacity duration-200"
              >
                {seeding ? 'Seeding…' : 'Load sample jobs'}
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0 pb-6">
          <JobList
            jobs={jobs}
            loading={loading}
            error={error}
            savedIds={savedIds}
            appliedIds={appliedIds}
            isAuthenticated={isAuthenticated}
            onSave={handleSave}
            onUnsave={handleUnsave}
            onApplyClick={handleApplyClick}
          />
        </div>
      </div>

      {applyJob && (
        <ApplyModal
          job={applyJob}
          onClose={() => setApplyJob(null)}
          onSuccess={() => setApplyJob(null)}
        />
      )}
    </div>
  );
}
