'use client';
import { useState, useEffect, useCallback } from 'react';
import { Droplets, CreditCard, CheckCircle2, AlertCircle, Loader2, MapPin, Star, Gift } from 'lucide-react';
import { buildPaymentXDR, submitSignedXDR, pollTransaction } from '@/lib/payment';
import { NETWORK_PASSPHRASE, STATION_WALLET_ADDRESS } from '@/lib/stellar';
import { contractConfigured, readTally, buildAddStampXDR, buildResetTallyXDR } from '@/lib/contract';

const PRICE_PER_GALLON = 0.5;

export default function WaterStation({ publicKey }: { publicKey: string | null }) {
  const [gallons, setGallons] = useState('1');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [tally, setTally] = useState<number | null>(null);

  const configured = contractConfigured();

  const refreshTally = useCallback(async () => {
    if (publicKey && configured) {
      try {
        const t = await readTally(publicKey);
        setTally(t);
      } catch (e) {
        console.error('Failed to fetch tally', e);
      }
    }
  }, [publicKey, configured]);

  useEffect(() => {
    refreshTally();
  }, [refreshTally]);

  const cost = (Number(gallons) || 0) * PRICE_PER_GALLON;

  const handleRefill = async () => {
    if (!publicKey || !gallons || cost <= 0) return;
    setBusy(true);
    setMsg('');
    setError('');
    try {
      const xdr = await buildPaymentXDR(
        publicKey,
        STATION_WALLET_ADDRESS,
        cost.toFixed(7),
        'XLM'
      );

      const freighter = await import('@stellar/freighter-api');
      const signed = await freighter.signTransaction(xdr, {
        networkPassphrase: NETWORK_PASSPHRASE,
        address: publicKey,
      });

      if (signed.error) {
        throw new Error(
          typeof signed.error === 'string' ? signed.error : 'Signing was rejected'
        );
      }

      setMsg('Submitting payment...');
      const hash = await submitSignedXDR(signed.signedTxXdr);
      
      setMsg('Confirming on-chain...');
      await pollTransaction(hash);

      // Loyalty: add stamp if configured
      if (configured) {
        try {
          setMsg('Recording your loyalty stamp...');
          const stampXdr = await buildAddStampXDR(publicKey);
          const stampSigned = await freighter.signTransaction(stampXdr, {
            networkPassphrase: NETWORK_PASSPHRASE,
            address: publicKey,
          });
          if (!stampSigned.error) {
            const stampHash = await submitSignedXDR(stampSigned.signedTxXdr);
            await pollTransaction(stampHash);
          }
        } catch (stampErr) {
          console.error('Failed to add stamp', stampErr);
          // Don't fail the whole refill if just the stamp fails
        }
      }

      setMsg(`Success! ${gallons} gallons refilled.`);
      setGallons('1');
      refreshTally();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Refill failed');
    } finally {
      setBusy(false);
    }
  };

  const handleFreeRefill = async () => {
    if (!publicKey || !configured || tally !== 10) return;
    setBusy(true);
    setMsg('');
    setError('');
    try {
      setMsg('Claiming your free refill...');
      const resetXdr = await buildResetTallyXDR(publicKey);
      const freighter = await import('@stellar/freighter-api');
      const signed = await freighter.signTransaction(resetXdr, {
        networkPassphrase: NETWORK_PASSPHRASE,
        address: publicKey,
      });

      if (signed.error) {
        throw new Error(
          typeof signed.error === 'string' ? signed.error : 'Signing was rejected'
        );
      }

      const hash = await submitSignedXDR(signed.signedTxXdr);
      await pollTransaction(hash);

      setMsg('Success! Your free refill is ready.');
      setGallons('1');
      refreshTally();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Claim failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#94a3b8]/10 p-2 text-[#78866b]">
            <Droplets size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800">WaterX Station</h2>
            <p className="text-xs text-stone-500">Fast, secure refills on Stellar</p>
          </div>
        </div>
        {configured && publicKey && tally !== null && (
          <div className="flex flex-col items-end">
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < tally ? 'fill-amber-400 text-amber-400' : 'text-stone-200'}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter mt-1">
              {tally}/10 Stamps
            </span>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {tally === 10 ? (
          <div className="rounded-xl bg-amber-50 p-6 border border-amber-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-3">
              <Gift size={24} />
            </div>
            <h3 className="text-lg font-bold text-amber-900">Free Refill Earned!</h3>
            <p className="text-sm text-amber-700 mb-4">
              You've collected 10 stamps. Your next refill is on us!
            </p>
            <button
              onClick={handleFreeRefill}
              disabled={busy}
              className="w-full rounded-lg bg-amber-500 px-4 py-3 font-bold text-white transition-all hover:bg-amber-600 disabled:opacity-50 active:scale-[0.98] shadow-md shadow-amber-200"
            >
              {busy ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing...</span>
                </div>
              ) : (
                "Claim Free 1 Gallon Refill"
              )}
            </button>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Refill Amount (Gallons)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="e.g. 5"
                  value={gallons}
                  onChange={(e) => setGallons(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 focus:border-[#78866b] focus:ring-2 focus:ring-[#78866b]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="rounded-xl bg-[#f5f5f4] p-5 border border-stone-200/50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-500 font-medium">Rate:</span>
                <span className="font-bold text-stone-700">{PRICE_PER_GALLON} XLM/gal</span>
              </div>
              <div className="mt-3 flex justify-between items-end border-t border-stone-200 pt-3">
                <span className="text-sm font-semibold text-stone-600">Total Payable</span>
                <div className="text-right">
                  <span className="block text-2xl font-black text-[#78866b]">
                    {cost.toFixed(2)} <span className="text-sm font-bold">XLM</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleRefill}
              disabled={busy || !publicKey || cost <= 0}
              className="group relative w-full overflow-hidden rounded-lg bg-[#78866b] px-4 py-4 font-bold text-white transition-all hover:bg-[#6a765e] disabled:opacity-50 disabled:bg-stone-400 active:scale-[0.98]"
            >
              <div className="relative flex items-center justify-center gap-2">
                {busy ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    <span>Confirm & Pay</span>
                  </>
                )}
              </div>
            </button>
          </>
        )}

        {!publicKey && (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-stone-100 p-3 text-xs font-bold text-stone-500 border border-stone-200 uppercase tracking-widest">
            <AlertCircle size={14} />
            <span>Action Required: Connect Wallet</span>
          </div>
        )}

        {msg && (
          <div className="flex items-start gap-3 rounded-lg bg-[#78866b]/10 p-4 text-sm text-[#5d6852] border border-[#78866b]/20">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <p className="font-medium">{msg}</p>
          </div>
        )}
        
        {error && (
          <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-100">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-stone-100">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={12} className="text-stone-400" />
          <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            Station Node
          </h3>
        </div>
        <p className="text-[10px] text-stone-400/80 break-all font-mono bg-stone-50 p-2 rounded border border-stone-200/50">
          {STATION_WALLET_ADDRESS}
        </p>
      </div>
    </div>
  );
}
