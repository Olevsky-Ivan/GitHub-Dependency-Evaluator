export function parseRepoInput(value: string): { owner: string; repo: string } | null {
  const cleaned = value
    .trim()
    .replace(/^https?:\/\/github\.com\//i, '')
    .replace(/\.git$/i, '')
    .replace(/\/+$/, '');
  const parts = cleaned.split('/').filter(Boolean);

  if (parts.length < 2) {
    return null;
  }

  return { owner: parts[0], repo: parts[1] };
}

export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return String(value);
}

export function formatRelativeDate(isoDate: string | null): string {
  if (!isoDate) {
    return 'unknown';
  }

  const value = new Date(isoDate);
  if (Number.isNaN(value.getTime())) {
    return 'unknown';
  }

  const days = Math.floor((Date.now() - value.getTime()) / 86_400_000);
  if (days <= 0) {
    return 'today';
  }
  if (days === 1) {
    return '1 day ago';
  }
  if (days < 30) {
    return `${days} days ago`;
  }

  const months = Math.floor(days / 30);
  if (months === 1) {
    return '1 month ago';
  }
  if (months < 12) {
    return `${months} months ago`;
  }

  const years = Math.floor(days / 365);
  if (years <= 1) {
    return '1 year ago';
  }
  return `${years} years ago`;
}
