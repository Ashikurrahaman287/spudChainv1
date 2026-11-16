import { useState } from 'react';
import { Link, useParams } from 'wouter';
import { ArrowLeft, Copy, Check, CheckCircle, Clock, XCircle, ExternalLink } from 'lucide-react';
import { fullAddr, shortDisplay } from '@/lib/explorerData';

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

export default function ExplorerTx() {
  const params = useParams<{ hash: string }>();
  const hash = params.hash || '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';

  const from = fullAddr();
  const to = fullAddr();
  const block = 4_821_187;
  const value = (Math.random() * 1000).toFixed(6);
  const gas = (Math.random() * 0.0001).toFixed(8);
  const status = Math.random() > 0.2 ? 'Success' : 'Failed';

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

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">Transaction Details</h1>
            {status === 'Success'
              ? <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold"><CheckCircle size={12} /> Success</span>
              : <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold"><XCircle size={12} /> Failed</span>
            }
          </div>
          <p className="text-white/30 text-sm font-mono">{shortDisplay(hash)}</p>
        </div>

        <div className="rounded-xl border border-white/8 p-6 mb-6" style={{ background: 'rgba(8,14,40,0.7)', backdropFilter: 'blur(16px)' }}>
          <dl>
            <Row label="Transaction Hash">
              <span className="font-mono text-cyan-400 break-all">{hash}</span>
              <CopyButton text={hash} />
            </Row>
            <Row label="Status">
              {status === 'Success'
                ? <span className="flex items-center gap-1 text-emerald-400"><CheckCircle size={14} /> Success</span>
                : <span className="flex items-center gap-1 text-rose-400"><XCircle size={14} /> Failed</span>
              }
            </Row>
            <Row label="Block">
              <Link href={`/explorer/block/${block}`} className="text-violet-400 hover:text-violet-300 font-mono">#{block.toLocaleString()}</Link>
            </Row>
            <Row label="Timestamp">
              <span className="flex items-center gap-1.5 text-white/60"><Clock size={13} /> {new Date().toUTCString()}</span>
            </Row>
            <Row label="From">
              <Link href={`/explorer/address/${from}`} className="text-cyan-400 hover:text-cyan-300 font-mono break-all">{from}</Link>
              <CopyButton text={from} />
            </Row>
            <Row label="To">
              <Link href={`/explorer/address/${to}`} className="text-violet-400 hover:text-violet-300 font-mono break-all">{to}</Link>
              <CopyButton text={to} />
            </Row>
            <Row label="Value">
              <span className="font-mono font-semibold">{value} SPUD</span>
              <span className="text-white/30 text-xs">(${(parseFloat(value) * 2.48).toFixed(2)})</span>
            </Row>
            <Row label="Gas Fee">
              <span className="font-mono">{gas} SPUD</span>
              <span className="text-white/30 text-xs">($0.0000)</span>
            </Row>
            <Row label="Gas Price"><span className="font-mono text-white/60">0.000001 Gwei</span></Row>
            <Row label="Gas Limit / Used">
              <span className="font-mono text-white/60">21,000 / 21,000 (100%)</span>
            </Row>
            <Row label="Nonce"><span className="font-mono text-white/60">{Math.floor(Math.random() * 10000)}</span></Row>
            <Row label="Input Data">
              <span className="px-2 py-1 rounded bg-white/5 border border-white/8 text-white/40 font-mono text-xs">0x (Transfer)</span>
            </Row>
          </dl>
        </div>

        <div className="rounded-xl border border-white/8 p-5" style={{ background: 'rgba(8,14,40,0.5)', backdropFilter: 'blur(12px)' }}>
          <p className="text-sm font-semibold text-white/60 mb-3">More Details</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Confirmations', value: '2,481' },
              { label: 'Block Confirmations', value: '412' },
              { label: 'Position in Block', value: '#7' },
              { label: 'Type', value: 'Legacy' },
            ].map(item => (
              <div key={item.label}>
                <p className="text-white/30 text-xs mb-1">{item.label}</p>
                <p className="text-white/80 font-mono text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
