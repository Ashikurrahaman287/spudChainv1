import { useEffect, useRef, useState, useCallback } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  angle: number;
  distance: number;
  speed: number;
  pulseOffset: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentValue: number;
  sentimentTarget: number;
  sentimentSpeed: number;
  cluster: number;
  walletId: string;
  txCount: number;
  status: string;
  layer: number;
}

interface Pulse {
  sourceId: number;
  targetId: number;
  progress: number;
  speed: number;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  node: Node | null;
}

function randomHex(len: number) {
  return Array.from({ length: len }, () =>
    '0123456789abcdef'[Math.floor(Math.random() * 16)]
  ).join('');
}

function generateWalletId() {
  return `0x${randomHex(4)}...${randomHex(4)}`;
}

const CLUSTER_COLORS = [
  { r: 0, g: 200, b: 255 },
  { r: 130, g: 80, b: 240 },
  { r: 80, g: 180, b: 255 },
];

export default function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });

  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, node: null });
  const [tps, setTps] = useState(1_348_657);
  const [totalBlocks, setTotalBlocks] = useState(4_821_093);
  const [activeNodes, setActiveNodes] = useState(0);
  const [sentimentIndex, setSentimentIndex] = useState(72);
  const [liveTime, setLiveTime] = useState(new Date());
  const canvasSizeRef = useRef({ w: 0, h: 0 });

  const buildNodes = useCallback((w: number, h: number) => {
    const nodes: Node[] = [];
    const cx = w / 2;
    const cy = h / 2;
    const statuses = ['Active', 'Synced', 'Validating', 'Processing', 'Confirmed', 'Congested', 'Pending'];

    // Central hub
    nodes.push({
      id: 0,
      x: cx, y: cy,
      radius: 14, baseRadius: 14,
      angle: 0, distance: 0, speed: 0,
      pulseOffset: 0,
      sentiment: 'positive', sentimentValue: 0.9, sentimentTarget: 0.9, sentimentSpeed: 0.001,
      cluster: -1,
      walletId: '0xSPUD...MAIN',
      txCount: 1_500_000,
      status: 'Hub',
      layer: 0,
    });

    // 3 clusters of nodes
    for (let c = 0; c < 3; c++) {
      const clusterAngle = (c / 3) * Math.PI * 2 + Math.PI / 6;
      const clusterDist = Math.min(w, h) * 0.28;
      const clusterX = cx + Math.cos(clusterAngle) * clusterDist;
      const clusterY = cy + Math.sin(clusterAngle) * clusterDist;

      // Cluster anchor
      nodes.push({
        id: nodes.length,
        x: clusterX, y: clusterY,
        radius: 9, baseRadius: 9,
        angle: clusterAngle, distance: clusterDist, speed: 0.00015 + Math.random() * 0.0001,
        pulseOffset: Math.random() * Math.PI * 2,
        sentiment: 'neutral', sentimentValue: 0.7, sentimentTarget: 0.7, sentimentSpeed: 0.0008,
        cluster: c,
        walletId: generateWalletId(),
        txCount: Math.floor(Math.random() * 100_000 + 50_000),
        status: 'Validator',
        layer: 1,
      });

      // Cluster children
      for (let i = 0; i < 10; i++) {
        const subAngle = (i / 10) * Math.PI * 2;
        const subDist = 55 + Math.random() * 45;
        const sentiment = ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as Node['sentiment'];
        nodes.push({
          id: nodes.length,
          x: clusterX + Math.cos(subAngle) * subDist,
          y: clusterY + Math.sin(subAngle) * subDist,
          radius: 3.5 + Math.random() * 3,
          baseRadius: 3.5 + Math.random() * 3,
          angle: subAngle,
          distance: subDist,
          speed: 0.0003 + Math.random() * 0.0005,
          pulseOffset: Math.random() * Math.PI * 2,
          sentiment,
          sentimentValue: Math.random(),
          sentimentTarget: Math.random(),
          sentimentSpeed: 0.001 + Math.random() * 0.002,
          cluster: c,
          walletId: generateWalletId(),
          txCount: Math.floor(Math.random() * 50_000 + 1_000),
          status: statuses[Math.floor(Math.random() * statuses.length)],
          layer: 2,
        });
      }
    }

    // Scattered outer nodes
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.3;
      const dist = Math.min(w, h) * (0.38 + Math.random() * 0.08);
      const sentiment = ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as Node['sentiment'];
      nodes.push({
        id: nodes.length,
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        radius: 3 + Math.random() * 2,
        baseRadius: 3 + Math.random() * 2,
        angle,
        distance: dist,
        speed: 0.0001 + Math.random() * 0.0002,
        pulseOffset: Math.random() * Math.PI * 2,
        sentiment,
        sentimentValue: Math.random(),
        sentimentTarget: Math.random(),
        sentimentSpeed: 0.0008 + Math.random() * 0.001,
        cluster: -2,
        walletId: generateWalletId(),
        txCount: Math.floor(Math.random() * 20_000),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        layer: 3,
      });
    }

    return nodes;
  }, []);

  useEffect(() => {
    const tpsInt = setInterval(() => {
      setTps(Math.floor(Math.random() * 500_000) + 1_100_000);
    }, 1800);
    const blockInt = setInterval(() => {
      setTotalBlocks(p => p + Math.floor(Math.random() * 5 + 1));
    }, 800);
    const sentInt = setInterval(() => {
      setSentimentIndex(Math.floor(Math.random() * 30) + 60);
    }, 3000);
    const timeInt = setInterval(() => setLiveTime(new Date()), 1000);
    return () => { clearInterval(tpsInt); clearInterval(blockInt); clearInterval(sentInt); clearInterval(timeInt); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rawCtx = canvas.getContext('2d');
    if (!rawCtx) return;
    const ctx: CanvasRenderingContext2D = rawCtx;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      canvasSizeRef.current = { w, h };
      nodesRef.current = buildNodes(w, h);

      // Rebuild pulses
      const nodes = nodesRef.current;
      const pulses: Pulse[] = [];
      for (let i = 0; i < 18; i++) {
        pulses.push({
          sourceId: 0,
          targetId: 1 + Math.floor(Math.random() * (nodes.length - 1)),
          progress: Math.random(),
          speed: 0.004 + Math.random() * 0.006,
        });
      }
      pulsesRef.current = pulses;

      const activeCount = nodes.filter(n => n.sentiment !== 'negative').length;
      setActiveNodes(activeCount);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let lastT = 0;

    function getSentimentColor(node: Node, alpha = 1) {
      const v = Math.min(1, Math.max(0, node.sentimentValue));
      if (node.sentiment === 'positive') {
        return `rgba(${Math.floor(30 + 100 * v)}, ${Math.floor(190 + 60 * v)}, ${Math.floor(80 + 80 * v)}, ${alpha})`;
      }
      if (node.sentiment === 'negative') {
        return `rgba(${Math.floor(200 + 50 * v)}, ${Math.floor(50 + 40 * v)}, ${Math.floor(60 + 50 * v)}, ${alpha})`;
      }
      // neutral
      if (node.cluster >= 0 && node.cluster < 3) {
        const c = CLUSTER_COLORS[node.cluster];
        return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
      }
      return `rgba(80, 160, 255, ${alpha})`;
    }

    function draw(ts: number) {
      const { w, h } = canvasSizeRef.current;
      if (!w || !h) { animRef.current = requestAnimationFrame(draw); return; }
      const dt = Math.min(ts - lastT, 50);
      lastT = ts;
      ctx.clearRect(0, 0, w, h);

      // Subtle dot grid
      ctx.save();
      ctx.globalAlpha = 0.04;
      ctx.fillStyle = '#7090ff';
      const gs = 40;
      for (let gx = gs; gx < w; gx += gs) {
        for (let gy = gs; gy < h; gy += gs) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      const nodes = nodesRef.current;
      const pulses = pulsesRef.current;
      const cx = w / 2;
      const cy = h / 2;

      // Update node positions & sentiment
      nodes.forEach(node => {
        if (node.id === 0) return;

        if (node.layer === 1) {
          // Cluster anchors orbit center
          node.angle += node.speed * dt;
          node.x = cx + Math.cos(node.angle) * node.distance;
          node.y = cy + Math.sin(node.angle) * node.distance;
        } else if (node.layer === 2) {
          // Children orbit their cluster anchor
          const anchor = nodes.find(n => n.cluster === node.cluster && n.layer === 1);
          if (anchor) {
            node.angle += node.speed * dt;
            const osc = Math.sin(ts * 0.0005 + node.pulseOffset) * 8;
            node.x = anchor.x + Math.cos(node.angle) * (node.distance + osc);
            node.y = anchor.y + Math.sin(node.angle) * (node.distance + osc);
          }
        } else if (node.layer === 3) {
          node.angle += node.speed * dt;
          const osc = Math.sin(ts * 0.0003 + node.pulseOffset) * 12;
          node.x = cx + Math.cos(node.angle) * (node.distance + osc);
          node.y = cy + Math.sin(node.angle) * (node.distance + osc);
        }

        // Sentiment drift
        if (Math.abs(node.sentimentValue - node.sentimentTarget) < 0.01) {
          if (Math.random() < 0.004) {
            node.sentimentTarget = Math.random();
            if (Math.random() < 0.15) {
              const s = ['positive', 'neutral', 'negative'] as const;
              node.sentiment = s[Math.floor(Math.random() * 3)];
            }
          }
        } else {
          node.sentimentValue += (node.sentimentTarget - node.sentimentValue) * node.sentimentSpeed * dt;
        }

        // Pulse radius
        const pulse = Math.sin(ts * 0.002 + node.pulseOffset) * 1.2;
        node.radius = node.baseRadius + pulse;
      });

      // Draw connections
      ctx.save();
      nodes.forEach(node => {
        if (node.id === 0) return;
        const hub = nodes[0];

        // Hub to layer1 anchors
        if (node.layer === 1) {
          const g = ctx.createLinearGradient(hub.x, hub.y, node.x, node.y);
          g.addColorStop(0, 'rgba(0, 200, 255, 0.5)');
          g.addColorStop(1, getSentimentColor(node, 0.3));
          ctx.beginPath();
          ctx.moveTo(hub.x, hub.y);
          ctx.lineTo(node.x, node.y);
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = 0.5;
          ctx.stroke();
        }

        // Children to cluster anchor
        if (node.layer === 2) {
          const anchor = nodes.find(n => n.cluster === node.cluster && n.layer === 1);
          if (anchor) {
            const g = ctx.createLinearGradient(anchor.x, anchor.y, node.x, node.y);
            g.addColorStop(0, getSentimentColor(anchor, 0.4));
            g.addColorStop(1, getSentimentColor(node, 0.2));
            ctx.beginPath();
            ctx.moveTo(anchor.x, anchor.y);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = g;
            ctx.lineWidth = 0.7;
            ctx.globalAlpha = 0.35;
            ctx.stroke();
          }
        }

        // Outer nodes to hub
        if (node.layer === 3) {
          const g = ctx.createLinearGradient(hub.x, hub.y, node.x, node.y);
          g.addColorStop(0, 'rgba(0, 200, 255, 0.2)');
          g.addColorStop(1, getSentimentColor(node, 0.15));
          ctx.beginPath();
          ctx.moveTo(hub.x, hub.y);
          ctx.lineTo(node.x, node.y);
          ctx.strokeStyle = g;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = 0.2;
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;
      ctx.restore();

      // Draw pulses
      pulses.forEach(pulse => {
        pulse.progress += pulse.speed * (dt / 16);
        if (pulse.progress >= 1) {
          pulse.progress = 0;
          pulse.sourceId = Math.random() > 0.4 ? 0 : Math.floor(Math.random() * nodes.length);
          let tid;
          do { tid = Math.floor(Math.random() * nodes.length); } while (tid === pulse.sourceId);
          pulse.targetId = tid;
          pulse.speed = 0.003 + Math.random() * 0.007;
        }

        const src = nodes[Math.min(pulse.sourceId, nodes.length - 1)];
        const tgt = nodes[Math.min(pulse.targetId, nodes.length - 1)];
        if (!src || !tgt) return;

        const px = src.x + (tgt.x - src.x) * pulse.progress;
        const py = src.y + (tgt.y - src.y) * pulse.progress;
        const gr = Math.max(0.1, 6);
        const grad = ctx.createRadialGradient(px, py, 0, px, py, gr);
        grad.addColorStop(0, 'rgba(255,255,255,0.95)');
        grad.addColorStop(0.5, 'rgba(150,210,255,0.5)');
        grad.addColorStop(1, 'rgba(0,200,255,0)');
        ctx.beginPath();
        ctx.arc(px, py, gr, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      });

      // Draw nodes
      nodes.forEach(node => {
        const isHovered = mouseRef.current.x !== -9999 &&
          Math.hypot(mouseRef.current.x - node.x, mouseRef.current.y - node.y) < node.radius + 10;

        // Glow
        const glowR = Math.max(0.1, node.radius * (isHovered ? 5 : 3.5));
        const glowInner = Math.max(0.1, node.radius * 0.5);
        const glowGrad = ctx.createRadialGradient(node.x, node.y, glowInner, node.x, node.y, glowR);
        glowGrad.addColorStop(0, getSentimentColor(node, isHovered ? 0.45 : 0.25));
        glowGrad.addColorStop(1, getSentimentColor(node, 0));
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Pulse ring for high-sentiment nodes
        if (node.sentiment !== 'neutral' && node.sentimentValue > 0.75) {
          const ringR = node.radius * 2.2 + Math.sin(ts * 0.003 + node.pulseOffset) * 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = getSentimentColor(node, 0.3);
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Node body
        const nodeR = Math.max(0.1, node.radius);
        const bodyGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, nodeR);
        bodyGrad.addColorStop(0, getSentimentColor(node, 1));
        bodyGrad.addColorStop(1, getSentimentColor(node, 0.5));
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = bodyGrad;
        ctx.fill();

        // Hub ring
        if (node.id === 0) {
          const ringSize = 20 + Math.sin(ts * 0.0015) * 3;
          ctx.beginPath();
          ctx.arc(node.x, node.y, ringSize, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0, 220, 255, 0.3)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(node.x, node.y, ringSize + 8, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0, 220, 255, 0.1)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Hover highlight ring
        if (isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 5, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255,255,255,0.6)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [buildNodes]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    mouseRef.current = { x: mx, y: my };

    const nodes = nodesRef.current;
    const hit = nodes.find(n => Math.hypot(mx - n.x, my - n.y) < n.radius + 10);
    if (hit) {
      setTooltip({ visible: true, x: e.clientX, y: e.clientY, node: hit });
    } else {
      setTooltip(t => ({ ...t, visible: false }));
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
    setTooltip(t => ({ ...t, visible: false }));
  }, []);

  const positiveCount = nodesRef.current.filter(n => n.sentiment === 'positive').length;
  const neutralCount = nodesRef.current.filter(n => n.sentiment === 'neutral').length;
  const negativeCount = nodesRef.current.filter(n => n.sentiment === 'negative').length;
  const total = nodesRef.current.length || 1;

  return (
    <div className="relative w-full h-full bg-[#050818]" ref={containerRef}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: tooltip.visible ? 'crosshair' : 'default' }}
      />

      {/* Left Panel — Network Sentiment */}
      <div className="absolute top-6 left-6 z-20 w-52">
        <div
          className="rounded-xl border border-white/10 p-4 text-sm"
          style={{
            background: 'rgba(8, 14, 40, 0.75)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 30px rgba(0,180,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/80 font-semibold tracking-wide text-xs uppercase">Network Sentiment</span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-white/60 text-xs">Positive</span>
              </div>
              <span className="text-emerald-400 font-mono text-xs font-semibold">
                {Math.round((positiveCount / total) * 100)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <span className="text-white/60 text-xs">Neutral</span>
              </div>
              <span className="text-sky-400 font-mono text-xs font-semibold">
                {Math.round((neutralCount / total) * 100)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-white/60 text-xs">Congestion</span>
              </div>
              <span className="text-rose-400 font-mono text-xs font-semibold">
                {Math.round((negativeCount / total) * 100)}%
              </span>
            </div>
          </div>

          <div className="border-t border-white/8 pt-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-white/40 text-xs">Active Nodes</span>
              <span className="text-white/90 font-mono text-xs">{activeNodes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40 text-xs">TPS</span>
              <span className="text-cyan-400 font-mono text-xs">{tps.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40 text-xs">Sentiment Index</span>
              <span className="text-violet-400 font-mono text-xs">{sentimentIndex}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-right analytics card */}
      <div className="absolute bottom-6 right-6 z-20">
        <div
          className="rounded-xl border border-white/10 p-4 text-sm min-w-[200px]"
          style={{
            background: 'rgba(8, 14, 40, 0.75)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 30px rgba(130,80,240,0.1), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Live Analytics</p>
          <div className="space-y-3">
            <div>
              <p className="text-white/40 text-xs mb-0.5">Transactions / sec</p>
              <p className="text-cyan-400 font-mono text-lg font-bold tabular-nums">{tps.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-0.5">Total Blocks</p>
              <p className="text-violet-400 font-mono text-base font-bold tabular-nums">{totalBlocks.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-0.5">Avg Gas Fee</p>
              <p className="text-emerald-400 font-mono text-base font-bold">$0.000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live badge */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10"
        style={{
          background: 'rgba(8, 14, 40, 0.7)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-white/70 text-xs font-medium">LIVE</span>
        <span className="text-white/30 text-xs font-mono">{liveTime.toLocaleTimeString()}</span>
      </div>

      {/* Hover tooltip */}
      {tooltip.visible && tooltip.node && (
        <div
          className="fixed z-50 pointer-events-none rounded-lg border border-white/15 p-3 text-xs min-w-[170px]"
          style={{
            left: tooltip.x + 16,
            top: tooltip.y - 10,
            background: 'rgba(6, 12, 32, 0.92)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <p className="text-white/40 uppercase tracking-wider text-[10px] mb-2">Node Info</p>
          <div className="space-y-1.5">
            <div className="flex justify-between gap-4">
              <span className="text-white/50">Wallet</span>
              <span className="text-cyan-400 font-mono">{tooltip.node.walletId}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-white/50">Transactions</span>
              <span className="text-white/90 font-mono">{tooltip.node.txCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-white/50">Status</span>
              <span className={
                tooltip.node.sentiment === 'positive' ? 'text-emerald-400' :
                tooltip.node.sentiment === 'negative' ? 'text-rose-400' : 'text-sky-400'
              }>{tooltip.node.status}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-white/50">Sentiment</span>
              <span className="text-white/80 capitalize">{tooltip.node.sentiment}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
