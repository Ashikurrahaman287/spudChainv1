import { useState } from 'react';
import { Link, useParams } from 'wouter';
import { ArrowLeft, Copy, Check, TrendingUp, TrendingDown, Users, Activity } from 'lucide-react';
import { generateTransactions, shortDisplay, generateTokens } from '@/lib/explorerData';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="ml-2 p-1.5 rounded-lg border border-white/10 text-white/30 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
    </button>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 py-4 border-b border-white/6">
      <dt className="text-white/40 text-sm w-48 shrink-0">{label}</dt>
      <dd className="text-sm text-white/80 flex-1 flex flex-wrap items-center gap-2">{children}</dd>
    </div>
  );
}

export default function ExplorerToken() {
  const params = useParams<{ contract: string }>();
  const contract = params.contract ?? '0xspudtoken';
  const tokens = generateTokens();
  const token = tokens[0];
  const txs = generateTransactions(20);

  const chartBars = Array.from({ length: 30 }, () => Math.random());
  const maxBar = Math.max(...chartBars);

  return (
    <div className="min-h-screen bg-[#020510] text-white">
      <header className="border-b border-white/6 sticky top-0 z-50" style={{ background: 'rgba(2,5,16,0.95)', backdropFilter: 'blur(20px)' }}>
        <div className="container mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/explorer" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-xs font-black">S</div>
            <span className="font-bold text-white/90 text-sm hidden sm:block">SpudChain Explorer</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-5xl">
        <Link href="/explorer" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Explorer
        </Link>

        {/* Token Hero */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-2xl font-black">
            {token.symbol[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-2xl font-bold">{token.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5 text-white/50 text-xs font-mono">{token.symbol}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-white/40 text-xs">{shortDisplay(contract)}</span>
              <CopyButton text={contract} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-mono font-bold text-white">{token.price}</p>
            <p className={`text-sm font-mono flex items-center justify-end gap-1 ${token.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {token.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {token.change} (24h)
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Market Cap', value: token.marketCap, icon: <Activity size={14} className="text-cyan-400" /> },
            { label: 'Holders', value: token.holders.toLocaleString(), icon: <Users size={14} className="text-violet-400" /> },
            { label: '24h Volume', value: '$48.2M', icon: <TrendingUp size={14} className="text-emerald-400" /> },
            { label: 'Txns (24h)', value: token.txns24h.toLocaleString(), icon: <Activity size={14} className="text-amber-400" /> },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-white/8 p-4" style={{ background: 'rgba(8,14,40,0.7)', backdropFilter: 'blur(12px)' }}>
              <div className="flex items-center gap-2 mb-2">{s.icon}<p className="text-white/30 text-xs">{s.label}</p></div>
              <p className="text-white font-mono font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Price Chart */}
        <div className="rounded-xl border border-white/8 p-5 mb-6" style={{ background: 'rgba(8,14,40,0.7)', backdropFilter: 'blur(12px)' }}>
          <p className="text-sm font-semibold text-white/70 mb-4">Price History (30 days)</p>
          <div className="flex items-end gap-1 h-24">
            {chartBars.map((v, i) => (
              <div key={i} className={`flex-1 rounded-sm transition-all ${token.positive ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ height: `${(v / maxBar) * 100}%`, opacity: 0.3 + (v / maxBar) * 0.6 }} />
            ))}
          </div>
          <div className="flex justify-between text-white/20 text-[10px] mt-2 px-1">
            <span>30d ago</span><span>15d ago</span><span>Now</span>
          </div>
        </div>

        {/* Contract Info */}
        <div className="rounded-xl border border-white/8 p-6 mb-6" style={{ background: 'rgba(8,14,40,0.7)', backdropFilter: 'blur(12px)' }}>
          <h2 className="text-sm font-semibold text-white/70 mb-4">Contract Info</h2>
          <dl>
            <Row label="Contract Address">
              <span className="font-mono text-cyan-400 text-xs break-all">{contract}</span>
              <CopyButton text={contract} />
            </Row>
            <Row label="Token Standard"><span className="font-mono text-white/60">SPUD-20</span></Row>
            <Row label="Decimals"><span className="font-mono text-white/60">18</span></Row>
            <Row label="Total Supply"><span className="font-mono text-white/60">1,000,000,000 {token.symbol}</span></Row>
            <Row label="Circulating Supply"><span className="font-mono text-white/60">824,392,102 {token.symbol}</span></Row>
            <Row label="Contract Creator">
              <Link href="/explorer/address/0xspudcreator" className="text-violet-400 hover:text-violet-300 font-mono text-xs">0xSPUD...CREATOR</Link>
            </Row>
            <Row label="Verified"><span className="text-emerald-400 flex items-center gap-1"><Check size={12} /> Verified</span></Row>
          </dl>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: 'rgba(8,14,40,0.6)', backdropFilter: 'blur(12px)' }}>
          <div className="px-5 py-3 border-b border-white/6">
            <p className="text-sm font-semibold text-white/80">Recent Token Transfers</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/6">
                  {['Tx Hash', 'Age', 'From', 'To', 'Amount', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-white/30 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {txs.map((tx, i) => (
                  <tr key={i} className="border-b border-white/4 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3"><Link href={`/explorer/tx/${tx.hash}`} className="text-cyan-400 font-mono">{shortDisplay(tx.hash)}</Link></td>
                    <td className="px-4 py-3 text-white/40">{tx.age}</td>
                    <td className="px-4 py-3"><Link href={`/explorer/address/${tx.from}`} className="text-cyan-400 font-mono">{tx.from}</Link></td>
                    <td className="px-4 py-3"><Link href={`/explorer/address/${tx.to}`} className="text-violet-400 font-mono">{tx.to}</Link></td>
                    <td className="px-4 py-3 text-white/70 font-mono">{tx.value}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs border font-medium ${tx.status === 'Success' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'}`}>{tx.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
