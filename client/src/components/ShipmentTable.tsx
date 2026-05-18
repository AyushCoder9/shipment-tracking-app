import { AnimatePresence, motion } from 'framer-motion';
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
  'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
  'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300',
];

function avatarColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
}

export function ShipmentTable({ shipments, onSelect, onAdvance, canMutate }: Props) {
  return (
    <div className="card overflow-hidden">
      <div className="hidden border-b border-slate-200/70 bg-slate-50/60 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 sm:grid sm:grid-cols-12 sm:gap-4">
        <div className="col-span-3">Tracking</div>
        <div className="col-span-3">Parties</div>
        <div className="col-span-3">Route</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        <AnimatePresence initial={false}>
          {shipments.map((s, idx) => (
            <motion.li
              layout
              key={s.id}
              initial={{ opacity: 0, y: 14, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -16, scale: 0.98, transition: { duration: 0.18 } }}
              transition={{
                duration: 0.32,
                delay: Math.min(idx * 0.03, 0.4),
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ backgroundColor: 'rgba(148, 163, 184, 0.06)' }}
              className="group cursor-pointer px-4 py-4 sm:px-5"
              onClick={() => onSelect(s)}
            >
              <div className="flex flex-col gap-3 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4">
                <div className="sm:col-span-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${avatarColor(s.sender)}`}
                    >
                      {initials(s.sender)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs font-semibold text-brand-700 dark:text-brand-300">
                          {s.trackingNumber}
                        </span>
                        <CopyButton text={s.trackingNumber} label="tracking number" />
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        Updated {formatRelative(s.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {s.sender}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    → {s.receiver}
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <RouteVisual origin={s.origin} destination={s.destination} />
                </div>

                <div className="sm:col-span-1">
                  <StatusBadge status={s.status} />
                </div>

                <div
                  className="flex items-center justify-end gap-2 sm:col-span-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {canMutate ? (
                    <StatusDropdown shipment={s} onChange={(next) => onAdvance(s, next)} />
                  ) : (
                    <span className="text-xs italic text-slate-400 dark:text-slate-500">
                      Sign in to update
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(s);
                    }}
                    className="hidden rounded-lg p-2 text-slate-400 transition hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-500/10 dark:hover:text-brand-300 group-hover:inline-flex"
                    aria-label="View details"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
