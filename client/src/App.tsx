import confetti from 'canvas-confetti';
import { AlertTriangle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CreateShipmentModal } from './components/CreateShipmentModal';
import { EmptyState } from './components/EmptyState';
import { FilterBar } from './components/FilterBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LoginPage } from './components/LoginPage';
import { ScrollProgress } from './components/ScrollProgress';
import { ShipmentDetailDrawer } from './components/ShipmentDetailDrawer';
import { ShipmentTable } from './components/ShipmentTable';
import { StatsStrip } from './components/StatsStrip';
import { TableSkeleton } from './components/TableSkeleton';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import {
  useCreateShipment,
  useShipmentStats,
  useShipments,
  useUpdateStatus,
} from './hooks/useShipments';
import type { Shipment, ShipmentStatus } from './types/shipment';

function burstConfetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const defaults = { spread: 70, startVelocity: 32, ticks: 110, scalar: 0.9 };
  confetti({
    ...defaults,
    particleCount: 60,
    origin: { y: 0.35, x: 0.5 },
    colors: ['#2f60f6', '#5786ff', '#10b981', '#f59e0b', '#e11d48'],
  });
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 30,
      origin: { y: 0.4, x: 0.3 },
      angle: 60,
    });
    confetti({
      ...defaults,
      particleCount: 30,
      origin: { y: 0.4, x: 0.7 },
      angle: 120,
    });
  }, 120);
}

export function App() {
  const auth = useAuth();
  const toast = useToast();

  const shipmentsQ = useShipments();
  const statsQ = useShipmentStats();
  const create = useCreateShipment();
  const updateStatus = useUpdateStatus();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ShipmentStatus | 'All'>('All');
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<Shipment | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);

  const filtered = useMemo(() => {
    const list = shipmentsQ.data ?? [];
    const term = search.trim().toLowerCase();
    return list.filter((s) => {
      if (status !== 'All' && s.status !== status) return false;
      if (!term) return true;
      return (
        s.trackingNumber.toLowerCase().includes(term) ||
        s.sender.toLowerCase().includes(term) ||
        s.receiver.toLowerCase().includes(term) ||
        s.origin.toLowerCase().includes(term) ||
        s.destination.toLowerCase().includes(term)
      );
    });
  }, [shipmentsQ.data, search, status]);

  const inFlight = useMemo(() => {
    if (!statsQ.data) return 0;
    return statsQ.data.Pending + statsQ.data['Picked Up'] + statsQ.data['In Transit'];
  }, [statsQ.data]);

  const refreshSelected = (next: Shipment) =>
    setSelected((curr) => (curr && curr.id === next.id ? next : curr));

  const handleAdvance = async (shipment: Shipment, next: ShipmentStatus) => {
    try {
      const updated = await updateStatus.mutateAsync({ id: shipment.id, status: next });
      refreshSelected(updated);
      toast.success(`${updated.trackingNumber} → ${updated.status}`);
      if (updated.status === 'Delivered') burstConfetti();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Status update failed');
    }
  };

  const handleCreate = async (input: Parameters<typeof create.mutateAsync>[0]) => {
    const created = await create.mutateAsync(input);
    toast.success(`Created ${created.trackingNumber}`);
    burstConfetti();
  };

  if (loginOpen && !auth.isAuthenticated) {
    return <LoginPage onClose={() => setLoginOpen(false)} />;
  }

  const showingFiltered = filtered.length !== (shipmentsQ.data?.length ?? 0);

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <Header onSignIn={() => setLoginOpen(true)} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          <Hero liveCount={inFlight} isAuthed={auth.isAuthenticated} />

          <StatsStrip
            stats={statsQ.data}
            shipments={shipmentsQ.data ?? []}
            onSelectStatus={setStatus}
          />

          <FilterBar
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            onCreate={() => {
              if (!auth.isAuthenticated) {
                setLoginOpen(true);
                return;
              }
              setCreateOpen(true);
            }}
            canCreate={auth.isAuthenticated}
          />

          <div id="shipments-list" className="space-y-3 scroll-mt-16">
            {shipmentsQ.data && (
              <div className="flex items-center justify-between px-1">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Showing{' '}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {filtered.length}
                  </span>{' '}
                  {showingFiltered && (
                    <span className="text-slate-400 dark:text-slate-500">
                      of {shipmentsQ.data.length}
                    </span>
                  )}{' '}
                  shipments
                </p>
                {showingFiltered && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setStatus('All');
                    }}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {shipmentsQ.isLoading && <TableSkeleton rows={6} />}

            {shipmentsQ.isError && (
              <div className="card flex items-start gap-3 border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Failed to load shipments.</p>
                  <p className="mt-0.5 text-rose-600/90 dark:text-rose-300/80">
                    Is the API running on <span className="font-mono">localhost:4000</span>?
                  </p>
                </div>
              </div>
            )}

            {shipmentsQ.data && filtered.length === 0 && <EmptyState />}

            {shipmentsQ.data && filtered.length > 0 && (
              <ShipmentTable
                shipments={filtered}
                onSelect={setSelected}
                onAdvance={handleAdvance}
                canMutate={auth.isAuthenticated}
              />
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/70 bg-white/60 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
        <span className="font-medium text-slate-700 dark:text-slate-200">Samex.Delivery</span> ·
        Internal demo build · {new Date().getFullYear()}
      </footer>

      <CreateShipmentModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
      <ShipmentDetailDrawer
        shipment={selected}
        onClose={() => setSelected(null)}
        onAdvance={handleAdvance}
        canMutate={auth.isAuthenticated}
      />
    </div>
  );
}
