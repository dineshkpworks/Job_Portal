import { stripHtml } from './helpers';

const JOB_TYPE_MAP = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  freelance: 'Freelance',
  internship: 'Internship',
};

function toJobType(raw) {
  const key = (raw || 'full_time').toLowerCase().replace(/-/g, '_');
  return JOB_TYPE_MAP[key] || 'Full-time';
}

function toDate(value) {
  if (!value) return new Date();
  const d = typeof value === 'number' ? new Date(value * 1000) : new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

export function normalizeRemotiveJob(item) {
  const location = item.candidate_required_location || item.location || 'Remote';
  const publishedAt = toDate(item.publication_date || item.published_at);

  return {
    id: String(item.id),
    title: item.title || '',
    company: item.company_name || item.company || '',
    location: location || 'Remote',
    jobType: toJobType(item.job_type),
    category: item.category || '',
    tags: Array.isArray(item.tags) ? item.tags : [],
    applyUrl: item.url || '',
    description: stripHtml(item.description || ''),
    publishedAt,
    source: 'remotive',
  };
}

export function normalizeRemotiveJobs(jobs) {
  if (!Array.isArray(jobs)) return [];
  return jobs.map(normalizeRemotiveJob);
}
