import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import { Zap, BarChart2, Users, Server, Layers, Activity } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface MetricItem {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  random?: boolean;
  steadyIncrement?: boolean;
  randomRange?: [number, number];
}

export default function MetricsBlock() {
  // Initialize metrics with starting values
  const [metrics, setMetrics] = useState<MetricItem[]>([
    {
      title: 'Transactions Per Second',
      value: 1348657,
      unit: 'TPS',
      icon: <Zap className="h-5 w-5" />,
      color: 'from-[#00F0FF] to-[#9B51E0]',
      random: true,
      randomRange: [950000, 1500000]
    },
    {
      title: 'Block Time',
      value: 0.48,
      unit: 's',
      icon: <BarChart2 className="h-5 w-5" />,
      color: 'from-[#00F0FF] to-[#9B51E0]'
    },
    {
      title: 'Total Transactions',
      value: 2477702,
      unit: '',
      icon: <Activity className="h-5 w-5" />,
      color: 'from-[#00F0FF] to-[#9B51E0]',
      steadyIncrement: true
    },
    {
      title: 'Active Validators',
      value: 3927,
      unit: '',
      icon: <Server className="h-5 w-5" />,
      color: 'from-[#00F0FF] to-[#9B51E0]',
      random: true,
      randomRange: [3920, 3950]
    },
    {
      title: 'Block Height',
      value: 27631,
      unit: '',
      icon: <Layers className="h-5 w-5" />,
      color: 'from-[#00F0FF] to-[#9B51E0]',
      steadyIncrement: true
    },
    {
      title: 'Network Users',
      value: 153928,
      unit: '',
      icon: <Users className="h-5 w-5" />,
      color: 'from-[#00F0FF] to-[#9B51E0]',
      random: true,
      randomRange: [153900, 154100]
    },
  ]);

  // Reference to track animation frames
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<{ [key: string]: number }>({});
  const steadyIncrementIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // For the TPS display element
  const tpsDisplayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure we have valid initial values - prevent null values
    setMetrics(prev => 
      prev.map(metric => {
        if (metric.random && metric.randomRange) {
          const [min, max] = metric.randomRange;
          // Set a guaranteed value that's not zero
          return { ...metric, value: Math.floor(Math.random() * (max - min + 1)) + min };
        }
        if (metric.title === 'Total Transactions' && metric.value === 0) {
          return { ...metric, value: 2477702 }; // Default value if somehow it got reset
        }
        return metric;
      })
    );

    // Start steady increment for "Total Transactions" counter (adds 1-5 per second)
    steadyIncrementIntervalRef.current = setInterval(() => {
      setMetrics(prev => 
        prev.map(metric => {
          if (metric.steadyIncrement) {
            // Faster increment for more impressive growth
            const increment = Math.floor(Math.random() * 5) + 1;
            return { ...metric, value: metric.value + increment };
          }
          return metric;
        })
      );
    }, 250); // Update 4 times per second

    // Function to update random metrics
    const updateRandomMetrics = (timestamp: number) => {
      setMetrics(prev => 
        prev.map(metric => {
          if (!metric.random || !metric.randomRange) return metric;
          
          // Only update each metric at different random intervals
          const key = metric.title;
          const lastUpdate = lastUpdateTimeRef.current[key] || 0;
          
          // Update TPS more frequently - rapidly changing
          const updateInterval = metric.title === 'Transactions Per Second' ? 300 : Math.random() * 5000 + 1000;
          
          if (timestamp - lastUpdate > updateInterval) {
            lastUpdateTimeRef.current[key] = timestamp;
            
            const [min, max] = metric.randomRange;
            // Ensure a more dramatic TPS change for better visual effect
            if (metric.title === 'Transactions Per Second') {
              // More dramatic fluctuations
              const previousValue = metric.value;
              const change = Math.floor(Math.random() * 300000) - 150000;
              const newValue = Math.max(min, Math.min(max, previousValue + change));
              return { ...metric, value: newValue };
            } else {
              // Normal random values for other metrics
              return { ...metric, value: Math.floor(Math.random() * (max - min + 1)) + min };
            }
          }
          
          return metric;
        })
      );
      
      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(updateRandomMetrics);
    };
    
    // Start the animation loop
    animationFrameRef.current = requestAnimationFrame(updateRandomMetrics);
    
    // Special effect for TPS numbers - random changing digits
    const tpsFlickerInterval = setInterval(() => {
      if (tpsDisplayRef.current) {
        const tpsValue = metrics.find(m => m.title === 'Transactions Per Second')?.value || 1250000;
        
        // Convert to string and create a span for each digit with random changes
        const tpsString = tpsValue.toString();
        let html = '';
        
        // Higher chance of flickering for more active appearance
        for (let i = 0; i < tpsString.length; i++) {
          const shouldFlicker = Math.random() < 0.4; // Increased probability
          if (shouldFlicker && i > tpsString.length - 5) { // More digits affected
            // Change the last few digits rapidly
            const randomDigit = Math.floor(Math.random() * 10);
            html += `<span class="inline-block">${randomDigit}</span>`;
          } else {
            html += `<span class="inline-block">${tpsString[i]}</span>`;
          }
        }
        
        tpsDisplayRef.current.innerHTML = html;
      }
    }, 80); // Faster updates for more flickering
    
    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (steadyIncrementIntervalRef.current) {
        clearInterval(steadyIncrementIntervalRef.current);
      }
      clearInterval(tpsFlickerInterval);
    };
  }, []);

  return (
    <div className="py-12 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-transparent opacity-60"></div>
      
      <div className="container mx-auto relative z-10">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#00F0FF] to-[#9B51E0] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          SpudChain Network Metrics
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="bg-[#0A0A0A]/80 backdrop-blur-sm rounded-lg border border-gray-800 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Animated header gradient */}
              <div className={`h-1 w-full bg-gradient-to-r ${metric.color}`}>
                <motion.div 
                  className="h-full bg-white/30"
                  animate={{ 
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                    {metric.icon}
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-white">{metric.title}</h3>
                </div>
                
                <div className="flex items-end">
                  {metric.title === 'Transactions Per Second' ? (
                    <div className="text-3xl font-bold font-mono text-white" ref={tpsDisplayRef}>
                      {formatNumber(metric.value)}
                    </div>
                  ) : metric.title === 'Block Time' ? (
                    <div className="text-3xl font-bold font-mono text-white">
                      {metric.value}
                    </div>
                  ) : (
                    <div className="text-3xl font-bold font-mono text-white">
                      <AnimatedCounter end={metric.value} duration={1} />
                    </div>
                  )}
                  <div className="ml-2 text-gray-400 mb-1">{metric.unit}</div>
                </div>
                
                {/* Pulse animation indicating live data */}
                <div className="flex items-center mt-4">
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-green-500"
                    animate={{ 
                      opacity: [1, 0.3, 1],
                      scale: [1, 0.8, 1]
                    }}
                    transition={{
                      duration: metric.random ? 0.8 : 2,
                      repeat: Infinity
                    }}
                  />
                  <span className="ml-2 text-xs text-gray-400">Live Data</span>
                  
                  {/* Extra flicker effect for TPS */}
                  {metric.title === 'Transactions Per Second' && (
                    <motion.div 
                      className="ml-auto w-2 h-2 rounded-full bg-blue-500"
                      animate={{ 
                        opacity: [1, 0.1, 1],
                        scale: [1, 0.6, 1]
                      }}
                      transition={{
                        duration: 0.3,
                        repeat: Infinity
                      }}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}