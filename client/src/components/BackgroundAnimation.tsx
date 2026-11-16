import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastTimeRef = useRef<number>(0);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 50; i++) {
        createParticle();
      }
    };

    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    function createParticle() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const colors = ['rgba(37, 99, 235, 0.3)', 'rgba(139, 92, 246, 0.3)', 'rgba(59, 130, 246, 0.3)', 'rgba(16, 185, 129, 0.3)'];
      
      const particle: Particle = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        life: 0,
        maxLife: Math.random() * 300 + 200
      };
      
      particlesRef.current.push(particle);
      return particle;
    }

    const animate = (timestamp: number) => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Calculate delta time for smoother animations
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      
      // Clear canvas with a fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      const connections: {from: Particle, to: Particle, alpha: number, progress: number}[] = [];
      
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx * deltaTime;
        particle.y += particle.vy * deltaTime;
        particle.life += 1;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Check for connections with other particles
        for (let i = index + 1; i < particlesRef.current.length; i++) {
          const otherParticle = particlesRef.current[i];
          const dx = otherParticle.x - particle.x;
          const dy = otherParticle.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const alpha = 1 - distance / 150;
            connections.push({
              from: particle,
              to: otherParticle,
              alpha,
              progress: Math.random()
            });
          }
        }
        
        // Regenerate particles when they "die"
        if (particle.life >= particle.maxLife) {
          particlesRef.current[index] = createParticle() as Particle;
        }
      });
      
      // Draw connections
      connections.forEach(connection => {
        ctx.beginPath();
        ctx.moveTo(connection.from.x, connection.from.y);
        ctx.lineTo(connection.to.x, connection.to.y);
        ctx.strokeStyle = `rgba(99, 102, 241, ${connection.alpha * 0.2})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Occasionally draw a pulse along a connection
        if (Math.random() < 0.01) {
          const x = connection.from.x + (connection.to.x - connection.from.x) * connection.progress;
          const y = connection.from.y + (connection.to.y - connection.from.y) * connection.progress;
          
          // Draw pulse
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fill();
          
          // Add glow effect
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(x, y, 2, x, y, 6);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });
      
      // Request next frame
      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initParticles();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 bg-transparent pointer-events-none w-full h-full"
    />
  );
}