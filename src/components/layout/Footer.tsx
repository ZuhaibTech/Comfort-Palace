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
              {[
                { 
                  name: 'Instagram', 
                  href: 'https://www.instagram.com/the_comfortpalace?igsh=ZWZwcTRyeTJxZ3dj', 
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
                  href: 'https://x.com/Comfort_Palace', 
                  icon: (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )
                },
                { 
                  name: 'Facebook', 
                  href: 'https://www.facebook.com/profile.php?viewas=100000686899395&id=61580162012552', 
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  )
                },
                { 
                  name: 'LinkedIn', 
                  href: 'https://www.linkedin.com/in/comfort-palace-346051409/?trk=public-profile-join-page', 
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  )
                }
              ].map((s) => (
                <Link key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-surface-200 flex items-center justify-center text-surface-400 hover:text-primary-800 hover:border-primary-800 transition-all duration-300" aria-label={s.name}>
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="md:col-span-2 md:col-start-9 flex flex-col gap-fluid-xs">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-surface-900 border-b border-surface-200 pb-2">Studio</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="text-fluid-sm text-surface-500 hover:text-primary-800 transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-fluid-sm text-surface-500 hover:text-primary-800 transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-fluid-sm text-surface-500 hover:text-primary-800 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 flex flex-col gap-fluid-xs">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-surface-900 border-b border-surface-200 pb-2">Experience</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/collection" className="text-fluid-sm text-surface-500 hover:text-primary-800 transition-colors">Collections</Link></li>
            </ul>
          </div>
        </div>

        {/* Legal & Versioning */}
        <div className="border-t border-surface-200/60 pt-fluid-md flex flex-col md:flex-row items-center justify-between gap-fluid-xs">
          <div className="flex items-center gap-fluid-xs">
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
