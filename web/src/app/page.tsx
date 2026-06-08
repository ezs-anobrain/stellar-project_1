'use client';
import { useState, useCallback } from 'react';
import { Waves, Wallet, LayoutDashboard, Droplets, ArrowRightLeft, PlusCircle } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import ConnectWallet from '@/components/ConnectWallet';
import FundAccount from '@/components/FundAccount';
import AddTrustline from '@/components/AddTrustline';
import BalanceCard from '@/components/BalanceCard';
import WaterStation from '@/components/WaterStation';

export default function Home() {
  const wallet = useWallet();
  const { publicKey, connecting } = wallet;
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return (
    <main className="min-h-screen w-full bg-[#fbfbf9] text-stone-900 font-sans selection:bg-[#78866b]/30">
      {/* Top Navigation */}
      <nav className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-[#78866b] p-1.5 text-white shadow-sm">
              <Waves size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-stone-800">
              Water<span className="text-[#78866b]">X</span>
            </span>
          </div>
          <ConnectWallet {...wallet} />
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-10">
        {!publicKey && !connecting ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-xl shadow-stone-200 text-stone-400">
              <Wallet size={48} strokeWidth={1.5} />
            </div>
            <h1 className="mb-4 text-4xl font-black tracking-tight text-stone-800">Modern Water Refills</h1>
            <p className="mb-10 max-w-md text-lg font-medium text-stone-500 leading-relaxed">
              Experience the future of water refilling stations. Secure, instant payments powered by Stellar.
            </p>
            <button 
              onClick={wallet.connect}
              className="inline-flex items-center gap-2 rounded-full bg-[#78866b] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#78866b]/30 transition-all hover:bg-[#6a765e] active:scale-95"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Stats & Wallet */}
            <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 text-[#78866b]">
                  <LayoutDashboard size={18} />
                  <h2 className="text-sm font-bold uppercase tracking-widest">Dashboard</h2>
                </div>
                
                <BalanceCard publicKey={publicKey!} refreshKey={refreshKey} />
                
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={refresh}
                    className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400 hover:text-[#78866b] transition-colors"
                  >
                    Sync Balances
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-[#78866b]">
                  <PlusCircle size={18} />
                  <h2 className="text-sm font-bold uppercase tracking-widest">Quick Actions</h2>
                </div>
                <div className="flex flex-col gap-3">
                  <FundAccount publicKey={publicKey!} onFunded={refresh} />
                  <AddTrustline publicKey={publicKey!} onDone={refresh} />
                </div>
              </div>
            </div>

            {/* Right Column: Main App */}
            <div className="lg:col-span-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-150">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-stone-200"></div>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-stone-200 bg-stone-50 text-stone-500 text-xs font-bold uppercase tracking-widest">
                  <Droplets size={14} className="text-[#78866b]" />
                  Refill Station
                </div>
                <div className="h-px flex-1 bg-stone-200"></div>
              </div>
              
              <WaterStation publicKey={publicKey} />
              
              <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-8 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <ArrowRightLeft size={120} className="rotate-12" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">Stellar Advantage</h3>
                <p className="text-stone-500 text-sm leading-relaxed max-w-sm">
                  Every refill is a direct on-chain transaction. Near-zero fees, instant settlement, and a permanent record of your water consumption.
                </p>
              </div>
            </div>

          </div>
        )}

        <footer className="mt-20 border-t border-stone-200 pt-10 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-300">
            WaterX Protocol · Powered by Stellar
          </p>
        </footer>
      </div>
    </main>
  );
}
