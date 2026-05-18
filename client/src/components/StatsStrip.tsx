import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  PackageCheck,
  Package,
  Truck,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { useMemo } from 'react';
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { Shipment, ShipmentStats, ShipmentStatus } from '../types/shipment';
import { SHIPMENT_STATUSES } from '../types/shipment';
import { AnimatedNumber } from './AnimatedNumber';

interface Tile {
  key: 'Total' | 'Live' | ShipmentStatus;
  label: string;
  value: number;
  hint?: string;
  Icon: LucideIcon;
  accent: string;
  bar: string;
  spark: string;
}

interface Props {
  stats: ShipmentStats | undefined;
  shipments: Shipment[];
  onSelectStatus?: (status: ShipmentStatus | 'All') => void;
}

function deriveSparkline(shipments: Shipment[], status: ShipmentStatus | 'all'): { i: number; v: number }[] {
  // Bucket events from `history` over the last 14 ticks (synthetic days).
  // For 'all' we count creations; for a status we count transitions into it.
  const buckets = Array.from({ length: 14 }, (_, i) => ({ i, v: 0 }));
  if (shipments.length === 0) return buckets;
  const events: Array<{ at: number; status: ShipmentStatus }> = [];
  for (const s of shipments) {
    for (const h of s.history) {
      events.push({ at: new Date(h.at).getTime(), status: h.status });
    }
  }
  if (events.length === 0) return buckets;
  const max = Math.max(...events.map((e) => e.at));
  const min = Math.min(...events.map((e) => e.at));
  const range = Math.max(max - min, 1);
  for (const e of events) {
    if (status !== 'all' && e.status !== status) continue;
    const idx = Math.min(13, Math.floor(((e.at - min) / range) * 13));
    buckets[idx].v += 1;
  }
  return buckets;
}

const STATUS_COLOR: Record<ShipmentStatus, string> = {
  Pending: '#f59e0b',
  'Picked Up': '#0284c7',
  'In Transit': '#2f60f6',
  Delivered: '#10b981',
  Cancelled: '#e11d48',
};

export function StatsStrip({ stats, shipments, onSelectStatus }: Props) {
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
      key: 'Total',
      label: 'Total shipments',
      value: total,
      hint: 'All time',
      Icon: Package,
      accent: 'text-slate-900 dark:text-slate-100',
      bar: 'bg-slate-400',
      spark: '#64748b',
    },
    {
      key: 'Live',
      label: 'In motion',
      value: inFlight,
      hint: 'Pending → Transit',
      Icon: Truck,
      accent: 'text-brand-700 dark:text-brand-300',
      bar: 'bg-brand-500',
      spark: '#2f60f6',
    },
    {
      key: 'Pending',
      label: 'Pending',
      value: s.Pending,
      Icon: Clock,
      accent: 'text-amber-700 dark:text-amber-300',
      bar: 'bg-amber-500',
      spark: STATUS_COLOR.Pending,
    },
    {
      key: 'Picked Up',
      label: 'Picked up',
      value: s['Picked Up'],
      Icon: PackageCheck,
      accent: 'text-sky-700 dark:text-sky-300',
      bar: 'bg-sky-500',
      spark: STATUS_COLOR['Picked Up'],
    },
    {
      key: 'Delivered',
      label: 'Delivered',
      value: s.Delivered,
      Icon: CheckCircle2,
      accent: 'text-emerald-700 dark:text-emerald-300',
      bar: 'bg-emerald-500',
      spark: STATUS_COLOR.Delivered,
    },
    {
      key: 'Cancelled',
      label: 'Cancelled',
      value: s.Cancelled,
      Icon: XCircle,
      accent: 'text-rose-700 dark:text-rose-300',
      bar: 'bg-rose-500',
      spark: STATUS_COLOR.Cancelled,
    },
  ];

  const sparklines = useMemo(() => {
    const map = new Map<Tile['key'], { i: number; v: number }[]>();
    for (const t of tiles) {
      if (t.key === 'Total' || t.key === 'Live') {
        map.set(t.key, deriveSparkline(shipments, 'all'));
      } else {
        map.set(t.key, deriveSparkline(shipments, t.key));
      }
    }
    return map;
  }, [shipments, tiles]);

  const donutData = useMemo(
    () =>
      SHIPMENT_STATUSES.map((status) => ({
        name: status,
        value: s[status],
        color: STATUS_COLOR[status],
      })),
    [s],
  );

  const handleClick = (key: Tile['key']) => {
    if (!onSelectStatus) return;
    if (key === 'Total' || key === 'Live') onSelectStatus('All');
    else onSelectStatus(key);
    // Scroll the table into view for a smoother hand-off.
    document.getElementById('shipments-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-2">
        {tiles.map((t, idx) => (
          <motion.button
            type="button"
            key={t.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.04 * idx, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleClick(t.key)}
            className="card group relative overflow-hidden p-4 text-left transition hover:shadow-glow"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t.label}
                </p>
                <AnimatedNumber
                  value={t.value}
                  className={`mt-1 block text-2xl font-semibold tabular-nums ${t.accent}`}
                />
                {t.hint && (
                  <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">{t.hint}</p>
                )}
              </div>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 ${t.accent}`}
              >
                <t.Icon className="h-4 w-4" strokeWidth={2.2} />
              </div>
            </div>
            <div className="mt-3 h-9 -mx-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklines.get(t.key)} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}>
                  <defs>
                    <linearGradient id={`spark-${t.key}`} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={t.spark} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={t.spark} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={t.spark}
                    strokeWidth={1.6}
                    fill={`url(#spark-${t.key})`}
                    isAnimationActive
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="card p-4"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Status mix
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Click a slice to filter</p>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Live</span>
        </div>
        <div className="relative mt-2 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  background: 'rgba(15,23,42,0.92)',
                  border: 'none',
                  borderRadius: 8,
                  color: 'white',
                  fontSize: 12,
                  padding: '6px 10px',
                }}
                itemStyle={{ color: 'white' }}
              />
              <Pie
                data={donutData}
                dataKey="value"
                innerRadius="62%"
                outerRadius="92%"
                paddingAngle={3}
                stroke="none"
                isAnimationActive
                animationDuration={900}
                onClick={(_, idx) => {
                  const item = donutData[idx];
                  if (item) onSelectStatus?.(item.name as ShipmentStatus);
                  document.getElementById('shipments-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                cursor="pointer"
              >
                {donutData.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Total
            </span>
            <AnimatedNumber
              value={total}
              className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50"
            />
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px]">
          {donutData.map((d) => (
            <button
              type="button"
              key={d.name}
              onClick={() => onSelectStatus?.(d.name as ShipmentStatus)}
              className="group flex items-center justify-between rounded-md px-1.5 py-1 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                {d.name}
              </span>
              <span className="font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                {d.value}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
