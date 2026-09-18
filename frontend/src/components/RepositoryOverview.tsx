import { formatCompactNumber } from '@/lib/format';
import type { RepositoryAnalysis } from '@/types';

type RepositoryOverviewProps = {
  analysis: RepositoryAnalysis;
};

export function RepositoryOverview({ analysis }: RepositoryOverviewProps) {
  const { repository, community } = analysis;

  return (
    <section className="overview">
      <p className="overview-kicker">{repository.language || 'Repository'}</p>
      <h2>{repository.name}</h2>
      <a href={repository.html_url} target="_blank" rel="noreferrer">
        {repository.full_name}
      </a>
      {repository.description ? (
        <p className="overview-description">{repository.description}</p>
      ) : null}
      <dl className="overview-stats">
        <div>
          <dt>Stars</dt>
          <dd>{formatCompactNumber(repository.stars)}</dd>
        </div>
        <div>
          <dt>Forks</dt>
          <dd>{formatCompactNumber(repository.forks)}</dd>
        </div>
        <div>
          <dt>Open issues</dt>
          <dd>{formatCompactNumber(community.open_issues)}</dd>
        </div>
      </dl>
    </section>
  );
}
