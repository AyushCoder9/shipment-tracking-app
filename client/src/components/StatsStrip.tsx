import {
  CheckCircle2,
  Clock,
  PackageCheck,
  Package,
  Truck,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import type { ShipmentStats, ShipmentStatus } from '../types/shipment';

interface Tile {
  label: string;
  value: number;
  hint?: string;
  Icon: LucideIcon;
  ring: string;
  iconBg: string;
  iconColor: string;
  valueColor: string;
}

export function StatsStrip({ stats }: { stats: ShipmentStats | undefined }) {
  const empty: ShipmentStats = {
    Pending: 0,
    'Picked Up': 0,
    'In Transit': 0,
    Delivered: 0,
    Cancelled: 0,
  };
  const s = stats ?? empty;
  const total = Object.values(s).reduce((a, b) => a + b, 0);
  const active: ShipmentStatus[] = ['Pending', 'Picked Up', 'In Transit'];
  const inFlight = active.reduce((sum, key) => sum + s[key], 0);

  const tiles: Tile[] = [
    {
      label: 'Total shipments',
      value: total,
      hint: 'All time',
      Icon: Package,
      ring: 'ring-slate-200',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-700',
      valueColor: 'text-slate-900',
    },
    {
      label: 'In motion',
      value: inFlight,
      hint: 'Pending → In Transit',
      Icon: Truck,
      ring: 'ring-brand-200',
      iconBg: 'bg-brand-100',
      iconColor: 'text-brand-700',
      valueColor: 'text-brand-700',
    },
    {
      label: 'Pending',
      value: s.Pending,
      Icon: Clock,
      ring: 'ring-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-700',
      valueColor: 'text-amber-700',
    },
    {
      label: 'Picked up',
      value: s['Picked Up'],
      Icon: PackageCheck,
      ring: 'ring-sky-200',
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-700',
      valueColor: 'text-sky-700',
    },
    {
      label: 'Delivered',
      value: s.Delivered,
      Icon: CheckCircle2,
      ring: 'ring-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-700',
      valueColor: 'text-emerald-700',
    },
    {
      label: 'Cancelled',
      value: s.Cancelled,
      Icon: XCircle,
      ring: 'ring-rose-200',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-700',
      valueColor: 'text-rose-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {tiles.map((t) => (
        <div
          key={t.label}
          className={`card relative overflow-hidden p-4 transition hover:-translate-y-0.5 hover:shadow-glow ${t.ring}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {t.label}
              </p>
              <p className={`mt-1 text-2xl font-semibold tabular-nums ${t.valueColor}`}>
                {t.value}
              </p>
              {t.hint && <p className="mt-0.5 text-[11px] text-slate-400">{t.hint}</p>}
            </div>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${t.iconBg} ${t.iconColor}`}
            >
              <t.Icon className="h-4 w-4" strokeWidth={2.2} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
