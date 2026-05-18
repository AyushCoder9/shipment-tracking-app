import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  MapPin,
  PackageCheck,
  Truck,
  X,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import type { Shipment, ShipmentStatus } from '../types/shipment';
import { CopyButton } from './CopyButton';
import { StatusBadge } from './StatusBadge';
import { StatusDropdown } from './StatusDropdown';
import { formatDateTime } from '../utils/format';

interface Props {
  shipment: Shipment | null;
  onClose: () => void;
  onAdvance: (shipment: Shipment, next: ShipmentStatus) => Promise<void> | void;
  canMutate: boolean;
}

const TIMELINE_ICON: Record<ShipmentStatus, LucideIcon> = {
  Pending: Clock,
  'Picked Up': PackageCheck,
  'In Transit': Truck,
  Delivered: CheckCircle2,
  Cancelled: XCircle,
};

const TIMELINE_COLOR: Record<ShipmentStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:ring-amber-500/30',
  'Picked Up': 'bg-sky-100 text-sky-700 ring-sky-200 dark:bg-sky-500/20 dark:text-sky-300 dark:ring-sky-500/30',
  'In Transit': 'bg-brand-100 text-brand-700 ring-brand-200 dark:bg-brand-500/20 dark:text-brand-300 dark:ring-brand-500/30',
  Delivered: 'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:ring-emerald-500/30',
  Cancelled: 'bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:ring-rose-500/30',
};

export function ShipmentDetailDrawer({ shipment, onClose, onAdvance, canMutate }: Props) {
  return (
    <AnimatePresence>
      {shipment && (
        <div className="fixed inset-0 z-30 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: 32, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 32, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            <DrawerContent
              shipment={shipment}
              onClose={onClose}
              onAdvance={onAdvance}
              canMutate={canMutate}
            />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

function DrawerContent({ shipment, onClose, onAdvance, canMutate }: Props & { shipment: Shipment }) {
  const reversed = [...shipment.history].reverse();
  return (
    <>
      <div className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/85">
        <div className="flex items-start justify-between p-5">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {shipment.trackingNumber}
              </span>
              <CopyButton text={shipment.trackingNumber} label="tracking number" />
            </div>
            <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
              {shipment.sender}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">to {shipment.receiver}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-5 pb-4">
          <StatusBadge status={shipment.status} size="md" />
        </div>
      </div>

      <div className="space-y-6 p-5">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900">
          <p className="label mb-3">Route</p>
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center pt-1">
              <span className="inline-flex h-3 w-3 rounded-full border-2 border-slate-400 bg-white dark:border-slate-500 dark:bg-slate-900" />
              <span className="my-1 h-8 w-0.5 border-l-2 border-dashed border-slate-300 dark:border-slate-700" />
              <MapPin className="h-4 w-4 text-brand-600 dark:text-brand-400" strokeWidth={2.4} />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  From
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {shipment.origin}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  To
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {shipment.destination}
                </p>
              </div>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3">
          {shipment.weightKg !== undefined && (
            <MetaCell label="Weight" value={`${shipment.weightKg} kg`} />
          )}
          <MetaCell label="Created" value={formatDateTime(shipment.createdAt)} />
          <MetaCell label="Last update" value={formatDateTime(shipment.updatedAt)} />
          {shipment.notes && <MetaCell label="Notes" value={shipment.notes} full />}
        </dl>

        {canMutate && (
          <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4 dark:border-brand-500/30 dark:bg-brand-500/10">
            <p className="label mb-2 text-brand-700 dark:text-brand-200">Advance status</p>
            <p className="mb-3 text-xs text-slate-600 dark:text-slate-400">
              Move this shipment to the next stage in its lifecycle.
            </p>
            <StatusDropdown
              shipment={shipment}
              onChange={(next) => onAdvance(shipment, next)}
              variant="full"
            />
          </div>
        )}

        <div>
          <p className="label mb-3">Timeline</p>
          <ol className="relative space-y-4 border-l-2 border-slate-100 pl-1 dark:border-slate-800">
            {reversed.map((entry, idx) => {
              const Icon = TIMELINE_ICON[entry.status];
              const color = TIMELINE_COLOR[entry.status];
              return (
                <motion.li
                  key={`${entry.at}-${idx}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.06 }}
                  className="relative pl-6"
                >
                  <span
                    className={`absolute -left-[13px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-white dark:ring-slate-900 ${color}`}
                  >
                    <Icon className="h-3 w-3" strokeWidth={2.4} />
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {entry.status}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDateTime(entry.at)}
                    </p>
                    {entry.note && (
                      <p className="rounded-md bg-slate-50 px-2.5 py-1.5 text-xs italic text-slate-600 ring-1 ring-slate-100 dark:bg-slate-800/60 dark:text-slate-300 dark:ring-slate-800">
                        {entry.note}
                      </p>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </>
  );
}

function MetaCell({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60 ${full ? 'col-span-2' : ''}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-slate-800 dark:text-slate-200">{value}</p>
    </div>
  );
}
