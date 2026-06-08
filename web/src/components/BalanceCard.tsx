'use client';
import { useState, useEffect } from 'react';
import { fetchBalances, type Balances } from '@/lib/balances';

export default function BalanceCard({
  publicKey,
  refreshKey,
}: {
  publicKey: string;
  refreshKey: number;
}) {
  const [balances, setBalances] = useState<Balances | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchBalances(publicKey)
      .then((b) => active && setBalances(b))
      .catch(() => active && setBalances(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [publicKey, refreshKey]);

  if (loading) {
    return (
      <div className="mt-4 grid animate-pulse grid-cols-2 gap-4">
        <div className="h-20 rounded bg-stone-100" />
        <div className="h-20 rounded bg-stone-100" />
      </div>
    );
  }

  if (balances && !balances.funded) {
    return (
      <p className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs font-medium text-stone-500 italic leading-relaxed">
        Account not yet active. Please request funds to start refilling.
      </p>
    );
  }

  if (!balances) {
    return <p className="mt-4 text-xs font-bold text-red-500 uppercase tracking-widest text-center">Load Error</p>;
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="rounded-xl border border-stone-100 bg-stone-50 p-4 transition-all hover:border-[#78866b]/30">
        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">XLM Balance</p>
        <p className="text-2xl font-black text-stone-800">{Number(balances.xlm).toLocaleString()}</p>
      </div>
      <div className="rounded-xl border border-stone-100 bg-stone-50 p-4 transition-all hover:border-[#78866b]/30">
        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">USDC Credits</p>
        <p className="text-2xl font-black text-[#78866b]">{Number(balances.usdc).toLocaleString()}</p>
      </div>
    </div>
  );
}
