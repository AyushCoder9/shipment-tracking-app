import { AlertCircle, Package, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import type { CreateShipmentInput } from '../api/shipments';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CreateShipmentInput) => Promise<void>;
}

const empty: CreateShipmentInput = {
  sender: '',
  receiver: '',
  origin: '',
  destination: '',
  weightKg: undefined,
  notes: '',
};

export function CreateShipmentModal({ open, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CreateShipmentInput>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const update =
    <K extends keyof CreateShipmentInput>(field: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const raw = e.target.value;
      setForm((prev) => ({
        ...prev,
        [field]: field === 'weightKg' ? (raw ? Number(raw) : undefined) : raw,
      }));
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        weightKg: form.weightKg && form.weightKg > 0 ? form.weightKg : undefined,
        notes: form.notes?.trim() ? form.notes : undefined,
      });
      setForm(empty);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create shipment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg animate-slide-up overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
        {/* Header banner */}
        <div className="relative overflow-hidden bg-brand-gradient p-5 text-white">
          <div className="absolute inset-0 bg-mesh opacity-50" aria-hidden="true" />
          <div className="relative flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/30 backdrop-blur">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Create a new shipment</h2>
                <p className="text-sm text-white/80">
                  Status starts at <span className="font-medium">Pending</span>. Tracking number auto-generated.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Sender" required>
              <input
                required
                value={form.sender}
                onChange={update('sender')}
                className="input"
                placeholder="Bluewave Electronics"
              />
            </Field>
            <Field label="Receiver" required>
              <input
                required
                value={form.receiver}
                onChange={update('receiver')}
                className="input"
                placeholder="Mart Retail Pvt Ltd"
              />
            </Field>
            <Field label="Origin" required>
              <input
                required
                value={form.origin}
                onChange={update('origin')}
                className="input"
                placeholder="Mumbai, IN"
              />
            </Field>
            <Field label="Destination" required>
              <input
                required
                value={form.destination}
                onChange={update('destination')}
                className="input"
                placeholder="Bengaluru, IN"
              />
            </Field>
            <Field label="Weight (kg)">
              <input
                type="number"
                min={0}
                step={0.1}
                value={form.weightKg ?? ''}
                onChange={update('weightKg')}
                className="input"
                placeholder="Optional"
              />
            </Field>
            <Field label="Notes">
              <input
                value={form.notes ?? ''}
                onChange={update('notes')}
                className="input"
                placeholder="Optional"
              />
            </Field>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              <Sparkles className="h-4 w-4" />
              {submitting ? 'Creating…' : 'Create shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="label">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </span>
      {children}
    </label>
  );
}
