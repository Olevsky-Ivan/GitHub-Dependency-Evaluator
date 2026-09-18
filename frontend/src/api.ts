import type { RepositoryAnalysis } from '@/types';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export async function fetchRepositoryAnalysis(
  owner: string,
  repo: string,
): Promise<RepositoryAnalysis> {
  const response = await fetch(
    `${API_BASE}/api/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/`,
  );

  if (!response.ok) {
    let detail = 'Could not load repository analysis.';
    try {
      const body = (await response.json()) as { detail?: string };
      if (typeof body.detail === 'string') {
        detail = body.detail;
      }
    } catch {
      // Keep the default message if GitHub/Django did not return JSON.
    }
    throw new Error(detail);
  }

  return response.json() as Promise<RepositoryAnalysis>;
}
