import { formatRelativeDate } from '@/lib/format';
import type { RepositoryAnalysis } from '@/types';

type MaintenanceCardProps = {
  analysis: RepositoryAnalysis;
};

export function MaintenanceCard({ analysis }: MaintenanceCardProps) {
  const { activity, risk_signals: riskSignals } = analysis;
  const isActive = riskSignals.some(
    (signal) => signal.code === 'actively_maintained' && signal.level === 'ok',
  );

  return (
    <article className="panel">
      <h3>Maintenance</h3>
      <p className={`status-pill ${isActive ? 'signal-ok' : 'signal-warning'}`}>
        {isActive ? 'Active' : 'Needs attention'}
      </p>
      <dl>
        <div>
          <dt>Last commit</dt>
          <dd>{formatRelativeDate(activity.last_commit_at)}</dd>
        </div>
        <div>
          <dt>Last release</dt>
          <dd>
            {activity.last_release
              ? formatRelativeDate(activity.last_release.published_at)
              : 'No releases'}
          </dd>
        </div>
        <div>
          <dt>Releases / 12 months</dt>
          <dd>{activity.releases_last_12_months}</dd>
        </div>
      </dl>
    </article>
  );
}
