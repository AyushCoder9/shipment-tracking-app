import { AlertCircle, ArrowRight, Lock, Shield, Sparkles, Truck, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function LoginPage({ onClose }: { onClose?: () => void }) {
  const { login } = useAuth();
  const toast = useToast();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('samex2026');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(username, password);
      toast.success('Signed in successfully');
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-mesh dark:bg-slate-950">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-5">
        {/* Brand panel */}
        <div className="relative hidden overflow-hidden bg-brand-gradient p-10 text-white lg:col-span-3 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-mesh opacity-50" aria-hidden="true" />
          <div className="absolute -right-32 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />

          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
              <Truck className="h-6 w-6" strokeWidth={2.4} />
            </div>
            <span className="text-lg font-semibold">
              Samex<span className="opacity-80">.Delivery</span>
            </span>
          </div>

          <div className="relative max-w-md">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/25 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Operations control plane</span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
              The fastest way to move freight, end to end.
            </h1>
            <p className="mt-3 text-sm text-white/80 sm:text-base">
              Track every shipment, audit every state change, and dispatch in seconds — from one screen.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-white/85">
              <Feature icon={Shield} text="Server-enforced status state machine — illegal transitions blocked at the API." />
              <Feature icon={Sparkles} text="Auto-generated tracking numbers + per-shipment audit timeline." />
              <Feature icon={Lock} text="JWT-protected mutations; reads optimized for dashboards." />
            </ul>
          </div>

          <div className="relative text-xs text-white/60">© {new Date().getFullYear()} Samex.Delivery</div>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:col-span-2">
          <div className="w-full max-w-sm">
            <div className="mb-8 lg:hidden">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow">
                <Truck className="h-6 w-6" strokeWidth={2.4} />
              </div>
              <h1 className="text-xl font-semibold text-slate-900">
                Samex<span className="text-brand-600">.Delivery</span>
              </h1>
            </div>

            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Sign in to manage shipments and update statuses.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <label className="block">
                <span className="label">Username</span>
                <div className="relative mt-1.5">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input pl-9"
                    required
                    autoFocus
                  />
                </div>
              </label>
              <label className="block">
                <span className="label">Password</span>
                <div className="relative mt-1.5">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-9"
                    required
                  />
                </div>
              </label>

              {error && (
                <div className="flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Signing in…' : 'Sign in'}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </button>

              {onClose && (
                <button type="button" onClick={onClose} className="btn-ghost w-full">
                  Continue as guest
                </button>
              )}
            </form>

            <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 text-center text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
              Demo credentials:{' '}
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-100">
                admin / samex2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, text }: { icon: typeof Shield; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-white/15 ring-1 ring-white/25">
        <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
      </span>
      <span>{text}</span>
    </li>
  );
}
