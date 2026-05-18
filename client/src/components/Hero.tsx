import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';
import { Sparkles, Truck } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { AnimatedNumber } from './AnimatedNumber';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Working late';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Working late';
}

export function Hero({
  liveCount,
  isAuthed,
}: {
  liveCount: number;
  isAuthed: boolean;
}) {
  // Continuous loop for the truck traveling along the SVG path.
  const t = useMotionValue(0);
  const pathRef = useRef<SVGPathElement | null>(null);
  const startedRef = useRef(false);
  useAnimationFrame((now) => {
    // 8s loop
    t.set(((now % 8000) / 8000));
  });

  const transform = useTransform(t, (progress) => {
    const path = pathRef.current;
    if (!path) return 'translate(0px, 0px)';
    if (!startedRef.current) startedRef.current = true;
    const len = path.getTotalLength();
    const pt = path.getPointAtLength(len * progress);
    return `translate(${pt.x}px, ${pt.y}px)`;
  });

  const dashLen = useMemo(() => 760, []);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-brand-gradient p-6 text-white shadow-soft dark:border-slate-700/50 sm:p-8">
      <div className="absolute inset-0 bg-mesh opacity-60" aria-hidden="true" />
      <motion.div
        className="absolute -bottom-16 -right-12 h-56 w-56 rounded-full bg-white/10 blur-2xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute -top-10 right-20 h-32 w-32 rounded-full bg-white/10 blur-2xl"
        animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        aria-hidden="true"
      />

      {/* Truck animated along a curve in the background */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-50"
        viewBox="0 0 800 240"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d="M 30 200 Q 220 30 420 130 T 780 50"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          strokeLinecap="round"
        />
        <motion.g style={{ transform }} initial={false}>
          <circle r="14" fill="rgba(255,255,255,0.18)" />
          <circle r="8" fill="white" />
          <Truck x={-7} y={-7} width={14} height={14} stroke="#1a45e5" strokeWidth={2.4} />
        </motion.g>
      </svg>

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/25 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live · {greeting()}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mt-3 text-2xl font-semibold leading-tight sm:text-4xl"
          >
            Track every shipment,
            <br />
            <span className="bg-gradient-to-r from-white to-brand-100 bg-clip-text text-transparent">
              end to end.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-2 max-w-lg text-sm text-white/80 sm:text-base"
          >
            One screen for your dispatchers — search, advance status, and audit the full lifecycle of every handover.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-5 flex flex-wrap gap-2"
          >
            <Pill icon={<Sparkles className="h-3.5 w-3.5" />} text="Real-time status" />
            <Pill text="JWT secured" />
            <Pill text="State-machine enforced" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="flex items-center gap-4"
        >
          <div className="rounded-2xl bg-white/15 px-5 py-4 ring-1 ring-white/25 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">In motion</p>
            <AnimatedNumber
              value={liveCount}
              className="mt-0.5 block text-3xl font-semibold tabular-nums"
            />
          </div>
          <div className="hidden rounded-2xl bg-white/15 px-5 py-4 ring-1 ring-white/25 backdrop-blur sm:block">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">Access</p>
            <p className="mt-0.5 text-sm font-medium">
              {isAuthed ? 'Authenticated' : 'Read-only'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Dash length custom prop just to keep TS happy if needed */}
      <span data-len={dashLen} className="hidden" />
    </section>
  );
}

function Pill({ icon, text }: { icon?: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium ring-1 ring-white/20 backdrop-blur">
      {icon}
      {text}
    </span>
  );
}
