import { motion } from 'framer-motion';
import { PackageSearch } from 'lucide-react';

export function EmptyState({
  title = 'No shipments found',
  subtitle = 'Try clearing filters or creating a new shipment.',
  action,
}: {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card flex flex-col items-center justify-center gap-3 px-6 py-14 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
        <PackageSearch className="h-7 w-7" strokeWidth={1.8} />
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
      {action}
    </motion.div>
  );
}
