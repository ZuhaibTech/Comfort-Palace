"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Collection', href: '/collection' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' }
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      <header className="w-full h-[12dvh] glass-light fixed top-0 left-0 z-50 flex items-center justify-between px-fluid-md lg:px-fluid-lg transition-all duration-500 border-b border-surface-200/40">
        {/* Branding: Left Aligned */}
        <Link href="/" className="flex items-center gap-fluid-3xs group">
          <div className="relative h-14 w-56 lg:h-20 lg:w-80 flex items-center transition-transform duration-500 group-hover:scale-105">
            <Image 
              src="/Logo/LOGO main.png" 
              alt="Comfort Palace" 
              fill 
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Navigation: Right Aligned */}
        <div className="flex items-center gap-fluid-md lg:gap-fluid-lg">
          <nav className="hidden md:flex items-center gap-fluid-xs">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.25em] text-surface-900 hover:text-primary-800 px-fluid-3xs py-2 transition-all duration-300 relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-fluid-3xs w-0 h-[2px] bg-primary-800 transition-all duration-500 group-hover:w-[calc(100%-1rem)]"></span>
              </Link>
            ))}
          </nav>

          {/* Hamburger Menu Toggle */}
          <button 
            onClick={() => setIsOpen(true)}
            className="md:hidden flex flex-col gap-1.5 w-8 items-end group"
            aria-label="Open Menu"
          >
            <span className="w-full h-px bg-surface-900 transition-all group-hover:w-full"></span>
            <span className="w-2/3 h-px bg-surface-900 transition-all group-hover:w-full"></span>
            <span className="w-1/3 h-px bg-surface-900 transition-all group-hover:w-full"></span>
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-[100] transition-all duration-700 ${isOpen ? 'visible' : 'invisible'}`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-surface-900/40 backdrop-blur-md transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Sidebar Panel */}
        <div 
          className={`absolute top-0 right-0 h-full w-[85%] max-w-[400px] bg-white shadow-2xl transition-transform duration-700 ease-apex-expo p-10 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Header in Sidebar */}
          <div className="flex items-center justify-between mb-20">
             <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-surface-400">Navigation</div>
             <button 
               onClick={() => setIsOpen(false)}
               className="w-10 h-10 flex items-center justify-center rounded-full border border-surface-100 text-surface-900 hover:bg-surface-50 transition-colors"
               aria-label="Close Menu"
             >
               <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                 <path d="M1 1L17 17M17 1L1 17" strokeLinecap="round"/>
               </svg>
             </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-8">
            {navItems.map((item, i) => (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`text-4xl font-display font-light text-surface-900 hover:text-primary-800 transition-all duration-500 delay-[${i * 100}ms] ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Footer in Sidebar */}
          <div className="mt-auto pt-10 border-t border-surface-100">
             <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-800 mb-4">Contact Studio</div>
             <p className="text-surface-500 text-sm leading-relaxed mb-8">
               Inquiries: studio@comfortpalace.com <br/>
               Support: +44 20 7946 0958
             </p>
             <div className="flex gap-5 items-center">
               {[
                 { 
                   name: 'Instagram', 
                   href: 'https://instagram.com', 
                   icon: (
                     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                       <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                       <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                       <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                     </svg>
                   )
                 },
                 { 
                   name: 'Twitter', 
                   href: 'https://twitter.com', 
                   icon: (
                     <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                       <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                     </svg>
                   )
                 },
                 { 
                   name: 'Facebook', 
                   href: 'https://facebook.com', 
                   icon: (
                     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                       <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                     </svg>
                   )
                 }
               ].map((s) => (
                 <Link key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="text-surface-500 hover:text-primary-800 transition-colors duration-300" aria-label={s.name}>
                   {s.icon}
                 </Link>
               ))}
             </div>
          </div>
        </div>
      </div>
    </>
  );
}
