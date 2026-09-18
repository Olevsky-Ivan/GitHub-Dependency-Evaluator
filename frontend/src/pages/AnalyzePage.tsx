import { AnalysisResult } from '@/components/AnalysisResult';
import { SearchForm } from '@/components/SearchForm';
import { StatusMessage } from '@/components/StatusMessage';
import { useAnalyzeRepository } from '@/hooks/useAnalyzeRepository';

export function AnalyzePage() {
  const { query, setQuery, analysis, error, isLoading, analyze } =
    useAnalyzeRepository();

  return (
    <>
      <section className="hero">
        <p className="hero-kicker">Open-source due diligence</p>
        <h1>Analyze a dependency before you adopt it.</h1>
        <p className="hero-copy">
          Paste a GitHub repository below. We show maintenance, community and
          risk signals — not a score that pretends to decide for you.
        </p>
        <SearchForm
          value={query}
          onChange={setQuery}
          onSubmit={analyze}
          isLoading={isLoading}
        />
      </section>
      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
      {isLoading && !analysis ? (
        <StatusMessage>Reading GitHub…</StatusMessage>
      ) : null}
      {analysis ? <AnalysisResult analysis={analysis} /> : null}
    </>
  );
}
