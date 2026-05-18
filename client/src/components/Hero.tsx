import { Sparkles } from 'lucide-react';

export function Hero({
  liveCount,
  isAuthed,
}: {
  liveCount: number;
  isAuthed: boolean;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-brand-gradient p-6 text-white shadow-soft sm:p-8">
      <div className="absolute inset-0 bg-mesh opacity-60" aria-hidden="true" />
      <div className="absolute -bottom-16 -right-12 h-56 w-56 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
      <div className="absolute -top-10 right-20 h-32 w-32 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/25 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Live operations</span>
          </div>
          <h2 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">
            Track every shipment, end to end.
          </h2>
          <p className="mt-2 max-w-lg text-sm text-white/80 sm:text-base">
            One screen for your dispatchers — search by tracking number, advance status, and audit the full timeline of each handover.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-white/15 px-4 py-3 ring-1 ring-white/25 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">In motion</p>
            <p className="mt-0.5 text-2xl font-semibold tabular-nums">{liveCount}</p>
          </div>
          <div className="hidden rounded-2xl bg-white/15 px-4 py-3 ring-1 ring-white/25 backdrop-blur sm:block">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">Access</p>
            <p className="mt-0.5 text-sm font-medium">
              {isAuthed ? 'Authenticated ✓' : 'Read-only'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
