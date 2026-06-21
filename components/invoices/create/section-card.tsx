export function SectionCard({
  step,
  title,
  action,
  children,
}: {
  step: number;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border-border overflow-hidden rounded-xl border">
      <div className="border-border/70 flex items-center gap-2.5 border-b px-[22px] py-4">
        <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg text-[13px] font-extrabold">
          {step}
        </span>
        <h2 className="text-foreground text-base font-extrabold">{title}</h2>
        {action ? <div className="ml-auto">{action}</div> : null}
      </div>
      <div className="p-[22px]">{children}</div>
    </div>
  );
}
