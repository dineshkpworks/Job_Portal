import { REMOTIVE_API_URL } from '../utils/constants';
import { normalizeRemotiveJobs } from '../utils/normalizeRemotiveJobs';

let cache = null;
let abortController = null;

function buildUrl() {
  return REMOTIVE_API_URL;
}

export async function fetchRemotiveJobs(signal) {
  const url = buildUrl();
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: signal || undefined,
  });
  if (!res.ok) throw new Error(`Remotive API error: ${res.status}`);
  const json = await res.json();
  const raw = json?.jobs;
  if (!Array.isArray(raw)) throw new Error('Remotive API returned invalid data');
  return normalizeRemotiveJobs(raw);
}

export async function getRemotiveJobs({ useCache = true, signal } = {}) {
  if (useCache && cache) return { jobs: cache, error: null };

  if (!signal && abortController) abortController.abort();
  if (!signal) abortController = new AbortController();
  const effectiveSignal = signal || abortController?.signal;

  try {
    const jobs = await fetchRemotiveJobs(effectiveSignal);
    cache = jobs;
    return { jobs, error: null };
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    return { jobs: [], error: err.message || 'Failed to load jobs' };
  }
}

export function clearRemotiveCache() {
  cache = null;
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
}
