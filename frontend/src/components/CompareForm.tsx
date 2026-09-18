import type { FormEvent } from 'react';

type CompareFormProps = {
  left: string;
  right: string;
  onLeftChange: (value: string) => void;
  onRightChange: (value: string) => void;
  onSubmit: (left: string, right: string) => void;
  isLoading: boolean;
};

export function CompareForm({
  left,
  right,
  onLeftChange,
  onRightChange,
  onSubmit,
  isLoading,
}: CompareFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(left, right);
  }

  return (
    <form className="compare-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="left-repo">First library</label>
        <input
          id="left-repo"
          value={left}
          onChange={(event) => onLeftChange(event.target.value)}
          placeholder="django/django"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div className="field">
        <label htmlFor="right-repo">Second library</label>
        <input
          id="right-repo"
          value={right}
          onChange={(event) => onRightChange(event.target.value)}
          placeholder="pallets/flask"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Comparing…' : 'Compare'}
      </button>
      <p className="field-hint">
        Same format in both fields: <code>owner/repo</code>, for example{' '}
        <code>django/django</code> and <code>pallets/flask</code>. A GitHub URL
        works too.
      </p>
    </form>
  );
}
