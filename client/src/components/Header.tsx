import { LogIn, LogOut, Truck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export function Header({ onSignIn }: { onSignIn: () => void }) {
  const { username, isAuthenticated, logout } = useAuth();
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow">
            <Truck className="h-5 w-5" strokeWidth={2.4} />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse-soft dark:ring-slate-950" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900 dark:text-slate-50 sm:text-lg">
              Samex<span className="text-brand-600 dark:text-brand-400">.Delivery</span>
            </h1>
            <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
              B2B logistics command center
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800/60 sm:flex">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {username}
                </span>
              </div>
              <button type="button" onClick={logout} className="btn-secondary">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <button type="button" onClick={onSignIn} className="btn-primary">
              <LogIn className="h-4 w-4" />
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
