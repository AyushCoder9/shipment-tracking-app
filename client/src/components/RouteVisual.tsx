import { MapPin } from 'lucide-react';

export function RouteVisual({ origin, destination }: { origin: string; destination: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-700">
      <div className="flex items-center gap-1.5">
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-400" />
        <span className="truncate" title={origin}>
          {origin}
        </span>
      </div>
      <svg
        width="28"
        height="10"
        viewBox="0 0 28 10"
        fill="none"
        className="flex-shrink-0 text-brand-500"
        aria-hidden="true"
      >
        <path
          d="M0 5 Q 14 -2 26 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="2 2"
          fill="none"
        />
        <path d="M22 2 L26 5 L22 8" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
      <div className="flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5 text-brand-600" strokeWidth={2.4} />
        <span className="truncate font-medium text-slate-900" title={destination}>
          {destination}
        </span>
      </div>
    </div>
  );
}
