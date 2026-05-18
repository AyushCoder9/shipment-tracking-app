import { AnimatePresence, motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ORDER = ['light', 'dark', 'system'] as const;
type Mode = (typeof ORDER)[number];

const META: Record<Mode, { Icon: typeof Sun; label: string }> = {
  light: { Icon: Sun, label: 'Light' },
  dark: { Icon: Moon, label: 'Dark' },
  system: { Icon: Monitor, label: 'System' },
};

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
  const { Icon, label } = META[mode];

  return (
    <button
      type="button"
      onClick={() => setMode(next)}
      title={`Theme: ${label} (click for ${META[next].label})`}
      className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mode}
          initial={{ y: -16, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 16, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Icon className="h-4 w-4" strokeWidth={2.2} />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
