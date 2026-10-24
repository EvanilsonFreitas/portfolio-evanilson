export default function SectionHead({
  number,
  label,
  title,
  children,
}: {
  number: string;
  label: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-12 grid gap-4 md:grid-cols-12 md:items-end">
      <div className="md:col-span-8">
        <p className="eyebrow mb-4">
          <span className="text-accent-ink">{number}</span> — {label}
        </p>
        <h2 className="display text-[clamp(2.25rem,5vw,3.75rem)]">{title}</h2>
      </div>
      {children && <div className="text-muted md:col-span-4 md:justify-self-end md:text-right">{children}</div>}
    </header>
  );
}
