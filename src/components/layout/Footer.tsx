// src/components/layout/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-100 border-t border-surface-200/60 pt-fluid-2xl pb-fluid-md px-fluid-md lg:px-fluid-lg">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-fluid-lg mb-fluid-xl">
          {/* Brand Identity */}
          <div className="md:col-span-5 flex flex-col items-start gap-fluid-xs">
            <Link href="/" className="flex items-center gap-fluid-3xs group">
              <div className="relative h-12 w-48 lg:h-16 lg:w-56 flex items-center transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100 mix-blend-multiply">
                <Image 
                  src="/Logo/LOGO main.png" 
                  alt="Comfort Palace" 
                  fill 
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-fluid-sm text-surface-500 max-w-sm leading-relaxed text-balance">
              Redefining contemporary living through mathematical precision and artisanal craftsmanship. Our furniture is designed to exist as timeless technical art.
            </p>
            <div className="flex gap-fluid-3xs mt-fluid-3xs">
              {['ig', 'tw', 'fb', 'yt'].map((s) => (
                <Link key={s} href={`#${s}`} className="w-9 h-9 rounded-full border border-surface-200 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-surface-400 hover:text-surface-900 hover:border-surface-900 transition-all duration-300">
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="md:col-span-2 md:col-start-7 flex flex-col gap-fluid-xs">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-surface-900 border-b border-surface-200 pb-2">Studio</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/about" className="text-fluid-sm text-surface-500 hover:text-primary-800 transition-colors">Our Ethos</Link></li>
              <li><Link href="/craft" className="text-fluid-sm text-surface-500 hover:text-primary-800 transition-colors">The Process</Link></li>
              <li><Link href="/contact" className="text-fluid-sm text-surface-500 hover:text-primary-800 transition-colors">Connect</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 flex flex-col gap-fluid-xs">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-surface-900 border-b border-surface-200 pb-2">Experience</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/collection" className="text-fluid-sm text-surface-500 hover:text-primary-800 transition-colors">Collections</Link></li>
              <li><Link href="/gallery" className="text-fluid-sm text-surface-500 hover:text-primary-800 transition-colors">Gallery</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 flex flex-col gap-fluid-xs">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-surface-900 border-b border-surface-200 pb-2">System</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/faq" className="text-fluid-sm text-surface-500 hover:text-primary-800 transition-colors">Support</Link></li>
              <li><Link href="/privacy" className="text-fluid-sm text-surface-500 hover:text-primary-800 transition-colors">Security</Link></li>
              <li><Link href="/admin" className="text-fluid-sm text-surface-500 hover:text-primary-800 transition-colors">Dashboard</Link></li>
            </ul>
          </div>
        </div>

        {/* Legal & Versioning */}
        <div className="border-t border-surface-200/60 pt-fluid-md flex flex-col md:flex-row items-center justify-between gap-fluid-xs">
          <div className="flex items-center gap-fluid-xs">
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-surface-300">v4.0.0-APEX</span>
            <div className="w-[1px] h-3 bg-surface-200"></div>
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-surface-400">
              © {new Date().getFullYear()} Comfort Palace Studio
            </p>
          </div>
          <div className="flex gap-fluid-sm">
            <Link href="/terms" className="text-[9px] font-bold uppercase tracking-[0.2em] text-surface-400 hover:text-surface-900 transition-colors">Terms</Link>
            <Link href="/privacy" className="text-[9px] font-bold uppercase tracking-[0.2em] text-surface-400 hover:text-surface-900 transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
