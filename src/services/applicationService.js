import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { COLLECTIONS } from '../utils/constants';
import { CLOUDINARY, RESUME } from '../constants/cloudinary';

const APPLICATIONS = COLLECTIONS.APPLICATIONS;

function validateResumeFile(file) {
  if (!file) throw new Error('Please select a file.');
  if (file.type !== RESUME.allowedMimeType) {
    throw new Error('Only PDF files are allowed.');
  }
  if (file.size > RESUME.maxSizeBytes) {
    throw new Error(`File size must be under ${RESUME.maxSizeMB}MB.`);
  }
}

export async function uploadResume(userId, file) {
  validateResumeFile(file);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY.uploadPreset);
  formData.append('folder', CLOUDINARY.folder);

  const res = await fetch(CLOUDINARY.uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Upload failed (${res.status}).`);
  }

  const data = await res.json();
  const secureUrl = data?.secure_url;
  if (!secureUrl) throw new Error('Upload succeeded but no URL returned.');
  return secureUrl;
}

export async function applyForJob(userId, jobId, resumeUrl) {
  const docRef = await addDoc(collection(db, APPLICATIONS), {
    userId,
    jobId,
    resumeUrl,
  });
  return docRef.id;
}

export async function getApplicationIds(userId) {
  const q = query(
    collection(db, APPLICATIONS),
    where('userId', '==', userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().jobId);
}

export async function hasApplied(userId, jobId) {
  const q = query(
    collection(db, APPLICATIONS),
    where('userId', '==', userId),
    where('jobId', '==', jobId)
  );
  const snap = await getDocs(q);
  return !snap.empty;
}
