import { ChevronDown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { allowedNext, type Shipment, type ShipmentStatus } from '../types/shipment';

interface Props {
  shipment: Shipment;
  onChange: (next: ShipmentStatus) => Promise<void> | void;
  disabled?: boolean;
  variant?: 'compact' | 'full';
}

export function StatusDropdown({
  shipment,
  onChange,
  disabled,
  variant = 'compact',
}: Props) {
  const [busy, setBusy] = useState(false);
  const options = allowedNext(shipment.status);

  if (options.length === 0) {
    return <span className="text-xs italic text-slate-400 dark:text-slate-500">No further actions</span>;
  }

  const handle = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as ShipmentStatus;
    if (!next) return;
    e.target.value = '';
    setBusy(true);
    try {
      await onChange(next);
    } finally {
      setBusy(false);
    }
  };

  const sizeClass =
    variant === 'full' ? 'px-3.5 py-2.5 text-sm' : 'px-2.5 py-1.5 text-xs';

  return (
    <div className="relative inline-block">
      <select
        onChange={handle}
        defaultValue=""
        disabled={busy || disabled}
        className={`appearance-none rounded-lg border border-slate-200 bg-white pr-8 font-medium text-slate-700 shadow-sm transition hover:border-brand-400 hover:text-brand-700 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-brand-400 dark:hover:text-brand-300 dark:focus:ring-brand-900/40 ${sizeClass}`}
      >
        <option value="" disabled>
          {busy ? 'Updating…' : 'Advance status'}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            → {opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
        {busy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-500 dark:text-brand-400" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
        )}
      </div>
    </div>
  );
}
