export type RiskLevel = 'ok' | 'warning' | 'high_risk';

export type LastRelease = {
  name: string | null;
  published_at: string;
};

export type RepositoryAnalysis = {
  repository: {
    owner: string;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    stars: number;
    forks: number;
    language: string | null;
    license: string | null;
    archived: boolean;
  };
  activity: {
    last_commit_at: string | null;
    last_release: LastRelease | null;
    releases_last_12_months: number;
  };
  community: {
    contributors: number;
    open_issues: number;
  };
  risk_signals: Array<{
    level: RiskLevel;
    code: string;
    message: string;
  }>;
};
