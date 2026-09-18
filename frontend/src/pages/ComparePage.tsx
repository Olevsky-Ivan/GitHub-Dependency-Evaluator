import { CompareForm } from '@/components/CompareForm';
import { ComparisonNotes } from '@/components/ComparisonNotes';
import { ComparisonTable } from '@/components/ComparisonTable';
import { StatusMessage } from '@/components/StatusMessage';
import { useCompareRepositories } from '@/hooks/useCompareRepositories';

export function ComparePage() {
  const {
    leftQuery,
    rightQuery,
    setLeftQuery,
    setRightQuery,
    comparison,
    error,
    isLoading,
    compare,
  } = useCompareRepositories();

  return (
    <>
      <section className="hero">
        <p className="hero-kicker">Side by side</p>
        <h1>Compare dependencies</h1>
        <p className="hero-copy">
          Enter two GitHub repositories. You get the same facts next to each
          other. The app does not pick a winner.
        </p>
        <CompareForm
          left={leftQuery}
          right={rightQuery}
          onLeftChange={setLeftQuery}
          onRightChange={setRightQuery}
          onSubmit={compare}
          isLoading={isLoading}
        />
      </section>
      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
      {isLoading && !comparison ? (
        <StatusMessage>Reading GitHub…</StatusMessage>
      ) : null}
      {comparison ? (
        <>
          <ComparisonTable left={comparison.left} right={comparison.right} />
          <ComparisonNotes left={comparison.left} right={comparison.right} />
        </>
      ) : null}
    </>
  );
}
