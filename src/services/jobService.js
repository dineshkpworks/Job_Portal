import { getRemotiveJobs, clearRemotiveCache } from './remotive.service';
import { getJobsFromFirestore } from './firebaseService';
import { normalizeJobFromFirestore } from '../utils/helpers';

let cachedJobs = null;

const FALLBACK_JOBS = [
  { id: 'fb-1', title: 'Senior Frontend Engineer', company: 'TechCorp', location: 'Remote', jobType: 'Full-time', category: 'Software', tags: ['React', 'TypeScript'], applyUrl: '', description: 'Build scalable web applications with React and TypeScript.', publishedAt: new Date(), source: 'remotive' },
  { id: 'fb-2', title: 'Backend Developer', company: 'CloudScale', location: 'Remote', jobType: 'Full-time', category: 'Software', tags: ['Node.js', 'PostgreSQL'], applyUrl: '', description: 'APIs and services. AWS or GCP preferred.', publishedAt: new Date(), source: 'remotive' },
  { id: 'fb-3', title: 'Product Designer', company: 'Design Studio', location: 'Remote', jobType: 'Full-time', category: 'Design', tags: ['Figma', 'UX'], applyUrl: '', description: 'Own design from research to high-fidelity prototypes.', publishedAt: new Date(), source: 'remotive' },
];

function toUIJob(job) {
  if (!job) return null;
  return {
    ...job,
    type: job.jobType ?? job.type ?? 'Full-time',
    createdAt: job.publishedAt ?? job.createdAt ?? new Date(),
    experience: job.experience ?? 'Mid',
    location: job.location || 'Remote',
  };
}

function toUIJobs(list) {
  return (list || []).map(toUIJob);
}

export async function getJobs({ signal } = {}) {
  if (cachedJobs) return cachedJobs;

  const { jobs: remotiveJobs, error } = await getRemotiveJobs({ useCache: true, signal });

  if (!error && remotiveJobs?.length > 0) {
    cachedJobs = toUIJobs(remotiveJobs);
    return cachedJobs;
  }

  try {
    const firebaseData = await getJobsFromFirestore();
    const normalized = firebaseData.map(normalizeJobFromFirestore);
    if (normalized.length > 0) {
      cachedJobs = toUIJobs(normalized.map((j) => ({ ...j, jobType: j.type, publishedAt: j.createdAt, source: 'firebase' })));
      return cachedJobs;
    }
  } catch {
    // ignore
  }

  cachedJobs = toUIJobs(FALLBACK_JOBS);
  return cachedJobs;
}

export function clearJobsCache() {
  cachedJobs = null;
  clearRemotiveCache();
}

export function filterJobs(jobs, { search, location, type, experience, category }) {
  return jobs.filter((job) => {
    const typeVal = job.jobType ?? job.type;
    const loc = job.location || 'Remote';
    const searchLower = search ? search.toLowerCase() : '';
    const matchSearch =
      !search ||
      [job.title, job.company, job.description, ...(job.tags || [])].some((v) =>
        String(v).toLowerCase().includes(searchLower)
      );
    const matchLocation = !location || loc.toLowerCase().includes(location.toLowerCase());
    const matchType = !type || typeVal === type;
    const matchExperience = !experience || (job.experience ?? 'Mid') === experience;
    const matchCategory = !category || (job.category && String(job.category).toLowerCase().includes(category.toLowerCase()));
    return matchSearch && matchLocation && matchType && matchExperience && matchCategory;
  });
}
