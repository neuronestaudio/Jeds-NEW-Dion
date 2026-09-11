import { PROCESS_STEPS } from '@/data/process';

/** Static, no-JS version of the homepage process rail, for the suburb pages. */
export function ProcessSteps() {
  return (
    <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {PROCESS_STEPS.map((step, i) => (
        <li key={step.step} className="relative rounded-2xl border border-border/30 bg-card/50 p-5">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
              {i + 1}
            </span>
            <step.icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-sm font-semibold mb-1">{step.title}</h3>
          <p className="text-xs text-muted-foreground">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}

export default ProcessSteps;
