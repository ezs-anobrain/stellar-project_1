'use client';
import { useState, useEffect, useCallback } from 'react';
import { History, Clock, ArrowUpRight, ArrowDownLeft, ExternalLink, Loader2 } from 'lucide-react';
import { HORIZON_URL } from '@/lib/stellar';

interface Transaction {
  id: string;
  hash: string;
  created_at: string;
  type: string;
  amount?: string;
  asset_code?: string;
  from?: string;
  to?: string;
  successful: boolean;
}

export default function TransactionHistory({ publicKey }: { publicKey: string }) {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${HORIZON_URL}/accounts/${publicKey}/payments?limit=10&order=desc`);
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      
      const payments = data._embedded.records.map((r: any) => ({
        id: r.id,
        hash: r.transaction_hash,
        created_at: r.created_at,
        type: r.type,
        amount: r.amount,
        asset_code: r.asset_code || 'XLM',
        from: r.from,
        to: r.to,
        successful: r.transaction_successful,
      }));
      
      setTxs(payments);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-stone-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-sm font-medium">Fetching payment history...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-[#78866b]">
          <History size={20} />
          <h2 className="text-lg font-bold">Recent Payments</h2>
        </div>
        <button 
          onClick={fetchHistory}
          className="text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-[#78866b] transition-colors"
        >
          Refresh
        </button>
      </div>

      {txs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 p-12 text-center">
          <Clock size={40} className="mx-auto text-stone-300 mb-4" />
          <p className="text-stone-500 font-medium">No transactions found yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {txs.map((tx) => {
            const isOutgoing = tx.from === publicKey;
            return (
              <div 
                key={tx.id} 
                className="group flex items-center justify-between p-4 rounded-xl border border-stone-100 bg-white hover:border-[#78866b]/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${isOutgoing ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {isOutgoing ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-800">
                        {isOutgoing ? '-' : '+'}{tx.amount} {tx.asset_code}
                      </span>
                      {!tx.successful && (
                        <span className="text-[10px] font-black uppercase bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Failed</span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400">
                      {new Date(tx.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <a 
                  href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-stone-300 hover:text-[#78866b] hover:bg-stone-50 rounded-lg transition-all"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
