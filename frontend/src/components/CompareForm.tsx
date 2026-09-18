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
      <label className="sr-only" htmlFor="left-repo">
        First repository
      </label>
      <input
        id="left-repo"
        value={left}
        onChange={(event) => onLeftChange(event.target.value)}
        placeholder="django/django"
        autoComplete="off"
        spellCheck={false}
      />
      <label className="sr-only" htmlFor="right-repo">
        Second repository
      </label>
      <input
        id="right-repo"
        value={right}
        onChange={(event) => onRightChange(event.target.value)}
        placeholder="pallets/flask"
        autoComplete="off"
        spellCheck={false}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Comparing…' : 'Compare'}
      </button>
    </form>
  );
}
