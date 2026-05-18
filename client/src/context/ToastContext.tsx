import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type ToastKind = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastApi {
  push: (kind: ToastKind, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

let nextId = 1;

const STYLES: Record<ToastKind, { bg: string; ring: string; icon: typeof CheckCircle2; iconColor: string }> = {
  success: {
    bg: 'bg-white dark:bg-slate-900',
    ring: 'ring-emerald-200 dark:ring-emerald-500/40',
    icon: CheckCircle2,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  error: {
    bg: 'bg-white dark:bg-slate-900',
    ring: 'ring-rose-200 dark:ring-rose-500/40',
    icon: AlertCircle,
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  info: {
    bg: 'bg-white dark:bg-slate-900',
    ring: 'ring-slate-200 dark:ring-slate-700',
    icon: Info,
    iconColor: 'text-brand-600 dark:text-brand-400',
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, message: string) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, kind, message }]);
      setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      push,
      success: (m) => push('success', m),
      error: (m) => push('error', m),
      info: (m) => push('info', m),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => {
          const { bg, ring, icon: Icon, iconColor } = STYLES[t.kind];
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl ${bg} px-3.5 py-3 shadow-soft ring-1 ${ring} animate-slide-in-right`}
            >
              <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${iconColor}`} strokeWidth={2.2} />
              <p className="flex-1 text-sm text-slate-700 dark:text-slate-200">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="rounded-md p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
