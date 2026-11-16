import React from 'react';
import { motion } from 'framer-motion';

interface Block {
  id: number;
  x: string;
  y: string;
  size: number;
  rotate: number;
  delay: number;
  color: string;
  pulseDelay: number;
}

export default function FloatingBlocks() {
  // Define floating blocks with their properties
  const blocks: Block[] = [
    { 
      id: 1, 
      x: '15%', 
      y: '20%', 
      size: 40, 
      rotate: 15, 
      delay: 0, 
      color: 'rgba(37, 99, 235, 0.2)', 
      pulseDelay: 0 
    },
    { 
      id: 2, 
      x: '25%', 
      y: '60%', 
      size: 25, 
      rotate: -10, 
      delay: 1.1, 
      color: 'rgba(139, 92, 246, 0.15)', 
      pulseDelay: 1.5 
    },
    { 
      id: 3, 
      x: '45%', 
      y: '15%', 
      size: 35, 
      rotate: 5, 
      delay: 0.7, 
      color: 'rgba(59, 130, 246, 0.2)', 
      pulseDelay: 3 
    },
    { 
      id: 4, 
      x: '65%', 
      y: '70%', 
      size: 28, 
      rotate: -5, 
      delay: 1.3, 
      color: 'rgba(16, 185, 129, 0.2)', 
      pulseDelay: 4.5 
    },
    { 
      id: 5, 
      x: '80%', 
      y: '35%', 
      size: 42, 
      rotate: 20, 
      delay: 0.5, 
      color: 'rgba(99, 102, 241, 0.15)', 
      pulseDelay: 2 
    },
    { 
      id: 6, 
      x: '90%', 
      y: '75%', 
      size: 30, 
      rotate: -15, 
      delay: 1.8, 
      color: 'rgba(236, 72, 153, 0.15)', 
      pulseDelay: 3.5 
    },
  ];
  
  // Animation variants for the floating motion
  const floatAnimation = {
    initial: { y: 0 },
    animate: (delay: number) => ({
      y: [0, -10, 0, 10, 0],
      transition: {
        delay,
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
  };
  
  // Animation variants for the pulse effect
  const pulseAnimation = {
    initial: { opacity: 0.5, scale: 1 },
    animate: (delay: number) => ({
      opacity: [0.5, 0.8, 0.5],
      scale: [1, 1.2, 1],
      transition: {
        delay,
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
  };
  
  // Animation variants for the rotation
  const rotateAnimation = {
    initial: { rotate: 0 },
    animate: (delay: number) => ({
      rotate: [0, 2, 0, -2, 0],
      transition: {
        delay,
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {blocks.map((block) => (
        <motion.div
          key={block.id}
          className="absolute rounded"
          style={{
            left: block.x,
            top: block.y,
            width: block.size,
            height: block.size,
            backgroundColor: block.color,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            rotate: `${block.rotate}deg`,
            zIndex: 1
          }}
          initial="initial"
          animate="animate"
          custom={block.delay}
          variants={floatAnimation}
        >
          {/* Inner block with pulse effect */}
          <motion.div
            className="absolute inset-2 rounded bg-black/30 border border-white/10"
            initial="initial"
            animate="animate"
            custom={block.pulseDelay}
            variants={pulseAnimation}
          >
            {/* Data lines on the block */}
            <div className="absolute top-1/3 left-1 right-1 h-[1px] bg-white/20"></div>
            <div className="absolute top-2/3 left-1 right-1 h-[1px] bg-white/15"></div>
            
            {/* Glowing dot */}
            <motion.div
              className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-cyan-400"
              animate={{
                opacity: [0.4, 1, 0.4],
                boxShadow: [
                  '0 0 2px rgba(34, 211, 238, 0.4)',
                  '0 0 4px rgba(34, 211, 238, 0.7)',
                  '0 0 2px rgba(34, 211, 238, 0.4)'
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}