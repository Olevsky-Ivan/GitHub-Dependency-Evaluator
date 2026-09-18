import type { RepositoryAnalysis } from '@/types';

export function buildComparisonNotes(
  left: RepositoryAnalysis,
  right: RepositoryAnalysis,
): string[] {
  const leftName = left.repository.name;
  const rightName = right.repository.name;
  const notes: string[] = [];

  if (left.community.contributors !== right.community.contributors) {
    const leader =
      left.community.contributors > right.community.contributors
        ? leftName
        : rightName;
    notes.push(`${leader} has more contributors.`);
  }

  if (
    left.activity.releases_last_12_months !==
    right.activity.releases_last_12_months
  ) {
    const leader =
      left.activity.releases_last_12_months >
      right.activity.releases_last_12_months
        ? leftName
        : rightName;
    notes.push(`${leader} has published more releases in the last 12 months.`);
  }

  if (left.community.open_issues !== right.community.open_issues) {
    const fewer =
      left.community.open_issues < right.community.open_issues
        ? leftName
        : rightName;
    notes.push(`${fewer} has fewer open issues.`);
  }

  notes.push('Review the signals above before choosing a dependency.');
  return notes;
}
