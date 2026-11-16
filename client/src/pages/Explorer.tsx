import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, Cpu, Zap, Globe, Activity, Layers, ArrowRight, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateBlocks, generateTransactions, generateTokens, generateValidators, shortDisplay, type Block, type Transaction, type Token, type Validator } from '@/lib/explorerData';

type Tab = 'transactions' | 'blocks' | 'tokens' | 'validators' | 'analytics';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="ml-1 text-white/30 hover:text-cyan-400 transition-colors">
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Failed: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    Active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Standby: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    Jailed: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border font-medium ${map[status] ?? 'bg-white/10 text-white/60 border-white/20'}`}>
      {status}
    </span>
  );
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="rounded-xl border border-white/8 p-4 relative overflow-hidden" style={{ background: 'rgba(8,14,40,0.7)', backdropFilter: 'blur(16px)' }}>
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 ${color}`} />
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg ${color} bg-opacity-20`}>{icon}</div>
        <span className="text-white/40 text-xs uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-white font-mono font-bold text-xl">{value}</p>
      {sub && <p className="text-white/30 text-xs mt-0.5">{sub}</p>}
    </div>
  );
}

export default function Explorer() {
  const [, navigate] = useLocation();
  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('transactions');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [tokens] = useState<Token[]>(generateTokens());
  const [validators] = useState<Validator[]>(generateValidators());
  const [tps, setTps] = useState(1_348_657);
  const [totalTxs, setTotalTxs] = useState(8_241_093_412);
  const [activeWallets, setActiveWallets] = useState(1_482_341);
  const [txPage, setTxPage] = useState(1);
  const [blockPage, setBlockPage] = useState(1);
  const PER_PAGE = 10;

  const refresh = useCallback(() => {
    setBlocks(generateBlocks(50));
    setTxs(generateTransactions(50));
  }, []);

  useEffect(() => {
    refresh();
    const iv = setInterval(() => {
      setTps(Math.floor(Math.random() * 500_000) + 1_100_000);
      setTotalTxs(p => p + Math.floor(Math.random() * 200 + 50));
      setActiveWallets(p => p + Math.floor(Math.random() * 10 - 3));
      setBlocks(prev => {
        const nb = generateBlocks(1, (prev[0]?.number ?? 4_821_200) + 1);
        return [...nb, ...prev.slice(0, 49)];
      });
      setTxs(prev => {
        const nt = generateTransactions(2);
        return [...nt, ...prev.slice(0, 48)];
      });
    }, 2000);
    return () => clearInterval(iv);
  }, [refresh]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const v = searchInput.trim();
    if (!v) return;
    if (v.startsWith('0x') && v.length > 50) navigate(`/explorer/tx/${v}`);
    else if (v.startsWith('0x')) navigate(`/explorer/address/${v}`);
    else if (/^\d+$/.test(v)) navigate(`/explorer/block/${v}`);
    else navigate(`/explorer/token/${v}`);
  };

  const pagedTxs = txs.slice((txPage - 1) * PER_PAGE, txPage * PER_PAGE);
  const pagedBlocks = blocks.slice((blockPage - 1) * PER_PAGE, blockPage * PER_PAGE);
  const totalTxPages = Math.ceil(txs.length / PER_PAGE);
  const totalBlockPages = Math.ceil(blocks.length / PER_PAGE);

  const TABS: { id: Tab; label: string }[] = [
    { id: 'transactions', label: 'Transactions' },
    { id: 'blocks', label: 'Blocks' },
    { id: 'tokens', label: 'Tokens' },
    { id: 'validators', label: 'Validators' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <div className="min-h-screen bg-[#020510] text-white">
      {/* Explorer Header */}
      <header className="border-b border-white/6 sticky top-0 z-50" style={{ background: 'rgba(2,5,16,0.95)', backdropFilter: 'blur(20px)' }}>
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-xs font-black">S</div>
            <span className="font-bold text-white/90 text-sm hidden sm:block">SpudChain Explorer</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search by address, tx hash, block number, or token..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all"
              />
            </div>
          </form>

          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/40 text-xs hidden sm:block">Mainnet</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-4 text-xs text-white/50 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live · Mainnet
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">
            SpudChain{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">Explorer</span>
          </h1>
          <p className="text-white/40 text-base max-w-lg mx-auto mb-8">
            Track blocks, transactions, wallets, and tokens in real time
          </p>
          {/* Full search bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search wallet address, tx hash, block number, or token contract..."
              className="w-full bg-white/5 border border-white/12 rounded-xl pl-12 pr-32 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/40 transition-all"
              style={{ backdropFilter: 'blur(12px)' }}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </form>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          <StatCard icon={<Layers size={14} className="text-cyan-400" />} label="Latest Block" value={`#${(4_821_200 + blocks.length).toLocaleString()}`} color="bg-cyan-500" />
          <StatCard icon={<Zap size={14} className="text-violet-400" />} label="TPS" value={tps.toLocaleString()} sub="transactions/sec" color="bg-violet-500" />
          <StatCard icon={<Activity size={14} className="text-emerald-400" />} label="Gas Price" value="$0.000" sub="avg fee" color="bg-emerald-500" />
          <StatCard icon={<Globe size={14} className="text-sky-400" />} label="Total Txns" value={totalTxs.toLocaleString()} color="bg-sky-500" />
          <StatCard icon={<Cpu size={14} className="text-amber-400" />} label="Active Wallets" value={activeWallets.toLocaleString()} color="bg-amber-500" />
          <StatCard icon={<Activity size={14} className="text-rose-400" />} label="Validators" value="3,927" sub="active nodes" color="bg-rose-500" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border border-white/8 rounded-xl p-1 w-fit" style={{ background: 'rgba(8,14,40,0.6)', backdropFilter: 'blur(12px)' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === t.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-violet-600/20 text-white border border-white/10'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: 'rgba(8,14,40,0.6)', backdropFilter: 'blur(12px)' }}>
            <div className="px-5 py-3 border-b border-white/6 flex items-center justify-between">
              <p className="text-sm font-semibold text-white/80">Latest Transactions</p>
              <span className="text-xs text-white/30">{txs.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/6">
                    {['Tx Hash', 'Method', 'Block', 'Age', 'From', 'To', 'Value', 'Gas', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-white/30 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedTxs.map((tx, i) => (
                    <tr key={i} className="border-b border-white/4 hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Link href={`/explorer/tx/${tx.hash}`} className="text-cyan-400 hover:text-cyan-300 font-mono">
                            {shortDisplay(tx.hash)}
                          </Link>
                          <CopyButton text={tx.hash} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-white/6 border border-white/10 text-white/60">{tx.method}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/explorer/block/${tx.block}`} className="text-violet-400 hover:text-violet-300">#{tx.block.toLocaleString()}</Link>
                      </td>
                      <td className="px-4 py-3 text-white/40">{tx.age}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Link href={`/explorer/address/${tx.from}`} className="text-cyan-400 hover:text-cyan-300 font-mono">{tx.from}</Link>
                          <CopyButton text={tx.from} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Link href={`/explorer/address/${tx.to}`} className="text-violet-400 hover:text-violet-300 font-mono">{tx.to}</Link>
                          <CopyButton text={tx.to} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/70 font-mono">{tx.value}</td>
                      <td className="px-4 py-3 text-white/40 font-mono">{tx.gas}</td>
                      <td className="px-4 py-3"><StatusBadge status={tx.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={txPage} total={totalTxPages} onPage={setTxPage} />
          </div>
        )}

        {/* Blocks Tab */}
        {activeTab === 'blocks' && (
          <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: 'rgba(8,14,40,0.6)', backdropFilter: 'blur(12px)' }}>
            <div className="px-5 py-3 border-b border-white/6 flex items-center justify-between">
              <p className="text-sm font-semibold text-white/80">Latest Blocks</p>
              <span className="text-xs text-white/30">{blocks.length} loaded</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/6">
                    {['Block', 'Age', 'Txns', 'Validator', 'Gas Used', 'Size', 'Reward'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-white/30 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedBlocks.map((b, i) => (
                    <tr key={i} className="border-b border-white/4 hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/explorer/block/${b.number}`} className="text-violet-400 hover:text-violet-300 font-mono font-semibold">#{b.number.toLocaleString()}</Link>
                      </td>
                      <td className="px-4 py-3 text-white/40">{b.age}</td>
                      <td className="px-4 py-3 text-white/70">{b.txCount}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Link href={`/explorer/address/${b.validator}`} className="text-cyan-400 hover:text-cyan-300 font-mono">{b.validator}</Link>
                          <CopyButton text={b.validator} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/60">{b.gasUsed}</td>
                      <td className="px-4 py-3 text-white/40">{b.size}</td>
                      <td className="px-4 py-3 text-emerald-400 font-mono">{b.reward}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={blockPage} total={totalBlockPages} onPage={setBlockPage} />
          </div>
        )}

        {/* Tokens Tab */}
        {activeTab === 'tokens' && (
          <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: 'rgba(8,14,40,0.6)', backdropFilter: 'blur(12px)' }}>
            <div className="px-5 py-3 border-b border-white/6">
              <p className="text-sm font-semibold text-white/80">Top Tokens</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/6">
                    {['#', 'Token', 'Contract', 'Price', '24h Change', 'Market Cap', 'Holders', 'Txns (24h)'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-white/30 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((t, i) => (
                    <tr key={i} className="border-b border-white/4 hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 text-white/30">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-[9px] font-black">{t.symbol[0]}</div>
                          <div>
                            <Link href={`/explorer/token/${t.contract}`} className="text-white hover:text-cyan-400 font-semibold">{t.name}</Link>
                            <p className="text-white/30">{t.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className="text-white/40 font-mono">{shortDisplay(t.contract)}</span>
                          <CopyButton text={t.contract} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white font-mono font-semibold">{t.price}</td>
                      <td className={`px-4 py-3 font-mono font-semibold ${t.positive ? 'text-emerald-400' : 'text-rose-400'}`}>{t.change}</td>
                      <td className="px-4 py-3 text-white/70">{t.marketCap}</td>
                      <td className="px-4 py-3 text-white/60">{t.holders.toLocaleString()}</td>
                      <td className="px-4 py-3 text-white/60">{t.txns24h.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Validators Tab */}
        {activeTab === 'validators' && (
          <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: 'rgba(8,14,40,0.6)', backdropFilter: 'blur(12px)' }}>
            <div className="px-5 py-3 border-b border-white/6">
              <p className="text-sm font-semibold text-white/80">Active Validators</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/6">
                    {['#', 'Address', 'Stake', 'Blocks Produced', 'Uptime', 'Commission', 'Rewards', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-white/30 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {validators.map((v, i) => (
                    <tr key={i} className="border-b border-white/4 hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 text-white/30">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Link href={`/explorer/address/${v.address}`} className="text-cyan-400 hover:text-cyan-300 font-mono">{v.address}</Link>
                          <CopyButton text={v.address} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/70 font-mono">{v.stake}</td>
                      <td className="px-4 py-3 text-white/70">{v.blocksProduced.toLocaleString()}</td>
                      <td className="px-4 py-3 text-emerald-400 font-mono">{v.uptime}</td>
                      <td className="px-4 py-3 text-white/60">{v.commission}</td>
                      <td className="px-4 py-3 text-violet-400 font-mono">{v.rewards}</td>
                      <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid md:grid-cols-2 gap-6">
            <AnalyticsCard title="Transaction Volume (24h)" metric="142,834,291" sub="transactions processed" color="from-cyan-500/20 to-cyan-500/5" accent="text-cyan-400" />
            <AnalyticsCard title="Network Throughput" metric="1,348,657 TPS" sub="peak performance" color="from-violet-500/20 to-violet-500/5" accent="text-violet-400" />
            <AnalyticsCard title="Total Value Locked" metric="$4.82B" sub="across all protocols" color="from-emerald-500/20 to-emerald-500/5" accent="text-emerald-400" />
            <AnalyticsCard title="Carbon Offset" metric="100% Neutral" sub="carbon-negative commitment" color="from-sky-500/20 to-sky-500/5" accent="text-sky-400" />
            <div className="md:col-span-2 rounded-xl border border-white/8 p-6" style={{ background: 'rgba(8,14,40,0.6)', backdropFilter: 'blur(12px)' }}>
              <p className="text-sm font-semibold text-white/80 mb-4">TPS Activity (Simulated)</p>
              <MiniChart />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Pagination({ page, total, onPage }: { page: number; total: number; onPage: (p: number) => void }) {
  return (
    <div className="px-5 py-3 border-t border-white/6 flex items-center justify-between">
      <span className="text-xs text-white/30">Page {page} of {total}</span>
      <div className="flex gap-2">
        <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 disabled:opacity-30 transition-all">
          <ChevronLeft size={14} />
        </button>
        <button onClick={() => onPage(Math.min(total, page + 1))} disabled={page === total} className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 disabled:opacity-30 transition-all">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

function AnalyticsCard({ title, metric, sub, color, accent }: { title: string; metric: string; sub: string; color: string; accent: string }) {
  return (
    <div className={`rounded-xl border border-white/8 p-6 bg-gradient-to-br ${color}`} style={{ backdropFilter: 'blur(12px)' }}>
      <p className="text-white/40 text-xs uppercase tracking-wider mb-3">{title}</p>
      <p className={`${accent} font-mono font-bold text-2xl mb-1`}>{metric}</p>
      <p className="text-white/30 text-xs">{sub}</p>
      <div className="mt-4 h-12 flex items-end gap-1">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className={`flex-1 rounded-sm ${accent.replace('text-', 'bg-')} opacity-30`}
            style={{ height: `${20 + Math.sin(i * 0.8) * 15 + Math.random() * 20}px` }} />
        ))}
      </div>
    </div>
  );
}

function MiniChart() {
  const points = Array.from({ length: 48 }, (_, i) => ({
    x: i,
    y: 50 + Math.sin(i * 0.4) * 25 + Math.random() * 15,
  }));
  const maxY = Math.max(...points.map(p => p.y));
  const minY = Math.min(...points.map(p => p.y));
  const scaleY = (v: number) => 100 - ((v - minY) / (maxY - minY)) * 80 - 10;
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(p.x / 47) * 100}% ${scaleY(p.y)}%`).join(' ');

  return (
    <div className="w-full h-40 relative">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,200,255,0.3)" />
            <stop offset="100%" stopColor="rgba(0,200,255,0)" />
          </linearGradient>
        </defs>
        <path d={`${pathD} L 100% 100% L 0% 100% Z`} fill="url(#chartGrad)" />
        <path d={pathD} fill="none" stroke="rgba(0,200,255,0.8)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-white/20 text-[10px] px-1">
        <span>48h ago</span><span>24h ago</span><span>Now</span>
      </div>
    </div>
  );
}
