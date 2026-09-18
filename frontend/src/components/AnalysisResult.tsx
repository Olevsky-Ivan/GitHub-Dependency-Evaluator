import { Link } from 'react-router-dom';

import { CommunityCard } from '@/components/CommunityCard';
import { MaintenanceCard } from '@/components/MaintenanceCard';
import { RepositoryOverview } from '@/components/RepositoryOverview';
import { RiskSignalList } from '@/components/RiskSignalList';
import type { RepositoryAnalysis } from '@/types';

type AnalysisResultProps = {
  analysis: RepositoryAnalysis;
};

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  return (
    <section className="analysis">
      <RepositoryOverview analysis={analysis} />
      <div className="card-grid">
        <MaintenanceCard analysis={analysis} />
        <CommunityCard analysis={analysis} />
        <RiskSignalList analysis={analysis} wide />
      </div>
      <div className="analysis-footer">
        <Link
          className="compare-cta"
          to={`/compare?left=${encodeURIComponent(analysis.repository.full_name)}`}
        >
          Compare with another repository
        </Link>
      </div>
    </section>
  );
}
