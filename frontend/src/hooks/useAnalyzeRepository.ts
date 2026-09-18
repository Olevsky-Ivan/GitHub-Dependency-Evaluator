import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { fetchRepositoryAnalysis } from '@/api';
import { parseRepoInput } from '@/lib/format';
import type { RepositoryAnalysis } from '@/types';

export function useAnalyzeRepository() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(queryFromUrl);
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const analyze = useCallback(
    async (value: string) => {
      const parsed = parseRepoInput(value);
      if (!parsed) {
        setAnalysis(null);
        setError(
          'That is not a GitHub repository. Use owner/repo, for example django/django, or paste a GitHub URL.',
        );
        return;
      }

      const slug = `${parsed.owner}/${parsed.repo}`;
      setQuery(slug);
      setSearchParams({ q: slug });
      setIsLoading(true);
      setError('');

      try {
        const result = await fetchRepositoryAnalysis(parsed.owner, parsed.repo);
        setAnalysis(result);
      } catch (unknownError) {
        setAnalysis(null);
        setError(
          unknownError instanceof Error
            ? unknownError.message
            : 'Could not load repository analysis.',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (queryFromUrl) {
      void analyze(queryFromUrl);
    }
    // Load once from the shared URL on first paint.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { query, setQuery, analysis, error, isLoading, analyze };
}
