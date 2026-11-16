import { useState, useEffect } from 'react';
import { Link, useParams } from 'wouter';
import { ArrowLeft, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
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

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 py-4 border-b border-white/6">
      <dt className="text-white/40 text-sm w-52 shrink-0">{label}</dt>
      <dd className="text-sm text-white/80 flex-1 flex flex-wrap items-center gap-2">{children}</dd>
    </div>
  );
}

export default function ExplorerBlock() {
  const params = useParams<{ number: string }>();
  const blockNum = parseInt(params.number ?? '4821200', 10);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const PER = 8;

  useEffect(() => { setTxs(generateTransactions(32, blockNum)); }, [blockNum]);

  const paged = txs.slice((page - 1) * PER, page * PER);
  const totalPages = Math.ceil(txs.length / PER);
  const validator = `0x${Array.from({ length: 8 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}...${Array.from({ length: 4 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`;
  const blockHash = `0x${Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`;

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

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <Link href="/explorer" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Explorer
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <Link href={`/explorer/block/${blockNum - 1}`} className="p-2 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all"><ChevronLeft size={16} /></Link>
          <div>
            <h1 className="text-2xl font-bold">Block <span className="text-violet-400 font-mono">#{blockNum.toLocaleString()}</span></h1>
            <p className="text-white/30 text-sm">{new Date().toUTCString()}</p>
          </div>
          <Link href={`/explorer/block/${blockNum + 1}`} className="p-2 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all"><ChevronRight size={16} /></Link>
        </div>

        <div className="rounded-xl border border-white/8 p-6 mb-6" style={{ background: 'rgba(8,14,40,0.7)', backdropFilter: 'blur(16px)' }}>
          <dl>
            <Row label="Block Height"><span className="font-mono text-violet-400">#{blockNum.toLocaleString()}</span></Row>
            <Row label="Block Hash">
              <span className="font-mono text-cyan-400 break-all text-xs">{blockHash}</span>
              <CopyButton text={blockHash} />
            </Row>
            <Row label="Timestamp"><span className="text-white/60">{new Date().toUTCString()}</span></Row>
            <Row label="Transactions"><span className="text-white/80 font-semibold">{txs.length} transactions</span></Row>
            <Row label="Validator">
              <Link href={`/explorer/address/${validator}`} className="text-cyan-400 hover:text-cyan-300 font-mono">{validator}</Link>
              <CopyButton text={validator} />
            </Row>
            <Row label="Block Reward"><span className="text-emerald-400 font-mono font-semibold">0.2841 SPUD</span></Row>
            <Row label="Gas Used / Limit">
              <span className="font-mono text-white/60">18,482,241 / 30,000,000</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs">61.6%</span>
            </Row>
            <Row label="Block Size"><span className="text-white/60 font-mono">48.2 KB</span></Row>
            <Row label="Difficulty"><span className="font-mono text-white/60">—</span><span className="text-white/30 text-xs">(PoS)</span></Row>
            <Row label="Nonce"><span className="font-mono text-white/60">0x0000000000000000</span></Row>
          </dl>
        </div>

        {/* Transactions in block */}
        <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: 'rgba(8,14,40,0.6)', backdropFilter: 'blur(12px)' }}>
          <div className="px-5 py-3 border-b border-white/6 flex items-center justify-between">
            <p className="text-sm font-semibold text-white/80">Transactions in Block</p>
            <span className="text-xs text-white/30">{txs.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/6">
                  {['Tx Hash', 'Method', 'From', 'To', 'Value', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-white/30 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((tx, i) => (
                  <tr key={i} className="border-b border-white/4 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/explorer/tx/${tx.hash}`} className="text-cyan-400 hover:text-cyan-300 font-mono">{shortDisplay(tx.hash)}</Link>
                    </td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-white/6 border border-white/10 text-white/60">{tx.method}</span></td>
                    <td className="px-4 py-3"><Link href={`/explorer/address/${tx.from}`} className="text-cyan-400 hover:text-cyan-300 font-mono">{tx.from}</Link></td>
                    <td className="px-4 py-3"><Link href={`/explorer/address/${tx.to}`} className="text-violet-400 hover:text-violet-300 font-mono">{tx.to}</Link></td>
                    <td className="px-4 py-3 text-white/70 font-mono">{tx.value}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs border font-medium ${tx.status === 'Success' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : tx.status === 'Pending' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-rose-500/15 text-rose-400 border-rose-500/30'}`}>
                        {tx.status}
                      </span>
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
      </main>
    </div>
  );
}
