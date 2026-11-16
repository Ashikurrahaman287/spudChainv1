import { motion, useAnimation } from "framer-motion";
import { Clock, BarChart2, Zap, Server, Cpu, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import NetworkGraph from "@/components/NetworkGraph";
import AnimatedCounter from "@/components/AnimatedCounter";
import { useState, useEffect } from "react";

// Generate a random blockchain hash
function generateRandomHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 24; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

// Component for displaying animated blockchain hashes
function HashAnimationDisplay() {
  const [hash, setHash] = useState(generateRandomHash());
  const controls = useAnimation();
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Trigger animation out
      controls.start({
        opacity: 0,
        y: -10,
        transition: { duration: 0.2 }
      }).then(() => {
        // Update hash value
        setHash(generateRandomHash());
        // Animate back in
        controls.start({
          opacity: 1,
          y: 0,
          transition: { duration: 0.2 }
        });
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [controls]);
  
  return (
    <div className="flex items-center gap-1">
      <div className="text-gray-400">Latest Block:</div>
      <motion.div 
        className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D9CDB] to-[#9B51E0]"
        animate={controls}
        initial={{ opacity: 1, y: 0 }}
      >
        {hash}
      </motion.div>
    </div>
  );
}

export default function LiveDataSection() {
  return (
    <section id="benefits" className="py-16 md:py-24 relative px-4 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#9B51E0]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#2D9CDB]/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#00F0FF] to-[#9B51E0] bg-clip-text text-transparent"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Live Data & Complete Transparency
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              SpudChain provides real-time insights into network performance, validator activity, and AI-driven optimizations. Monitor every aspect of the blockchain as it happens.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#2D9CDB]/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-[#2D9CDB]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Real-Time Monitoring
                  </h3>
                  <p className="text-gray-400">Track transactions, node performance, and network health in real-time.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#9B51E0]/20 flex items-center justify-center">
                  <BarChart2 className="h-5 w-5 text-[#9B51E0]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Performance Analytics
                  </h3>
                  <p className="text-gray-400">Advanced analytics showing network efficiency and optimization.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#00F0FF]/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-[#00F0FF]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    AI Optimization Insights
                  </h3>
                  <p className="text-gray-400">Visualize how AI improves transaction processing and security.</p>
                </div>
              </div>
            </div>
            
            <Button 
              className="mt-8 bg-gradient-to-r from-[#2D9CDB] to-[#9B51E0] hover:shadow-lg hover:shadow-[#9B51E0]/30 transition-all text-white"
              size="lg"
            >
              Explore Live Dashboard
            </Button>
          </motion.div>
          
          <motion.div 
            className="w-full lg:w-1/2 relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="w-full h-[400px] bg-[#111111] rounded-xl border border-gray-800 p-4 relative overflow-hidden backdrop-blur-md bg-[rgba(10,10,10,0.6)] border-[rgba(255,255,255,0.08)]">
              {/* Network Visualization */}
              <div className="absolute inset-0 bg-[#111111] opacity-80"></div>
              <div className="relative z-10 h-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Network Activity</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00FF85] animate-pulse"></div>
                    <span className="text-sm text-[#00FF85]">Live</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-black bg-opacity-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Current TPS</p>
                    <p className="text-xl font-mono font-bold text-white">
                      <AnimatedCounter end={1246891} />
                    </p>
                  </div>
                  <div className="bg-black bg-opacity-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Block Time</p>
                    <p className="text-xl font-mono font-bold text-white">0.48s</p>
                  </div>
                </div>
                
                <div className="bg-black bg-opacity-50 rounded-lg p-3 mb-4 h-[220px] relative">
                  {/* Network Graph Visualization */}
                  <NetworkGraph />
                </div>
                
                <div className="flex flex-col gap-2 text-sm text-gray-400">
                  <div className="flex justify-between items-center">
                    <div>Active Validators: <span className="text-white font-medium">
                      <AnimatedCounter end={3927} />
                    </span></div>
                    <div>Total Transactions: <span className="text-white font-medium">
                      <AnimatedCounter end={18642973} />
                    </span></div>
                  </div>
                  
                  {/* Latest blockchain hash display with animation */}
                  <motion.div 
                    className="bg-black/30 border border-gray-800 rounded px-2 py-1 text-xs font-mono overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <HashAnimationDisplay />
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Floating blockchain blocks */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#2D9CDB]/30 backdrop-blur-md rounded-lg border border-[#2D9CDB]/50 shadow-lg shadow-[#2D9CDB]/20 animate-[float_6s_ease-in-out_infinite]"></div>
            <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-[#9B51E0]/30 backdrop-blur-md rounded-lg border border-[#9B51E0]/50 shadow-lg shadow-[#9B51E0]/20 animate-[float_8s_ease-in-out_infinite]"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
