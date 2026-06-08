'use client';
import { useState } from 'react';
import type { WalletState } from '@/hooks/useWallet';

export default function ConnectWallet({
  publicKey,
  connecting,
  error,
  connect,
  disconnect,
}: WalletState) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (publicKey) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={copy}
          title="Copy full address"
          className="rounded-lg bg-stone-100 px-3 py-1.5 font-mono text-xs text-stone-600 transition-all hover:bg-stone-200 active:scale-95"
        >
          {copied ? 'Copied!' : `${publicKey.slice(0, 6)}…${publicKey.slice(-6)}`}
        </button>
        <button
          onClick={disconnect}
          className="text-xs font-bold text-stone-400 hover:text-red-500 transition-colors uppercase tracking-wider"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="text-right">
      <button
        onClick={connect}
        disabled={connecting}
        className="rounded-lg bg-[#78866b] px-5 py-2 text-sm font-bold text-white shadow-lg shadow-[#78866b]/20 transition-all hover:bg-[#6a765e] disabled:opacity-50 active:scale-95"
      >
        {connecting ? 'Connecting…' : 'Connect Wallet'}
      </button>
      {error && <p className="mt-2 max-w-xs text-sm text-red-500">{error}</p>}
    </div>
  );
}
