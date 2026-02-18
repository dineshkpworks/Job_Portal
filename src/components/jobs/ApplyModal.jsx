import { useState, useRef } from 'react';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { uploadResume, applyForJob } from '../../services/applicationService';
import { useAuth } from '../../hooks/useAuth';
import { useJobContext } from '../../context/JobContext';

export default function ApplyModal({ job, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const { setAppliedIds } = useJobContext();

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    setError('');
    if (f && f.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      setFile(null);
      return;
    }
    setFile(f || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !job || !file) {
      setError('Please select a PDF resume.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const resumeUrl = await uploadResume(user.uid, file);
      await applyForJob(user.uid, job.id, resumeUrl);
      setAppliedIds((prev) => new Set(prev).add(job.id));
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Application failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded border border-[#e5e7eb] dark:border-gray-700 max-w-md w-full p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[#111827] dark:text-white mb-0.5">Apply for {job.title}</h2>
        <p className="text-sm text-[#6b7280] dark:text-gray-400 mb-4">{job.company}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6b7280] dark:text-gray-300 mb-1">
              Resume (PDF only, max 5MB)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="w-full text-sm text-[#6b7280] dark:text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border file:border-[#e5e7eb] file:bg-white file:text-[#111827] dark:file:bg-gray-700 dark:file:border-gray-600 dark:file:text-gray-300"
            />
            {file && <p className="mt-1 text-xs text-gray-500">{file.name}</p>}
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!file || submitting}>
              {submitting ? <Loader size="sm" /> : 'Submit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
