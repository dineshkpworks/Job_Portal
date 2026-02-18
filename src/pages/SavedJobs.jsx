import { useMemo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useJobContext } from '../context/JobContext';
import { removeSavedJob } from '../services/savedJobService';
import JobList from '../components/jobs/JobList';
import ApplyModal from '../components/jobs/ApplyModal';

export default function SavedJobs() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    allJobs,
    savedIds,
    appliedIds,
    setSavedIds,
    setAppliedIds,
  } = useJobContext();
  const [applyJob, setApplyJob] = useState(null);

  const savedJobs = useMemo(
    () => allJobs.filter((j) => savedIds.has(j.id)),
    [allJobs, savedIds]
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
      } catch {}
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-xl font-semibold text-[#111827] dark:text-white mb-1">
        Saved jobs
      </h1>
      <p className="text-sm text-[#6b7280] dark:text-gray-400 mb-4">
        Jobs you've saved for later.
      </p>
      <JobList
        jobs={savedJobs}
        loading={false}
        savedIds={savedIds}
        appliedIds={appliedIds}
        isAuthenticated={isAuthenticated}
        onUnsave={handleUnsave}
        onApplyClick={handleApplyClick}
        emptyMessage="You haven't saved any jobs yet. Browse jobs and click the heart to save."
      />
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
