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
      <label className="sr-only" htmlFor="repo-query">
        Repository
      </label>
      <input
        id="repo-query"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="django/django"
        autoComplete="off"
        spellCheck={false}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Analyzing…' : 'Analyze'}
      </button>
    </form>
  );
}
