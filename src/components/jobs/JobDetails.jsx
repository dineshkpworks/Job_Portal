import { formatDate } from '../../utils/helpers';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function JobDetails({
  job,
  isSaved,
  isApplied,
  onSave,
  onUnsave,
  onApplyClick,
  isAuthenticated,
}) {
  if (!job) return null;

  const handleSave = () => {
    if (!isAuthenticated) return;
    if (isSaved) onUnsave?.(job.id);
    else onSave?.(job.id);
  };

  const tags = Array.isArray(job.tags) ? job.tags : [];

  return (
    <div className="rounded border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-[#e5e7eb] dark:border-gray-700">
        <h1 className="text-lg font-semibold text-[#111827] dark:text-white mb-1">
          {job.title}
        </h1>
        <p className="text-sm text-[#6b7280] dark:text-gray-400 mb-2">
          {job.company} · {job.location}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          <Badge>{job.type}</Badge>
          <Badge>{job.experience}</Badge>
          {isApplied && <Badge variant="applied">Applied</Badge>}
        </div>
        <p className="text-xs text-[#6b7280] dark:text-gray-500">
          Posted {formatDate(job.createdAt)} · {job.salary ?? 'Not disclosed'}
        </p>
      </div>
      <div className="p-5 sm:p-6 space-y-5">
        <section>
          <h2 className="text-sm font-semibold text-[#111827] dark:text-white mb-2">Job Description</h2>
          <p className="text-sm text-[#6b7280] dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
            {job.description || 'No description provided.'}
          </p>
        </section>
        {tags.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-[#111827] dark:text-white mb-2">Requirements</h2>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <Badge key={t} variant="tag">{t}</Badge>
              ))}
            </div>
          </section>
        )}
        <section>
          <h2 className="text-sm font-semibold text-[#111827] dark:text-white mb-2">About Company</h2>
          <p className="text-sm text-[#6b7280] dark:text-gray-400">
            {job.company}
            {job.location ? ` · ${job.location}` : ''}
          </p>
        </section>
      </div>
      <div className="p-5 sm:p-6 border-t border-[#e5e7eb] dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={handleSave}
          className="p-2 rounded border border-[#e5e7eb] dark:border-gray-600 text-[#6b7280] dark:text-gray-400 hover:text-red-600 hover:border-gray-300 dark:hover:border-gray-500"
          title={isSaved ? 'Remove from saved' : 'Save job'}
        >
          <svg
            className={`w-4 h-4 ${isSaved ? 'fill-red-600 text-red-600' : ''}`}
            fill={isSaved ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        {!isApplied && isAuthenticated && (
          <Button variant="primary" onClick={() => onApplyClick?.(job)}>Apply</Button>
        )}
      </div>
    </div>
  );
}
