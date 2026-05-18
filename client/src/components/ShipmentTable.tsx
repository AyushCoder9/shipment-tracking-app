import { ArrowUpRight } from 'lucide-react';
import type { Shipment, ShipmentStatus } from '../types/shipment';
import { CopyButton } from './CopyButton';
import { RouteVisual } from './RouteVisual';
import { StatusBadge } from './StatusBadge';
import { StatusDropdown } from './StatusDropdown';
import { formatRelative } from '../utils/format';

interface Props {
  shipments: Shipment[];
  onSelect: (shipment: Shipment) => void;
  onAdvance: (shipment: Shipment, next: ShipmentStatus) => Promise<void> | void;
  canMutate: boolean;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

const AVATAR_PALETTE = [
  'bg-brand-100 text-brand-700',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
  'bg-indigo-100 text-indigo-700',
  'bg-violet-100 text-violet-700',
  'bg-teal-100 text-teal-700',
];

function avatarColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
}

export function ShipmentTable({ shipments, onSelect, onAdvance, canMutate }: Props) {
  return (
    <div className="card overflow-hidden">
      <div className="hidden border-b border-slate-200/70 bg-slate-50/60 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:grid sm:grid-cols-12 sm:gap-4">
        <div className="col-span-3">Tracking</div>
        <div className="col-span-3">Parties</div>
        <div className="col-span-3">Route</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      <ul className="divide-y divide-slate-100">
        {shipments.map((s) => (
          <li
            key={s.id}
            className="group cursor-pointer animate-fade-in px-4 py-4 transition hover:bg-slate-50/70 sm:px-5"
            onClick={() => onSelect(s)}
          >
            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4">
              {/* Tracking */}
              <div className="sm:col-span-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${avatarColor(s.sender)}`}
                  >
                    {initials(s.sender)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs font-semibold text-brand-700">
                        {s.trackingNumber}
                      </span>
                      <CopyButton text={s.trackingNumber} label="tracking number" />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Updated {formatRelative(s.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Parties */}
              <div className="sm:col-span-3">
                <p className="truncate text-sm font-medium text-slate-900">{s.sender}</p>
                <p className="truncate text-xs text-slate-500">→ {s.receiver}</p>
              </div>

              {/* Route */}
              <div className="sm:col-span-3">
                <RouteVisual origin={s.origin} destination={s.destination} />
              </div>

              {/* Status */}
              <div className="sm:col-span-1">
                <StatusBadge status={s.status} />
              </div>

              {/* Actions */}
              <div
                className="flex items-center justify-end gap-2 sm:col-span-2"
                onClick={(e) => e.stopPropagation()}
              >
                {canMutate ? (
                  <StatusDropdown shipment={s} onChange={(next) => onAdvance(s, next)} />
                ) : (
                  <span className="text-xs italic text-slate-400">Sign in to update</span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(s);
                  }}
                  className="hidden rounded-lg p-2 text-slate-400 transition hover:bg-brand-50 hover:text-brand-700 group-hover:inline-flex"
                  aria-label="View details"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
