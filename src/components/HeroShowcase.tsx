"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

const showcaseItems = [
  {
    id: 1,
    mainImage: "/images/Hero-Sofa-main.jpeg",
    secondaryImage: "/images/Hero-Sofa-Detail.jpeg",
    name: "Sofa",
    category: "Living Room",
    price: "$3,200",
    highlights: "Premium Leather • Ergonomic"
  },
  {
    id: 2,
    mainImage: "/images/Hero-Bed-main.jpeg",
    secondaryImage: "/images/Hero-Bed-Detail.jpeg",
    name: "Bed",
    category: "Bedroom",
    price: "$2,850",
    highlights: "Solid Oak • Minimalist"
  },
  {
    id: 3,
    mainImage: "/images/Hero-CenterTable-main.jpeg",
    secondaryImage: "/images/Hero-CenterTable-Detail.jpeg",
    name: "Center Table",
    category: "Tables",
    price: "$1,450",
    highlights: "Premium Wood • Elegant"
  },
  {
    id: 4,
    mainImage: "/images/Hero-Console-main.jpeg",
    secondaryImage: "/images/Hero-Console-Detail.jpeg",
    name: "Console",
    category: "Entryway",
    price: "$1,150",
    highlights: "Brass Accents • Modern"
  }
];

export default function HeroShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcaseItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full lg:w-7/12 relative h-[60dvh] lg:h-[80dvh] mt-10 lg:mt-0 flex items-end justify-end group z-10">
      
      {/* Main Large Image */}
      <div className="relative w-full lg:w-[90%] h-full rounded-tl-[8rem] lg:rounded-tl-[16rem] rounded-bl-2xl rounded-tr-2xl rounded-br-2xl overflow-hidden shadow-2xl bg-surface-200">
        {showcaseItems.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <div 
              key={item.id} 
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <Image 
                src={item.mainImage} 
                alt={item.name} 
                fill 
                sizes="(max-width: 1024px) 100vw, 60vw"
                className={`object-cover transition-transform duration-[7s] ease-out ${isActive ? 'scale-105' : 'scale-100'}`}
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-900/40 via-transparent to-transparent"></div>
            </div>
          );
        })}
      </div>

      {/* Floating Secondary Image (The Editorial Touch) / Card */}
      <div className="absolute left-0 bottom-[10%] w-[45%] lg:w-[40%] aspect-[3/4] rounded-tr-[5rem] rounded-bl-2xl rounded-br-2xl rounded-tl-2xl overflow-hidden shadow-2xl border-4 border-surface-50 dark:border-surface-200 z-20 hidden md:block bg-surface-50 dark:bg-surface-100 group-hover:-translate-y-2 transition-transform duration-[1.5s] ease-out">
        {showcaseItems.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <div 
              key={`secondary-${item.id}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex flex-col ${isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
            >
              <div className="relative w-full flex-1">
                <Image 
                  src={item.secondaryImage} 
                  alt={`${item.name} Detail`} 
                  fill 
                  sizes="(max-width: 768px) 0vw, (max-width: 1024px) 45vw, 30vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
              <div className="bg-surface-50 dark:bg-surface-100 p-5 flex flex-col justify-center border-t border-surface-100 dark:border-surface-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-10 relative">
                <h3 className="text-surface-900 font-display text-xl tracking-tight truncate">{item.name}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Accent Badge */}
      <div className="absolute top-[10%] lg:top-[5%] right-5 lg:right-10 w-28 h-28 lg:w-32 lg:h-32 bg-surface-50 rounded-full flex flex-col items-center justify-center shadow-xl z-30">
        <svg viewBox="0 0 100 100" className="w-full h-full text-surface-900 animate-[spin_20s_linear_infinite]">
          <path id="curve" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent"/>
          <text style={{fontSize: '7px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase'}} fill="currentColor">
            <textPath href="#curve" startOffset="0%">• COMFORT PALACE </textPath>
            <textPath href="#curve" startOffset="50%">• COMFORT PALACE </textPath>
          </text>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center p-6">
           <div className="relative w-full h-full">
             <Image 
               src="/Logo/Logo.svg" 
               alt="Logo Icon" 
               fill 
               className="object-contain dark:invert"
             />
           </div>
        </div>
      </div>
      
      {/* Interactive Dot Indicators */}
      <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 flex gap-3 z-30">
        {showcaseItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`transition-all duration-500 rounded-full ${
              index === activeIndex 
                ? 'w-8 h-2 bg-surface-50' 
                : 'w-2 h-2 bg-surface-50/50 hover:bg-surface-50/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
