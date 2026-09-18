import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { fetchRepositoryAnalysis } from '@/api';
import { parseRepoInput } from '@/lib/format';
import type { RepositoryAnalysis } from '@/types';

type Comparison = {
  left: RepositoryAnalysis;
  right: RepositoryAnalysis;
};

export function useCompareRepositories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const leftFromUrl = searchParams.get('left') ?? '';
  const rightFromUrl = searchParams.get('right') ?? '';
  const [leftQuery, setLeftQuery] = useState(leftFromUrl);
  const [rightQuery, setRightQuery] = useState(rightFromUrl);
  const [comparison, setComparison] = useState<Comparison | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const compare = useCallback(
    async (leftValue: string, rightValue: string) => {
      const left = parseRepoInput(leftValue);
      const right = parseRepoInput(rightValue);

      if (!left || !right) {
        setComparison(null);
        setError('Enter two repositories as owner/repo.');
        return;
      }

      const leftSlug = `${left.owner}/${left.repo}`;
      const rightSlug = `${right.owner}/${right.repo}`;
      setLeftQuery(leftSlug);
      setRightQuery(rightSlug);
      setSearchParams({ left: leftSlug, right: rightSlug });
      setIsLoading(true);
      setError('');

      try {
        const [leftResult, rightResult] = await Promise.all([
          fetchRepositoryAnalysis(left.owner, left.repo),
          fetchRepositoryAnalysis(right.owner, right.repo),
        ]);
        setComparison({ left: leftResult, right: rightResult });
      } catch (unknownError) {
        setComparison(null);
        setError(
          unknownError instanceof Error
            ? unknownError.message
            : 'Could not compare repositories.',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (leftFromUrl && rightFromUrl) {
      void compare(leftFromUrl, rightFromUrl);
    }
    // Load once from the shared URL on first paint.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    leftQuery,
    rightQuery,
    setLeftQuery,
    setRightQuery,
    comparison,
    error,
    isLoading,
    compare,
  };
}
