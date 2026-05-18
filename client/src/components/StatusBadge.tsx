import clsx from 'clsx';
import {
  CheckCircle2,
  Clock,
  PackageCheck,
  Truck,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import type { ShipmentStatus } from '../types/shipment';

interface BadgeStyle {
  className: string;
  Icon: LucideIcon;
}

const STYLES: Record<ShipmentStatus, BadgeStyle> = {
  Pending: {
    className:
      'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-500/30',
    Icon: Clock,
  },
  'Picked Up': {
    className:
      'bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-500/15 dark:text-sky-200 dark:ring-sky-500/30',
    Icon: PackageCheck,
  },
  'In Transit': {
    className:
      'bg-brand-50 text-brand-700 ring-brand-200 dark:bg-brand-500/15 dark:text-brand-200 dark:ring-brand-500/30',
    Icon: Truck,
  },
  Delivered: {
    className:
      'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-500/30',
    Icon: CheckCircle2,
  },
  Cancelled: {
    className:
      'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-200 dark:ring-rose-500/30',
    Icon: XCircle,
  },
};

export function StatusBadge({
  status,
  size = 'sm',
}: {
  status: ShipmentStatus;
  size?: 'sm' | 'md';
}) {
  const { className, Icon } = STYLES[status];
  const sizing =
    size === 'md'
      ? 'px-3 py-1 text-sm gap-1.5'
      : 'px-2.5 py-0.5 text-xs gap-1';
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium ring-1 ring-inset',
        sizing,
        className,
      )}
    >
      <Icon className={size === 'md' ? 'h-4 w-4' : 'h-3 w-3'} strokeWidth={2.4} />
      {status}
    </span>
  );
}
