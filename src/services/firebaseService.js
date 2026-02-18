import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { COLLECTIONS } from '../utils/constants';

const JOBS_COLLECTION = COLLECTIONS.JOBS;

/** In-code sample India jobs for seeding Firestore when empty. */
const SAMPLE_INDIA_JOBS = [
  { id: 'india-1', title: 'Senior Frontend Engineer', company: 'TechCorp India', location: 'Bangalore, India', type: 'Full-time', experience: 'Senior', description: 'Build scalable web apps with React and TypeScript. Design systems and accessibility experience a plus.', createdAt: new Date('2025-02-10') },
  { id: 'india-2', title: 'Product Designer', company: 'Design Studio', location: 'Mumbai, India', type: 'Full-time', experience: 'Mid', description: 'Own the design process from research to high-fidelity prototypes. Figma expertise required.', createdAt: new Date('2025-02-12') },
  { id: 'india-3', title: 'Backend Developer', company: 'CloudScale', location: 'Remote India', type: 'Full-time', experience: 'Mid', description: 'APIs and services with Node.js and PostgreSQL. AWS or GCP preferred.', createdAt: new Date('2025-02-08') },
  { id: 'india-4', title: 'DevOps Engineer', company: 'InfraLabs', location: 'Hyderabad, India', type: 'Contract', experience: 'Senior', description: 'CI/CD, Kubernetes, Terraform, Docker. Linux experience required.', createdAt: new Date('2025-02-11') },
  { id: 'india-5', title: 'Junior React Developer', company: 'StartupXYZ', location: 'Pune, India', type: 'Full-time', experience: 'Entry', description: '1–2 years React experience. Customer-facing features with mentorship.', createdAt: new Date('2025-02-13') },
];

/**
 * Fetch jobs from Firestore collection "jobs".
 * Returns raw document snapshots for normalization in jobService.
 * @returns {Promise<Array>} Array of Firestore document snapshots
 */
export async function getJobsFromFirestore() {
  const snap = await getDocs(collection(db, JOBS_COLLECTION));
  return snap.docs;
}

/**
 * Seed Firestore "jobs" collection with sample India jobs (for empty DB).
 */
export async function seedIndiaJobsToFirestore() {
  const col = collection(db, JOBS_COLLECTION);
  for (const job of SAMPLE_INDIA_JOBS) {
    await setDoc(doc(col, job.id), {
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      experience: job.experience,
      description: job.description,
      createdAt: job.createdAt,
    });
  }
  return SAMPLE_INDIA_JOBS.length;
}
