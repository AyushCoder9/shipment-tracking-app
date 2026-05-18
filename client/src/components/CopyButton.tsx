import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard API may be blocked; fall back silently.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={copied ? 'Copied!' : `Copy ${label ?? 'value'}`}
      className="inline-flex items-center justify-center rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.4} />
      ) : (
        <Copy className="h-3.5 w-3.5" strokeWidth={2} />
      )}
    </button>
  );
}
