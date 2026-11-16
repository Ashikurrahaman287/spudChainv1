import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Block {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  connection?: number;
}

export default function BlockAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [connections, setConnections] = useState<{from: number, to: number, progress: number}[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    
    // Initial dimensions
    updateDimensions();
    
    // Update dimensions on resize
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    
    // Create blocks
    const blockCount = Math.min(8, Math.max(5, Math.floor(dimensions.width / 200)));
    const newBlocks: Block[] = [];
    
    // Colors for the gradient
    const colors = [
      'rgba(5, 150, 255, 0.7)', // Blue
      'rgba(147, 51, 234, 0.7)', // Purple
      'rgba(59, 130, 246, 0.7)', // Blue
      'rgba(16, 185, 129, 0.7)', // Emerald
      'rgba(139, 92, 246, 0.7)', // Violet
      'rgba(99, 102, 241, 0.7)', // Indigo
      'rgba(14, 165, 233, 0.7)', // Sky
      'rgba(79, 70, 229, 0.7)', // Indigo
    ];
    
    for (let i = 0; i < blockCount; i++) {
      newBlocks.push({
        id: i,
        x: (dimensions.width / (blockCount + 1)) * (i + 1),
        y: dimensions.height / 2 + (Math.random() * 80 - 40),
        size: Math.random() * 20 + 60,
        color: colors[i % colors.length],
        delay: i * 0.2,
      });
    }
    
    setBlocks(newBlocks);
    
    // Create connections
    const newConnections: {from: number, to: number, progress: number}[] = [];
    
    for (let i = 0; i < newBlocks.length - 1; i++) {
      newConnections.push({
        from: i,
        to: i + 1,
        progress: 0
      });
    }
    
    // Add a few cross connections for a more network-like appearance
    if (newBlocks.length > 3) {
      // Add some cross connections
      newConnections.push({
        from: 0,
        to: Math.min(newBlocks.length - 1, 3),
        progress: 0
      });
      
      if (newBlocks.length > 5) {
        newConnections.push({
          from: 2,
          to: Math.min(newBlocks.length - 1, 5),
          progress: 0
        });
      }
    }
    
    setConnections(newConnections);
    
    // Start the animation
    const animate = (timestamp: number) => {
      // Update connection progress
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;
      
      setConnections(prev => {
        return prev.map(connection => {
          // Move progress at different speeds
          const speed = 0.3 + (Math.random() * 0.2);
          let newProgress = connection.progress + speed * deltaTime;
          
          // Reset the progress when it reaches 1
          if (newProgress >= 1) {
            newProgress = 0;
          }
          
          return {
            ...connection,
            progress: newProgress
          };
        });
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg className="w-full h-full absolute top-0 left-0">
        {/* Connection lines */}
        {connections.map((connection, idx) => {
          const fromBlock = blocks[connection.from];
          const toBlock = blocks[connection.to];
          
          if (!fromBlock || !toBlock) return null;
          
          return (
            <g key={`connection-${idx}`}>
              {/* Connection line */}
              <line
                x1={fromBlock.x}
                y1={fromBlock.y}
                x2={toBlock.x}
                y2={toBlock.y}
                stroke="rgba(99, 102, 241, 0.3)"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
              
              {/* Moving white dot along connection */}
              <circle
                cx={fromBlock.x + (toBlock.x - fromBlock.x) * connection.progress}
                cy={fromBlock.y + (toBlock.y - fromBlock.y) * connection.progress}
                r={4}
                fill="white"
                filter="drop-shadow(0 0 5px #fff)"
              >
                <animate
                  attributeName="opacity"
                  values="0.3;1;0.3"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}
      </svg>
      
      {/* Blocks */}
      {blocks.map((block) => (
        <motion.div
          key={`block-${block.id}`}
          className="absolute rounded-lg border border-white/20 backdrop-blur-sm overflow-hidden"
          style={{
            left: block.x - block.size / 2,
            top: block.y - block.size / 2,
            width: block.size,
            height: block.size,
            background: `linear-gradient(135deg, ${block.color}, rgba(30, 30, 30, 0.8))`,
            boxShadow: `0 0 20px ${block.color.replace('0.7', '0.3')}`,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -5, 0, 5, 0],
          }}
          transition={{
            scale: { duration: 0.5, delay: block.delay },
            opacity: { duration: 0.5, delay: block.delay },
            y: { 
              repeat: Infinity, 
              duration: 5 + block.id, 
              ease: "easeInOut",
              delay: block.delay,
            }
          }}
        >
          {/* Block header with ID */}
          <div className="w-full py-1 px-2 text-xs text-white/80 font-mono bg-black/30 flex justify-between items-center">
            <span>Block #{block.id + 1000}</span>
            <span className="text-green-400 text-[10px]">Confirmed</span>
          </div>
          
          {/* Block content */}
          <div className="p-2 text-[8px] sm:text-xs font-mono text-white/60 h-full flex flex-col">
            <div className="flex items-center mb-1">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
              <span>Hash: 0x{(Math.random().toString(16) + '0000000').substring(2, 10)}</span>
            </div>
            <div className="h-[1px] w-full bg-white/10 my-1"></div>
            <div className="flex-1 opacity-50">
              <div>Tx: {Math.floor(Math.random() * 100) + 50}</div>
              <div>Size: {Math.floor(Math.random() * 900) + 100}kb</div>
              <div>Time: {(Math.random() * 0.5 + 0.1).toFixed(2)}s</div>
            </div>
          </div>
          
          {/* Glowing effect on block to simulate activity */}
          <motion.div 
            className="absolute inset-0 bg-white/5 pointer-events-none"
            animate={{ opacity: [0, 0.2, 0] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: block.id * 0.3,
            }}
          />
        </motion.div>
      ))}
      
      {/* Description */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-sm">
        <p>White circles represent transactions flowing through the SpudChain network</p>
      </div>
    </div>
  );
}