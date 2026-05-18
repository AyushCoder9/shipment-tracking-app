export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="h-3 w-24 rounded shimmer" />
      </div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className="flex items-center gap-4 px-4 py-4">
            <div className="h-9 w-9 flex-shrink-0 rounded-lg shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-2/5 rounded shimmer" />
              <div className="h-2.5 w-3/5 rounded shimmer" style={{ animationDelay: '120ms' }} />
            </div>
            <div className="h-6 w-20 rounded-full shimmer" />
            <div className="h-7 w-28 rounded-lg shimmer" />
          </li>
        ))}
      </ul>
    </div>
  );
}
