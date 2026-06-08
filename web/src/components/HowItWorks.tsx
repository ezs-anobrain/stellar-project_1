'use client';
import { HelpCircle, ShieldCheck, Zap, Star, Smartphone, Droplets } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <Smartphone className="text-blue-500" />,
      title: "Connect Wallet",
      desc: "Connect your Freighter wallet to the Stellar Testnet. This is your digital ID and payment method."
    },
    {
      icon: <Zap className="text-amber-500" />,
      title: "Fund with XLM",
      desc: "New to Stellar? Use our 'Fund' button to get free testnet XLM instantly from Friendbot."
    },
    {
      icon: <Droplets className="text-cyan-500" />,
      title: "Buy Water",
      desc: "Select the amount of gallons you need. Confirm the payment in your wallet—settlement is nearly instant."
    },
    {
      icon: <Star className="text-yellow-500" />,
      title: "Earn Loyalty",
      desc: "Every refill is automatically tracked on-chain. After 10 stamps, you earn a free refill reward."
    },
    {
      icon: <ShieldCheck className="text-emerald-500" />,
      title: "On-Chain Security",
      desc: "No paper cards to lose. Your loyalty progress and payments are secured by the Stellar network."
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-2 mb-8 text-[#78866b]">
        <HelpCircle size={24} />
        <h2 className="text-2xl font-black">How WaterX Works</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step, i) => (
          <div 
            key={i} 
            className="p-6 rounded-2xl border border-stone-100 bg-stone-50/50 transition-all hover:border-[#78866b]/30"
          >
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4">
              {step.icon}
            </div>
            <h3 className="font-bold text-stone-800 mb-2">{step.title}</h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 rounded-3xl bg-[#78866b] text-white overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">Ready to try?</h3>
          <p className="opacity-90 text-sm max-w-md mb-6">
            Experience the most modern way to refill water. Secure, transparent, and rewarding.
          </p>
          <div className="flex gap-4">
             <div className="px-4 py-2 bg-white/20 rounded-lg text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
               Fast Settlement
             </div>
             <div className="px-4 py-2 bg-white/20 rounded-lg text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
               Low Fees
             </div>
          </div>
        </div>
        <Droplets size={180} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
      </div>
    </div>
  );
}
