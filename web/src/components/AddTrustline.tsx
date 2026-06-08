'use client';
import { useState } from 'react';
import { buildAddUsdcTrustlineXDR } from '@/lib/trustline';
import { signAndSubmit } from '@/lib/sign';

type Status = 'idle' | 'working' | 'done' | 'error';

export default function AddTrustline({
  publicKey,
  onDone,
}: {
  publicKey: string;
  onDone: () => void;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const add = async () => {
    setStatus('working');
    setError('');
    try {
      const xdr = await buildAddUsdcTrustlineXDR(publicKey);
      await signAndSubmit(xdr, publicKey);
      setStatus('done');
      onDone();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to add trustline');
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl bg-[#78866b]/10 px-4 py-3 border border-[#78866b]/20">
        <span className="text-xs font-bold text-[#5d6852]">USDC Trustline Active</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <button
        onClick={add}
        disabled={status === 'working'}
        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-xs font-bold text-stone-600 transition-all hover:bg-stone-50 disabled:opacity-50 active:scale-95 shadow-sm"
      >
        {status === 'working' ? 'Adding Assets…' : 'Add USDC Asset'}
      </button>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
