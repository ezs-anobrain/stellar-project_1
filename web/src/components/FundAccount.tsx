'use client';
import { useState } from 'react';
import { fundTestnetAccount } from '@/lib/stellar';

export default function FundAccount({
  publicKey,
  onFunded,
}: {
  publicKey: string;
  onFunded: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fund = async () => {
    setLoading(true);
    setError('');
    try {
      await fundTestnetAccount(publicKey);
      onFunded();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Funding failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={fund}
        disabled={loading}
        className="w-full rounded-xl bg-stone-800 px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-stone-900 disabled:opacity-50 active:scale-95"
      >
        {loading ? 'Requesting Funds…' : 'Fund Testnet Wallet'}
      </button>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
