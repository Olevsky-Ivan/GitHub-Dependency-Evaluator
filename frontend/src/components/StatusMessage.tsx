type StatusMessageProps = {
  tone?: 'muted' | 'error';
  children: string;
};

export function StatusMessage({ tone = 'muted', children }: StatusMessageProps) {
  return <p className={`status-message status-message-${tone}`}>{children}</p>;
}
