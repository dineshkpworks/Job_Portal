import { useMemo } from 'react';
import { useJobContext } from '../context/JobContext';
import JobList from '../components/jobs/JobList';

export default function AppliedJobs() {
  const { allJobs, appliedIds } = useJobContext();

  const appliedJobs = useMemo(
    () => allJobs.filter((j) => appliedIds.has(j.id)),
    [allJobs, appliedIds]
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-xl font-semibold text-[#111827] dark:text-white mb-1">
        Applied jobs
      </h1>
      <p className="text-sm text-[#6b7280] dark:text-gray-400 mb-4">
        Jobs you've applied to.
      </p>
      <JobList
        jobs={appliedJobs}
        loading={false}
        savedIds={new Set()}
        appliedIds={appliedIds}
        isAuthenticated
        emptyMessage="You haven't applied to any jobs yet. Browse jobs and click Apply to get started."
      />
    </div>
  );
}
