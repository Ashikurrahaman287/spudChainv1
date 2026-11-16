import { useEffect } from "react";
import { Link } from "wouter";
import BlockchainCanvas from "@/components/BlockchainCanvas";
import Header from "@/components/Header";
import MobileMenu from "@/components/MobileMenu";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import LiveDataSection from "@/components/LiveDataSection";
import UseCasesSection from "@/components/UseCasesSection";
import CommunitySection from "@/components/CommunitySection";
import TerminalSection from "@/components/TerminalSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import MetricsBlock from "@/components/MetricsBlock";
import BlockAnimation from "@/components/BlockAnimation";
import FloatingBlocks from "@/components/FloatingBlocks";
import NetworkGraph from "@/components/NetworkGraph";
import AnimatedCounter from "@/components/AnimatedCounter";
import { Search, ArrowRight, Layers, Activity, Zap } from "lucide-react";

export default function Home() {
  // Control mobile menu visibility
  useEffect(() => {
    const handleResize = () => {
      const mobileMenu = document.getElementById('mobile-menu');
      if (window.innerWidth >= 768 && mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="font-sans overflow-x-hidden min-h-screen bg-black text-gray-100 relative">
      <div className="grid-bg min-h-screen relative">
        {/* Base layer animation */}
        <BlockchainCanvas />
        
        {/* Header elements */}
        <Header />
        <MobileMenu />
        
        <main>
          {/* Main sections */}
          <HeroSection />
          
          {/* Floating blocks decorative element */}
          <div className="relative h-24">
            <FloatingBlocks />
          </div>
          
          <FeaturesSection />

          {/* Explorer Teaser Section */}
          <section className="py-20 px-4 relative">
            <div className="container mx-auto max-w-5xl">
              <div className="rounded-2xl border border-white/8 overflow-hidden relative"
                style={{ background: 'linear-gradient(135deg, rgba(0,180,255,0.05) 0%, rgba(130,80,240,0.05) 100%)', backdropFilter: 'blur(20px)' }}>
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                </div>
                <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-4 text-xs text-cyan-400 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Blockchain Data
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                      Explore Every Block,<br />
                      <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">Transaction &amp; Wallet</span>
                    </h2>
                    <p className="text-white/50 text-base mb-6 max-w-md">
                      The SpudChain Explorer gives you real-time visibility into every layer of the network — blocks, transactions, tokens, and validators.
                    </p>
                    <div className="flex flex-wrap gap-3 mb-8">
                      {[
                        { icon: <Layers size={14} />, label: '4.8M+ Blocks' },
                        { icon: <Activity size={14} />, label: '8.2B+ Transactions' },
                        { icon: <Zap size={14} />, label: '1.5M TPS' },
                      ].map(item => (
                        <div key={item.label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs">
                          <span className="text-cyan-400">{item.icon}</span>
                          {item.label}
                        </div>
                      ))}
                    </div>
                    <Link href="/explorer">
                      <button className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity">
                        <Search size={16} />
                        Open Explorer
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                  {/* Preview card mock */}
                  <div className="w-full md:w-80 shrink-0">
                    <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: 'rgba(8,14,40,0.8)', backdropFilter: 'blur(12px)' }}>
                      <div className="px-4 py-3 border-b border-white/6 flex items-center justify-between">
                        <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">Latest Blocks</span>
                        <span className="flex items-center gap-1.5 text-xs text-white/30"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Live</span>
                      </div>
                      <div className="divide-y divide-white/4">
                        {[4821200, 4821199, 4821198, 4821197].map((b, i) => (
                          <div key={b} className="px-4 py-3 flex items-center justify-between">
                            <div>
                              <p className="text-violet-400 font-mono text-xs font-semibold">#{b.toLocaleString()}</p>
                              <p className="text-white/30 text-[10px]">{i * 2 + 1}s ago · {Math.floor(Math.random() * 80 + 20)} txns</p>
                            </div>
                            <span className="text-emerald-400 font-mono text-xs">+0.284 SPUD</span>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-3 border-t border-white/6">
                        <Link href="/explorer" className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 transition-colors">
                          View all blocks <ArrowRight size={11} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Premium Network Intelligence Dashboard */}
          <div className="relative py-16 mb-6">
            {/* Section header */}
            <div className="container mx-auto px-4 mb-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-5 text-xs text-white/50 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Network Feed
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                SpudChain{' '}
                <span className="bg-gradient-to-r from-[#00F0FF] to-[#9B51E0] bg-clip-text text-transparent">
                  Network Intelligence
                </span>
              </h2>
              <p className="text-base text-white/40 max-w-xl mx-auto">
                Real-time blockchain activity &amp; sentiment monitoring
              </p>
            </div>

            {/* Full-width visualization */}
            <div className="w-full overflow-hidden relative rounded-none"
              style={{ boxShadow: '0 0 80px rgba(0,180,255,0.06) inset' }}
            >
              <div className="h-[82vh] min-h-[680px] w-full relative z-10">
                <NetworkGraph />
              </div>
            </div>
            
            {/* Energy efficiency comparison chart similar to reference image */}
            <div className="max-w-5xl mx-auto px-4 py-16">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[#00F0FF] to-[#9B51E0] bg-clip-text text-transparent">
                Carbon Negative Commitment
              </h2>
              <p className="text-lg text-center text-gray-400 max-w-4xl mx-auto mb-12">
                The efficiency of SpudChain consensus enables it to be the most sustainable blockchain network, based on 
                average energy consumed per transaction, according to our recent environmental analysis.
              </p>
              
              <div className="relative mt-16 mb-20">
                {/* SpudChain entry at the top */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#9B51E0] flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">SC</span>
                    </div>
                    <span className="font-bold text-white">SpudChain</span>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center">
                      <span className="text-[#00F0FF] font-mono font-bold mr-2">.0000001</span>
                      <span className="text-gray-400">kWh per transaction</span>
                      <div className="ml-2 bg-[#00F0FF]/20 px-2 py-0.5 rounded">
                        <span className="text-[#00F0FF] text-xs font-semibold">⚡</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Other blockchain comparisons - with website colors */}
                <div className="space-y-4">
                  {/* BNB Chain */}
                  <div className="flex items-center">
                    <div className="w-24 md:w-32 text-right pr-3">
                      <span className="text-gray-300">BNB Chain</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-8 bg-gradient-to-r from-[#00F0FF] to-[#9B51E0] opacity-30 rounded-sm flex items-center pl-2" style={{ width: '19%' }}>
                        <span className="text-white font-semibold">19×</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Solana */}
                  <div className="flex items-center">
                    <div className="w-24 md:w-32 text-right pr-3">
                      <span className="text-gray-300">Solana</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-8 bg-gradient-to-r from-[#00F0FF] to-[#9B51E0] opacity-40 rounded-sm flex items-center pl-2" style={{ width: '28%' }}>
                        <span className="text-white font-semibold">170×</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Near */}
                  <div className="flex items-center">
                    <div className="w-24 md:w-32 text-right pr-3">
                      <span className="text-gray-300">Near</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-8 bg-gradient-to-r from-[#00F0FF] to-[#9B51E0] opacity-50 rounded-sm flex items-center pl-2" style={{ width: '33%' }}>
                        <span className="text-white font-semibold">200×</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tron */}
                  <div className="flex items-center">
                    <div className="w-24 md:w-32 text-right pr-3">
                      <span className="text-gray-300">Tron</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-8 bg-gradient-to-r from-[#00F0FF] to-[#9B51E0] opacity-60 rounded-sm flex items-center pl-2" style={{ width: '40%' }}>
                        <span className="text-white font-semibold">400×</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Ethereum */}
                  <div className="flex items-center">
                    <div className="w-24 md:w-32 text-right pr-3">
                      <span className="text-gray-300">Ethereum</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-8 bg-gradient-to-r from-[#00F0FF] to-[#9B51E0] opacity-70 rounded-sm flex items-center pl-2" style={{ width: '55%' }}>
                        <span className="text-white font-semibold">3,300×</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cardano */}
                  <div className="flex items-center">
                    <div className="w-24 md:w-32 text-right pr-3">
                      <span className="text-gray-300">Cardano</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-8 bg-gradient-to-r from-[#00F0FF] to-[#9B51E0] opacity-80 rounded-sm flex items-center pl-2" style={{ width: '65%' }}>
                        <span className="text-white font-semibold">13,000×</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bitcoin */}
                  <div className="flex items-center">
                    <div className="w-24 md:w-32 text-right pr-3">
                      <span className="text-gray-300">Bitcoin</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-8 bg-gradient-to-r from-[#00F0FF] to-[#9B51E0] opacity-90 rounded-sm flex items-center pl-2" style={{ width: '90%' }}>
                        <span className="text-white font-semibold">100,000×</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Footer note */}
                <div className="mt-12 text-sm text-gray-400 max-w-3xl">
                  <p>In addition, SpudChain has committed to being a carbon-negative blockchain network through the purchase of 
                  quarterly carbon credits to offset the small amount of emissions from its infrastructure.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Terminal and live stats */}
          <TerminalSection />
          <MetricsBlock />
          <LiveDataSection />
          
          <UseCasesSection />
          <CommunitySection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
