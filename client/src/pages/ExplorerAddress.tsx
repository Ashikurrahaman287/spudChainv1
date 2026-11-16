import { useState, useEffect } from 'react';
import { Link, useParams } from 'wouter';
import { ArrowLeft, Copy, Check, ChevronLeft, ChevronRight, Wallet } from 'lucide-react';
import { generateTransactions, shortDisplay, type Transaction } from '@/lib/explorerData';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="ml-2 p-1.5 rounded-lg border border-white/10 text-white/30 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
    </button>
  );
}

export default function ExplorerAddress() {
  const params = useParams<{ address: string }>();
  const address = params.address ?? '0xabcdef1234';
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<'transactions' | 'tokens' | 'internal'>('transactions');
  const PER = 10;

  const balance = (Math.random() * 50000 + 100).toFixed(4);
  const usdValue = (parseFloat(balance) * 2.48).toFixed(2);
  const firstSeen = '2024-01-15';
  const lastSeen = new Date().toISOString().split('T')[0];

  useEffect(() => { setTxs(generateTransactions(40)); }, []);

  const paged = txs.slice((page - 1) * PER, page * PER);
  const totalPages = Math.ceil(txs.length / PER);

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

        {/* Address Hero */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-600/20 border border-white/10 flex items-center justify-center">
            <Wallet size={24} className="text-cyan-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-xs border font-medium bg-sky-500/15 text-sky-400 border-sky-500/30">EOA</span>
              <h1 className="text-lg font-bold">Address</h1>
            </div>
            <div className="flex items-center flex-wrap gap-1">
              <span className="font-mono text-white/70 text-sm break-all">{address}</span>
              <CopyButton text={address} />
            </div>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'SPUD Balance', value: `${balance} SPUD`, sub: `$${usdValue}`, accent: 'text-cyan-400' },
            { label: 'Total Transactions', value: txs.length.toString(), sub: 'all time', accent: 'text-white' },
            { label: 'First Seen', value: firstSeen, sub: 'block #1,024,812', accent: 'text-white/70' },
            { label: 'Last Active', value: lastSeen, sub: '2 minutes ago', accent: 'text-emerald-400' },
          ].map(c => (
            <div key={c.label} className="rounded-xl border border-white/8 p-4" style={{ background: 'rgba(8,14,40,0.7)', backdropFilter: 'blur(12px)' }}>
              <p className="text-white/30 text-xs mb-1">{c.label}</p>
              <p className={`${c.accent} font-mono font-semibold text-sm`}>{c.value}</p>
              <p className="text-white/20 text-xs mt-0.5">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 border border-white/8 rounded-xl p-1 w-fit" style={{ background: 'rgba(8,14,40,0.5)' }}>
          {(['transactions', 'tokens', 'internal'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition-all ${tab === t ? 'bg-gradient-to-r from-cyan-500/20 to-violet-600/20 text-white border border-white/10' : 'text-white/40 hover:text-white/70'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Transactions Table */}
        {tab === 'transactions' && (
          <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: 'rgba(8,14,40,0.6)', backdropFilter: 'blur(12px)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/6">
                    {['Tx Hash', 'Block', 'Age', 'From', 'To', 'Value', 'Method', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-white/30 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((tx, i) => (
                    <tr key={i} className="border-b border-white/4 hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3"><Link href={`/explorer/tx/${tx.hash}`} className="text-cyan-400 hover:text-cyan-300 font-mono">{shortDisplay(tx.hash)}</Link></td>
                      <td className="px-4 py-3"><Link href={`/explorer/block/${tx.block}`} className="text-violet-400">#{tx.block.toLocaleString()}</Link></td>
                      <td className="px-4 py-3 text-white/40">{tx.age}</td>
                      <td className="px-4 py-3"><Link href={`/explorer/address/${tx.from}`} className="text-cyan-400 font-mono">{tx.from}</Link></td>
                      <td className="px-4 py-3"><Link href={`/explorer/address/${tx.to}`} className="text-violet-400 font-mono">{tx.to}</Link></td>
                      <td className="px-4 py-3 text-white/70 font-mono">{tx.value}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-white/6 border border-white/10 text-white/60">{tx.method}</span></td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs border font-medium ${tx.status === 'Success' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : tx.status === 'Pending' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-rose-500/15 text-rose-400 border-rose-500/30'}`}>{tx.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-white/6 flex items-center justify-between">
              <span className="text-xs text-white/30">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white disabled:opacity-30 transition-all"><ChevronLeft size={14} /></button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white disabled:opacity-30 transition-all"><ChevronRight size={14} /></button>
              </div>
            </div>
          </div>
        )}

        {tab === 'tokens' && (
          <div className="rounded-xl border border-white/8 p-8 text-center" style={{ background: 'rgba(8,14,40,0.6)', backdropFilter: 'blur(12px)' }}>
            <p className="text-white/30 text-sm">Token holdings for this address</p>
            <p className="text-4xl font-mono font-bold text-cyan-400 mt-3">{(Math.random() * 10000 + 100).toFixed(2)} SPUD</p>
            <p className="text-white/20 text-xs mt-1">≈ ${(Math.random() * 25000).toFixed(2)}</p>
          </div>
        )}

        {tab === 'internal' && (
          <div className="rounded-xl border border-white/8 p-8 text-center" style={{ background: 'rgba(8,14,40,0.6)', backdropFilter: 'blur(12px)' }}>
            <p className="text-white/30 text-sm">No internal transactions found for this address.</p>
          </div>
        )}
      </main>
    </div>
  );
}
