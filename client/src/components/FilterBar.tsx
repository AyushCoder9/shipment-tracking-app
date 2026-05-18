import { Plus, Search, X } from 'lucide-react';
import clsx from 'clsx';
import { SHIPMENT_STATUSES, type ShipmentStatus } from '../types/shipment';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  status: ShipmentStatus | 'All';
  onStatusChange: (value: ShipmentStatus | 'All') => void;
  onCreate: () => void;
  canCreate: boolean;
}

const CHIPS: Array<{ value: ShipmentStatus | 'All'; label: string }> = [
  { value: 'All', label: 'All' },
  ...SHIPMENT_STATUSES.map((s) => ({ value: s, label: s })),
];

export function FilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onCreate,
  canCreate,
}: Props) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tracking #, sender, receiver, route…"
            className="input pl-9 pr-9"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onCreate}
          disabled={!canCreate}
          title={canCreate ? 'Create a new shipment' : 'Sign in to create shipments'}
          className={clsx(canCreate ? 'btn-primary' : 'btn-secondary')}
        >
          <Plus className="h-4 w-4" />
          New shipment
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="label mr-1 hidden sm:inline">Status:</span>
        {CHIPS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onStatusChange(c.value)}
            className={clsx('chip', status === c.value && 'chip-active')}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
