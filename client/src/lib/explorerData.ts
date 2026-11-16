// Shared mock data generators for the SpudChain Explorer

export function shortHash(len = 8) {
  return Array.from({ length: len }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
}

export function randomAddr() {
  return `0x${shortHash(4)}...${shortHash(4)}`;
}

export function fullAddr() {
  return `0x${Array.from({ length: 40 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`;
}

export function fullHash() {
  return `0x${Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`;
}

export function shortDisplay(hex: string) {
  if (hex.length <= 16) return hex;
  return `${hex.slice(0, 10)}...${hex.slice(-8)}`;
}

export function timeAgo(seconds: number) {
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

export interface Block {
  number: number;
  hash: string;
  validator: string;
  txCount: number;
  size: string;
  reward: string;
  timestamp: number;
  gasUsed: string;
  gasLimit: string;
  age: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  status: 'Success' | 'Pending' | 'Failed';
  timestamp: number;
  gas: string;
  method: string;
  age: string;
  block: number;
}

export interface Token {
  name: string;
  symbol: string;
  contract: string;
  price: string;
  change: string;
  positive: boolean;
  marketCap: string;
  holders: number;
  txns24h: number;
}

export interface Validator {
  address: string;
  stake: string;
  blocksProduced: number;
  uptime: string;
  status: 'Active' | 'Standby' | 'Jailed';
  commission: string;
  rewards: string;
}

const METHODS = ['Transfer', 'Swap', 'Approve', 'Stake', 'Claim', 'Mint', 'Burn', 'Bridge'];
const STATUSES: Array<'Success' | 'Pending' | 'Failed'> = ['Success', 'Success', 'Success', 'Pending', 'Failed'];
const V_STATUSES: Array<'Active' | 'Standby' | 'Jailed'> = ['Active', 'Active', 'Active', 'Standby', 'Jailed'];

export function generateBlocks(count: number, startBlock = 4_821_200): Block[] {
  return Array.from({ length: count }, (_, i) => {
    const secs = i * 2 + Math.floor(Math.random() * 2);
    return {
      number: startBlock - i,
      hash: fullHash(),
      validator: randomAddr(),
      txCount: Math.floor(Math.random() * 120) + 20,
      size: `${(Math.random() * 80 + 20).toFixed(1)} KB`,
      reward: `${(Math.random() * 0.5 + 0.1).toFixed(4)} SPUD`,
      timestamp: Date.now() - secs * 1000,
      gasUsed: `${(Math.random() * 60 + 30).toFixed(1)}%`,
      gasLimit: '30,000,000',
      age: timeAgo(secs),
    };
  });
}

export function generateTransactions(count: number, blockRef = 4_821_200): Transaction[] {
  return Array.from({ length: count }, (_, i) => {
    const secs = i * 3 + Math.floor(Math.random() * 5);
    return {
      hash: fullHash(),
      from: randomAddr(),
      to: randomAddr(),
      value: `${(Math.random() * 10000).toFixed(4)} SPUD`,
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
      timestamp: Date.now() - secs * 1000,
      gas: `${(Math.random() * 0.0001).toFixed(6)} SPUD`,
      method: METHODS[Math.floor(Math.random() * METHODS.length)],
      age: timeAgo(secs),
      block: blockRef - Math.floor(i / 3),
    };
  });
}

export function generateTokens(): Token[] {
  const tokens = [
    { name: 'SpudChain', symbol: 'SPUD', price: '$2.48', change: '+4.21%', positive: true, marketCap: '$2.4B', holders: 482_391, txns24h: 142_834 },
    { name: 'SpudUSD', symbol: 'sUSD', price: '$1.00', change: '+0.01%', positive: true, marketCap: '$890M', holders: 228_102, txns24h: 98_412 },
    { name: 'SpudBTC', symbol: 'sBTC', price: '$61,240', change: '-1.03%', positive: false, marketCap: '$610M', holders: 89_234, txns24h: 34_120 },
    { name: 'SpudETH', symbol: 'sETH', price: '$3,182', change: '+2.14%', positive: true, marketCap: '$320M', holders: 67_812, txns24h: 28_904 },
    { name: 'SpudDAO', symbol: 'SDAO', price: '$0.083', change: '+11.2%', positive: true, marketCap: '$83M', holders: 34_100, txns24h: 18_400 },
    { name: 'SpudNFT', symbol: 'SNFT', price: '$0.014', change: '-5.3%', positive: false, marketCap: '$14M', holders: 12_400, txns24h: 6_200 },
  ];
  return tokens.map(t => ({ ...t, contract: fullAddr() }));
}

export function generateValidators(): Validator[] {
  return Array.from({ length: 12 }, (_, i) => ({
    address: randomAddr(),
    stake: `${(Math.random() * 1_000_000 + 100_000).toFixed(0)} SPUD`,
    blocksProduced: Math.floor(Math.random() * 50_000 + 10_000),
    uptime: `${(99 + Math.random() * 0.99).toFixed(2)}%`,
    status: V_STATUSES[Math.min(i, V_STATUSES.length - 1)] as Validator['status'],
    commission: `${(Math.random() * 10).toFixed(1)}%`,
    rewards: `${(Math.random() * 5000 + 1000).toFixed(2)} SPUD`,
  }));
}
