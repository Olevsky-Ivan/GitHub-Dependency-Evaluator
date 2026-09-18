import { RiskSignalList } from '@/components/RiskSignalList';
import { buildComparisonNotes } from '@/lib/compare';
import type { RepositoryAnalysis } from '@/types';

type ComparisonNotesProps = {
  left: RepositoryAnalysis;
  right: RepositoryAnalysis;
};

export function ComparisonNotes({ left, right }: ComparisonNotesProps) {
  const notes = buildComparisonNotes(left, right);

  return (
    <section className="comparison-notes">
      <div className="card-grid">
        <RiskSignalList analysis={left} title={left.repository.name} />
        <RiskSignalList analysis={right} title={right.repository.name} />
      </div>
      <article className="panel panel-wide">
        <h3>Comparison</h3>
        <ul className="note-list">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
