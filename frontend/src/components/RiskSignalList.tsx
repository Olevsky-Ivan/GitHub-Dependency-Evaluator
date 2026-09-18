import type { RepositoryAnalysis } from '@/types';

type RiskSignalListProps = {
  analysis: RepositoryAnalysis;
  title?: string;
  wide?: boolean;
};

const MARKS = {
  ok: '✓',
  warning: '⚠',
  high_risk: '✕',
} as const;

export function RiskSignalList({
  analysis,
  title = 'Risk signals',
  wide = false,
}: RiskSignalListProps) {
  return (
    <article className={`panel${wide ? ' panel-wide' : ''}`}>
      <h3>{title}</h3>
      <ul className="signal-list">
        {analysis.risk_signals.map((signal) => (
          <li key={signal.code} className={`signal-row signal-${signal.level}`}>
            <span className="signal-mark" aria-hidden="true">
              {MARKS[signal.level]}
            </span>
            {signal.message}
          </li>
        ))}
      </ul>
    </article>
  );
}
