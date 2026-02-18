import JobCard from './JobCard';
import Loader from '../common/Loader';

function JobListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="rounded border border-[#e5e7eb] dark:border-gray-700 p-4"
        >
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-2" />
          <div className="flex gap-2 mb-2">
            <div className="h-5 w-14 bg-gray-200 dark:bg-gray-600 rounded mb-2" />
            <div className="h-5 w-14 bg-gray-200 dark:bg-gray-600 rounded" />
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full mb-1" />
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}

export default function JobList({
  jobs,
  loading,
  error,
  savedIds,
  appliedIds,
  isAuthenticated,
  onSave,
  onUnsave,
  onApplyClick,
  emptyMessage = 'No jobs match your criteria.',
}) {
  if (loading) return <JobListSkeleton />;
  if (error) {
    return (
      <div className="rounded border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 text-center">
        <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">Using fallback data if available.</p>
      </div>
    );
  }
  if (!jobs?.length) {
    return (
      <div className="rounded border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }
  return (
    <ul className="space-y-4 list-none p-0 m-0">
      {jobs.map((job) => (
        <li key={job.id}>
          <JobCard
            job={job}
            isSaved={savedIds?.has(job.id)}
            isApplied={appliedIds?.has(job.id)}
            onSave={onSave}
            onUnsave={onUnsave}
            onApplyClick={onApplyClick}
            isAuthenticated={isAuthenticated}
          />
        </li>
      ))}
    </ul>
  );
}
