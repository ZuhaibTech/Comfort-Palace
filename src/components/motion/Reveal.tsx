"use client";

import { useEffect, useRef, ReactNode, useCallback } from 'react';

interface RevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: string;
  cascade?: boolean;
  className?: string;
  once?: boolean;
  id?: string;
}

export default function Reveal({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.8, 
  distance = '50px',
  cascade = false,
  className = "",
  once = false,
  id
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  const getInitialTransform = useCallback(() => {
    switch (direction) {
      case 'up': return `translateY(${distance})`;
      case 'down': return `translateY(-${distance})`;
      case 'left': return `translateX(${distance})`;
      case 'right': return `translateX(-${distance})`;
      default: return 'none';
    }
  }, [direction, distance]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.style.opacity = '1';
            el.style.transform = 'translate(0, 0)';
            if (once) observer.unobserve(el);
          } else if (!once) {
            el.style.opacity = '0';
            el.style.transform = getInitialTransform();
          }
        });
      },
      { threshold: 0.15 }
    );

    if (ref.current) {
      const el = ref.current;
      
      // Initial styles
      el.style.opacity = '0';
      el.style.transition = `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`;
      el.style.transform = getInitialTransform();
      
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [getInitialTransform, delay, duration]);

  return (
    <div ref={ref} className={className} id={id}>
      {children}
    </div>
  );
}
