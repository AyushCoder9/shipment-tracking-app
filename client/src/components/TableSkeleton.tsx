export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
      </div>
      <ul className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className="flex items-center gap-4 px-4 py-4">
            <div className="h-9 w-9 flex-shrink-0 animate-pulse rounded-lg bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-2/5 animate-pulse rounded bg-slate-200" />
              <div className="h-2.5 w-3/5 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
            <div className="h-7 w-28 animate-pulse rounded-lg bg-slate-100" />
          </li>
        ))}
      </ul>
    </div>
  );
}
