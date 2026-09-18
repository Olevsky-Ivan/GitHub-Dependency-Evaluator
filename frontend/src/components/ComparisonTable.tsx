import { formatCompactNumber, formatRelativeDate } from '@/lib/format';
import type { RepositoryAnalysis } from '@/types';

type ComparisonTableProps = {
  left: RepositoryAnalysis;
  right: RepositoryAnalysis;
};

export function ComparisonTable({ left, right }: ComparisonTableProps) {
  const rows = [
    ['Stars', formatCompactNumber(left.repository.stars), formatCompactNumber(right.repository.stars)],
    ['Forks', formatCompactNumber(left.repository.forks), formatCompactNumber(right.repository.forks)],
    [
      'Contributors',
      formatCompactNumber(left.community.contributors),
      formatCompactNumber(right.community.contributors),
    ],
    [
      'Open issues',
      formatCompactNumber(left.community.open_issues),
      formatCompactNumber(right.community.open_issues),
    ],
    [
      'Last commit',
      formatRelativeDate(left.activity.last_commit_at),
      formatRelativeDate(right.activity.last_commit_at),
    ],
    [
      'Last release',
      left.activity.last_release
        ? formatRelativeDate(left.activity.last_release.published_at)
        : 'No releases',
      right.activity.last_release
        ? formatRelativeDate(right.activity.last_release.published_at)
        : 'No releases',
    ],
    [
      'Releases / year',
      String(left.activity.releases_last_12_months),
      String(right.activity.releases_last_12_months),
    ],
    [
      'Archived',
      left.repository.archived ? 'Yes' : 'No',
      right.repository.archived ? 'Yes' : 'No',
    ],
    [
      'License',
      left.repository.license || 'Unknown',
      right.repository.license || 'Unknown',
    ],
  ];

  return (
    <div className="table-wrap">
      <table className="compare-table">
        <thead>
          <tr>
            <th scope="col">Metric</th>
            <th scope="col">{left.repository.name}</th>
            <th scope="col">{right.repository.name}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, leftValue, rightValue]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{leftValue}</td>
              <td>{rightValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
