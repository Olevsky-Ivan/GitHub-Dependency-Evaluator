import { formatCompactNumber } from '@/lib/format';
import type { RepositoryAnalysis } from '@/types';

type CommunityCardProps = {
  analysis: RepositoryAnalysis;
};

export function CommunityCard({ analysis }: CommunityCardProps) {
  const { repository, community } = analysis;

  return (
    <article className="panel">
      <h3>Community</h3>
      <dl>
        <div>
          <dt>Contributors</dt>
          <dd>{formatCompactNumber(community.contributors)}</dd>
        </div>
        <div>
          <dt>Stars</dt>
          <dd>{formatCompactNumber(repository.stars)}</dd>
        </div>
        <div>
          <dt>Open issues</dt>
          <dd>{formatCompactNumber(community.open_issues)}</dd>
        </div>
        <div>
          <dt>License</dt>
          <dd>{repository.license || 'Unknown'}</dd>
        </div>
      </dl>
    </article>
  );
}
