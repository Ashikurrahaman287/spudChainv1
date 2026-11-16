import React, { useEffect, useState, useRef } from 'react';
import { formatNumber } from '@/lib/utils';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function AnimatedCounter({
  end,
  duration = 2,
  prefix = '',
  suffix = '',
  className = ''
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);
  const requestRef = useRef<number | null>(null);
  const previousEndRef = useRef(end);

  // Animation function
  const animate = (timestamp: number) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp;
      startValueRef.current = displayValue;
    }

    const elapsedTime = timestamp - startTimeRef.current;
    const progress = Math.min(elapsedTime / (duration * 1000), 1);
    
    // Apply easing - easeOutQuad
    const easedProgress = 1 - (1 - progress) * (1 - progress);
    
    const currentValue = startValueRef.current + (end - startValueRef.current) * easedProgress;
    setDisplayValue(Math.floor(currentValue));

    if (progress < 1) {
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    // Only restart animation if the end value changes significantly
    if (Math.abs(end - previousEndRef.current) > (end * 0.001)) {
      startTimeRef.current = null;
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      requestRef.current = requestAnimationFrame(animate);
      previousEndRef.current = end;
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [end]);

  return (
    <span className={className}>
      {prefix}{formatNumber(displayValue)}{suffix}
    </span>
  );
}