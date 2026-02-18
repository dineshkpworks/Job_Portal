export function formatDate(dateInput) {
  if (dateInput == null) return '';
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Strip HTML to plain text without parsing (avoids loading tracking pixels/images). */
export function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<img\b[^>]*>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalize Firestore document snapshot to common Job model.
 * @param {FirebaseFirestore.DocumentSnapshot} docSnap - Firestore document snapshot
 * @returns {Object} { id, title, company, location, type, experience, description, createdAt }
 */
export function normalizeJobFromFirestore(docSnap) {
  const data = docSnap.data();
  const id = docSnap.id || data?.id || '';
  let createdAt = new Date();
  if (data?.createdAt?.toDate) {
    createdAt = data.createdAt.toDate();
  } else if (data?.createdAt) {
    createdAt = data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt);
  } else if (data?.postedAt?.toDate) {
    createdAt = data.postedAt.toDate();
  } else if (data?.postedAt) {
    createdAt = new Date(data.postedAt);
  }

  return {
    id: String(id),
    title: data?.title ?? '',
    company: data?.company ?? '',
    location: data?.location ?? 'Remote',
    type: data?.type ?? 'Full-time',
    experience: data?.experience ?? 'Mid',
    description: stripHtml(String(data?.description ?? '')),
    createdAt,
  };
}

export function truncate(str, length = 120) {
  if (!str || str.length <= length) return str;
  return str.slice(0, length).trim() + '…';
}
