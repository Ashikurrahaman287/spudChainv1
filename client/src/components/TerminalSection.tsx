import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import BlockAnimation from '@/components/BlockAnimation';
import NetworkGraph from '@/components/NetworkGraph';

interface TerminalProps {
  title: string;
  commands: string[];
  delay?: number;
  bgColor?: string;
  textColor?: string;
  showAnimation?: boolean;
}

function Terminal({ 
  title, 
  commands, 
  delay = 100, 
  bgColor = "bg-[#101318]", 
  textColor = "text-[#00FF85]",
  showAnimation = false
}: TerminalProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [currentChar, setCurrentChar] = useState(0);
  const [currentTypingText, setCurrentTypingText] = useState('');
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (!inView) return;
    
    if (currentLine < commands.length) {
      if (!isTyping) {
        // Start typing a new line
        setIsTyping(true);
        setCurrentChar(0);
        setCurrentTypingText('');
      } else {
        // Continue typing the current line
        const targetText = commands[currentLine];
        
        if (currentChar < targetText.length) {
          // Type next character
          const timeout = setTimeout(() => {
            setCurrentTypingText(prev => prev + targetText[currentChar]);
            setCurrentChar(prev => prev + 1);
          }, 30 + Math.random() * 50); // Randomized typing speed for realism
          
          return () => clearTimeout(timeout);
        } else {
          // Finished typing line
          const timeout = setTimeout(() => {
            setDisplayedLines(prev => [...prev, currentTypingText]);
            setIsTyping(false);
            setCurrentLine(prev => prev + 1);
          }, 300); // Pause before next line
          
          return () => clearTimeout(timeout);
        }
      }
    }
  }, [currentLine, currentChar, commands, isTyping, inView, currentTypingText]);

  return (
    <motion.div 
      ref={ref}
      className={`${bgColor} rounded-xl border border-gray-800 relative overflow-hidden h-[220px]`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Block Animation (only shown for blockchain terminal) */}
      {showAnimation && (
        <div className="absolute inset-0 z-0 opacity-80">
          <BlockAnimation />
        </div>
      )}
      
      {/* Background Grid for AI Terminal */}
      {!showAnimation && (
        <div className="absolute inset-0 z-0 opacity-10">
          {/* AI network nodes */}
          <div className="grid grid-cols-6 gap-6 p-4 h-full">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="flex items-center justify-center">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-purple-500"
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ 
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              </div>
            ))}
          </div>
          
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full">
            {[...Array(15)].map((_, i) => {
              const x1 = Math.random() * 100;
              const y1 = Math.random() * 100;
              const x2 = Math.random() * 100;
              const y2 = Math.random() * 100;
              
              return (
                <motion.line
                  key={i}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke={Math.random() > 0.5 ? "#00F0FF" : "#9B51E0"}
                  strokeWidth="0.5"
                  strokeOpacity="0.2"
                  initial={{ strokeDasharray: "5,50", strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: -55 }}
                  transition={{ 
                    duration: 10 + Math.random() * 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              );
            })}
          </svg>
        </div>
      )}
      
      {/* Terminal Header */}
      <div className="p-3 border-b border-gray-800 flex items-center bg-[#0A0A0A]/80 backdrop-blur z-10 relative">
        <div className="w-3 h-3 rounded-full bg-[#00FF85] animate-pulse mr-2"></div>
        <div className="text-base font-medium text-white">{title}</div>
      </div>
      
      {/* Terminal Content */}
      <div className="relative z-10 p-3 h-[170px] font-mono text-sm">
        {displayedLines.map((line, index) => (
          <div key={index} className={`${textColor} mb-1`}>
            {line}
          </div>
        ))}
        
        {isTyping && (
          <div className={textColor}>
            {currentTypingText}
            <span className="cursor-blink ml-0.5">_</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Simulated transaction data
const generateRandomTx = () => {
  const types = ["Transfer", "Stake", "Deploy", "Smart Contract", "Prediction"];
  const amounts = ["2.45", "10.32", "0.05", "354.1", "29.8", "1,240", "0.0021"];
  const addresses = [
    "0x7F4..e29B",
    "0x36D..a12C",
    "0x91A..f56D",
    "0x2B8..c77F",
    "0xC3D..9e5A"
  ];
  
  return {
    id: Math.random().toString(36).substring(2, 9),
    type: types[Math.floor(Math.random() * types.length)],
    amount: amounts[Math.floor(Math.random() * amounts.length)],
    from: addresses[Math.floor(Math.random() * addresses.length)],
    to: addresses[Math.floor(Math.random() * addresses.length)],
    timestamp: new Date().getTime()
  };
};

// Network Activity Component
function NetworkActivity() {
  const [transactions, setTransactions] = useState(() => {
    // Initialize with 10 random transactions
    return Array(10).fill(0).map(() => generateRandomTx());
  });
  
  // Add new transactions periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTransactions(prev => {
        const newTx = generateRandomTx();
        return [newTx, ...prev.slice(0, 9)]; // Keep only last 10
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <motion.div
      className="bg-[#101318] rounded-xl border border-gray-800 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      viewport={{ once: true }}
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-800 flex justify-between items-center">
        <div className="text-base font-medium text-white">Network Activity</div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-[#00FF85] animate-pulse mr-1"></div>
          <span className="text-xs text-[#00FF85]">Live</span>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-2 gap-2 p-2">
        <div className="bg-black rounded p-2">
          <div className="text-xs text-gray-400 mb-1">Current TPS</div>
          <div className="text-xl font-mono font-bold text-white">1,246,891</div>
        </div>
        <div className="bg-black rounded p-2">
          <div className="text-xs text-gray-400 mb-1">Block Time</div>
          <div className="text-xl font-mono font-bold text-white">0.48s</div>
        </div>
      </div>
      
      {/* Transaction List */}
      <div className="p-2">
        <div className="bg-black rounded h-64 overflow-hidden relative">
          {/* Simple network visualization in background */}
          <div className="absolute inset-0 opacity-30">
            <div className="relative h-full w-full flex items-center justify-center">
              {/* Central node */}
              <div className="absolute w-4 h-4 rounded-full bg-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.7)] z-20"></div>
              
              {/* Surrounding nodes with connections */}
              {[...Array(10)].map((_, i) => {
                const angle = (i / 10) * Math.PI * 2;
                const distance = 70 + Math.random() * 30;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                return (
                  <div key={i} className="absolute">
                    {/* Node */}
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(155,81,224,0.7)]"
                      style={{ 
                        left: `calc(50% + ${x}px)`, 
                        top: `calc(50% + ${y}px)`,
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.3,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    />
                    
                    {/* Connection line */}
                    <div 
                      className="absolute h-[1px] bg-gradient-to-r from-[#9B51E0] to-[#00F0FF] z-0 origin-left"
                      style={{
                        left: "50%",
                        top: "50%",
                        width: `${distance}px`,
                        transform: `rotate(${angle}rad)`,
                      }}
                    >
                      {/* Animated pulse along the line */}
                      <motion.div 
                        className="absolute top-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white"
                        animate={{
                          left: ['0%', '100%'],
                        }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.15,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Transactions list */}
          <div className="relative z-10 h-full overflow-y-auto p-2 space-y-2 scrollbar-hide">
            {transactions.map((tx, index) => (
              <motion.div 
                key={tx.id}
                className="flex items-center text-xs border-b border-gray-800 pb-2 last:border-0 last:pb-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-2 h-2 rounded-full mr-2" 
                  style={{ 
                    backgroundColor: tx.type.includes("Smart") ? "#00F0FF" : 
                                    tx.type.includes("Prediction") ? "#9B51E0" : 
                                    "#2D9CDB" 
                  }}
                />
                
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between">
                    <span className="text-white">{tx.type}</span>
                    <span className="font-mono text-[#00FF85]">{tx.amount} SPUD</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-[10px]">
                    <span>{tx.from} → {tx.to}</span>
                    <span>{new Date(tx.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                  </div>
                </div>
                
                {/* Pulse effect for new transactions */}
                {index === 0 && (
                  <motion.div
                    className="absolute -inset-px rounded"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    style={{ 
                      background: tx.type.includes("Smart") ? "radial-gradient(circle, rgba(0,240,255,0.1) 0%, rgba(0,0,0,0) 70%)" : 
                               tx.type.includes("Prediction") ? "radial-gradient(circle, rgba(155,81,224,0.1) 0%, rgba(0,0,0,0) 70%)" : 
                               "radial-gradient(circle, rgba(45,156,219,0.1) 0%, rgba(0,0,0,0) 70%)"
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer Stats */}
      <div className="p-3 border-t border-gray-800 flex justify-between items-center text-xs text-gray-400">
        <div>Active Validators: <span className="text-white font-medium">3,927</span></div>
        <div>Total Transactions: <span className="text-white font-medium">18,642,973</span></div>
      </div>
    </motion.div>
  );
}

export default function TerminalSection() {
  const [blockCount, setBlockCount] = useState(27631);
  const [aiPredictions, setAiPredictions] = useState(5243);
  
  // Increment block count and AI predictions over time
  useEffect(() => {
    const blockInterval = setInterval(() => {
      setBlockCount(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 2000);
    
    const aiInterval = setInterval(() => {
      setAiPredictions(prev => prev + Math.floor(Math.random() * 10) + 1);
    }, 5000);
    
    return () => {
      clearInterval(blockInterval);
      clearInterval(aiInterval);
    };
  }, []);
  
  const blockchainCommands = [
    "$ Initializing blockchain connection...",
    "$ Connected to network: SpudBlocks-Main",
    `$ Syncing block data: ${blockCount.toLocaleString()} blocks...`
  ];
  
  const aiCommands = [
    "$ Loading AI model: SpudPredictorV3",
    "$ Integrating with blockchain data...",
    `$ Analysis: ${aiPredictions.toLocaleString()} market predictions generated`
  ];

  return (
    <section className="py-16 md:py-24 relative px-4 bg-black">
      <div className="container mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 
            className="text-3xl md:text-5xl font-bold mb-4 text-[#4C83FB]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Technology in Action
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            See how SpudChain's blockchain and AI technologies work together in real-time, providing unparalleled performance and insights.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Terminal 
            title="Blockchain Active" 
            commands={blockchainCommands}
            showAnimation={true}
          />
          <Terminal 
            title="AI Integration Online" 
            commands={aiCommands}
            textColor="text-[#00F0FF]"
          />
        </div>
        
        <div className="mb-8">
          <NetworkActivity />
        </div>
        
        <div className="text-center">
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            viewport={{ once: true }}
          >
            SpudChain's AI analysis processes over 1 million data points per second to optimize transaction routing and security,
            ensuring maximum efficiency across the entire blockchain network.
          </motion.p>
        </div>
      </div>
      
      {/* Floating glows */}
      <div className="absolute top-1/3 right-10 w-32 h-32 bg-[#2D9CDB]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 left-10 w-40 h-40 bg-[#9B51E0]/10 rounded-full blur-3xl"></div>
    </section>
  );
}