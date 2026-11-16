import { useEffect, useRef } from 'react';
import { debounce } from '@/lib/utils';

export default function BlockchainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();

    // Handle resize
    const handleResize = debounce(() => {
      setCanvasDimensions();
    }, 100);

    window.addEventListener('resize', handleResize);

    // Blockchain node properties
    const nodes: {
      x: number;
      y: number;
      speedX: number;
      speedY: number;
      connections: number[];
    }[] = [];
    
    const nodeCount = 50;
    const nodeSize = 3;
    const connectionDistance = 150;

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        connections: []
      });
    }

    // Animation loop
    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update node positions
      nodes.forEach(node => {
        node.x += node.speedX;
        node.y += node.speedY;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.speedX *= -1;
        if (node.y < 0 || node.y > canvas.height) node.speedY *= -1;

        // Reset connections
        node.connections = [];
      });

      // Find connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            nodes[i].connections.push(j);
            nodes[j].connections.push(i);
          }
        }
      }

      // Draw connections
      ctx.strokeStyle = 'rgba(45, 156, 219, 0.15)';
      ctx.lineWidth = 1;

      nodes.forEach((node, i) => {
        node.connections.forEach(j => {
          // Only draw each connection once
          if (i < j) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);

        // Create gradient for the node
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, nodeSize);
        gradient.addColorStop(0, 'rgba(45, 156, 219, 0.8)');
        gradient.addColorStop(1, 'rgba(155, 81, 224, 0.3)');

        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 opacity-40"
      aria-hidden="true"
    />
  );
}
