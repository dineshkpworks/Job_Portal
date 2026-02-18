import {
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { COLLECTIONS } from '../utils/constants';

const SAVED_JOBS = COLLECTIONS.SAVED_JOBS;

export async function saveJob(userId, jobId) {
  const ref = await addDoc(collection(db, SAVED_JOBS), {
    userId,
    jobId,
    savedAt: new Date(),
  });
  return ref.id;
}

export async function removeSavedJob(userId, jobId) {
  const q = query(
    collection(db, SAVED_JOBS),
    where('userId', '==', userId),
    where('jobId', '==', jobId)
  );
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

export async function getSavedJobIds(userId) {
  const q = query(
    collection(db, SAVED_JOBS),
    where('userId', '==', userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().jobId);
}

export async function isJobSaved(userId, jobId) {
  const q = query(
    collection(db, SAVED_JOBS),
    where('userId', '==', userId),
    where('jobId', '==', jobId)
  );
  const snap = await getDocs(q);
  return !snap.empty;
}
