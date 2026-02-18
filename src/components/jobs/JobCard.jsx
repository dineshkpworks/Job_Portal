import { memo } from 'react';
import { Link } from 'react-router-dom';
import { formatDate, truncate } from '../../utils/helpers';
import Badge from '../common/Badge';
import Button from '../common/Button';

function JobCard({
  job,
  isSaved = false,
  isApplied = false,
  onSave,
  onUnsave,
  onApplyClick,
  isAuthenticated,
}) {
  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    if (isSaved) onUnsave?.(job.id);
    else onSave?.(job.id);
  };

  const handleApplyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    onApplyClick?.(job);
  };

  const tags = Array.isArray(job.tags) ? job.tags.slice(0, 5) : [];

  return (
    <article className="group relative rounded-lg border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-gray-800 p-5 transition-all duration-200 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md">
      <div className="flex justify-between gap-5 relative z-10">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Link
              to={`/jobs/${job.id}`}
              className="font-semibold text-[#111827] dark:text-white hover:text-[#2563eb] truncate block text-base transition-colors duration-200"
            >
              {job.title}
            </Link>
            {isApplied && (
              <Badge variant="applied">Applied</Badge>
            )}
          </div>
          <p className="text-sm text-[#6b7280] dark:text-gray-400 mb-2">
            {job.company} · {job.location}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge>{job.type}</Badge>
            <Badge>{job.experience}</Badge>
            {tags.map((t) => (
              <Badge key={t} variant="tag">{t}</Badge>
            ))}
          </div>
          <p className="text-sm text-[#6b7280] dark:text-gray-500 line-clamp-2 leading-relaxed">
            {truncate(job.description || '', 140)}
          </p>
          <p className="text-xs text-[#6b7280] dark:text-gray-500 mt-2">
            {formatDate(job.createdAt)} · {job.salary ?? 'Not disclosed'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0 relative z-10">
          <button
            type="button"
            onClick={handleSaveClick}
            className="p-2 rounded-lg text-[#6b7280] hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            title={isSaved ? 'Remove from saved' : 'Save job'}
            aria-label={isSaved ? 'Unsave job' : 'Save job'}
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
          {!isApplied && (
            <Button
              variant="primary"
              onClick={handleApplyClick}
              className="transition-all duration-200 hover:bg-[#1d4ed8] hover:shadow-md"
            >
              Apply
            </Button>
          )}
        </div>
      </div>
      <Link to={`/jobs/${job.id}`} className="absolute inset-0 z-0" aria-hidden tabIndex={-1} />
    </article>
  );
}

export default memo(JobCard);
