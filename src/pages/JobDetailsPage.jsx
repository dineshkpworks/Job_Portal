import { useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useJobContext } from '../context/JobContext';
import { saveJob, removeSavedJob } from '../services/savedJobService';
import JobDetails from '../components/jobs/JobDetails';
import ApplyModal from '../components/jobs/ApplyModal';
import Loader from '../components/common/Loader';

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { allJobs, savedIds, appliedIds, setSavedIds, setAppliedIds } = useJobContext();
  const [applyJob, setApplyJob] = useState(null);

  const job = allJobs.find((j) => j.id === id);

  const handleSave = useCallback(
    async (jobId) => {
      if (!user?.uid) {
        navigate('/login');
        return;
      }
      try {
        await saveJob(user.uid, jobId);
        setSavedIds((prev) => new Set(prev).add(jobId));
      } catch {}
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
      } catch {}
    },
    [user?.uid, setSavedIds]
  );

  const handleApplyClick = useCallback(
    (j) => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      if (appliedIds.has(j.id)) return;
      setApplyJob(j);
    },
    [isAuthenticated, navigate, appliedIds]
  );

  if (job === undefined) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader size="lg" />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading job...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-lg font-semibold text-[#111827] dark:text-white mb-2">
          Job not found
        </h1>
        <Link to="/" className="text-sm text-[#2563eb] hover:underline">
          Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Link
        to="/"
        className="inline-flex items-center text-sm text-[#6b7280] dark:text-gray-400 hover:text-[#2563eb] mb-4"
      >
        ← Back to jobs
      </Link>
      <JobDetails
        job={job}
        isSaved={savedIds.has(job.id)}
        isApplied={appliedIds.has(job.id)}
        onSave={handleSave}
        onUnsave={handleUnsave}
        onApplyClick={handleApplyClick}
        isAuthenticated={isAuthenticated}
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
