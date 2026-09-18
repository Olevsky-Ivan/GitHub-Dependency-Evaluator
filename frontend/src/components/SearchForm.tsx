import type { FormEvent } from 'react';

type SearchFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  isLoading: boolean;
};

export function SearchForm({
  value,
  onChange,
  onSubmit,
  isLoading,
}: SearchFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(value);
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="repo-query">GitHub repository</label>
        <input
          id="repo-query"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="django/django"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Analyzing…' : 'Analyze'}
      </button>
      <p className="field-hint">
        Write it as <code>owner/repo</code> — that is the GitHub owner, a slash,
        then the repository name. Example: <code>django/django</code>. You can
        also paste the full GitHub URL.
      </p>
    </form>
  );
}
