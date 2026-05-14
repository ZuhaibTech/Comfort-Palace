import Image from 'next/image';
import Link from 'next/link';

export default function GalleryPage() {
  const galleryItems = [
    { id: 1, type: 'video', src: '/Gallery/Gallery (1).mp4', span: 'md:col-span-8', aspect: 'aspect-[16/9]' },
    { id: 2, type: 'image', src: '/Gallery/Gallery (1).jpeg', span: 'md:col-span-4', aspect: 'aspect-[3/4]' },
    { id: 3, type: 'image', src: '/Gallery/Gallery (2).jpeg', span: 'md:col-span-4', aspect: 'aspect-square' },
    { id: 4, type: 'video', src: '/Gallery/Gallery (2).mp4', span: 'md:col-span-4', aspect: 'aspect-square' },
    { id: 5, type: 'image', src: '/Gallery/Gallery (3).jpeg', span: 'md:col-span-4', aspect: 'aspect-square' },
    { id: 6, type: 'image', src: '/Gallery/Gallery (4).jpeg', span: 'md:col-span-6', aspect: 'aspect-[4/3]' },
    { id: 7, type: 'image', src: '/Gallery/Gallery (5).jpeg', span: 'md:col-span-6', aspect: 'aspect-[4/3]' },
    { id: 8, type: 'image', src: '/Gallery/Gallery (6).jpeg', span: 'md:col-span-4', aspect: 'aspect-square' },
    { id: 9, type: 'image', src: '/Gallery/Gallery (7).jpeg', span: 'md:col-span-4', aspect: 'aspect-square' },
    { id: 10, type: 'image', src: '/Gallery/Gallery (8).jpeg', span: 'md:col-span-4', aspect: 'aspect-square' },
    { id: 11, type: 'image', src: '/Gallery/Gallery (9).jpeg', span: 'md:col-span-12', aspect: 'aspect-[21/9]' },
    { id: 12, type: 'image', src: '/Gallery/Gallery (10).jpeg', span: 'md:col-span-4', aspect: 'aspect-[3/4]' },
    { id: 13, type: 'image', src: '/Gallery/Gallery (11).jpeg', span: 'md:col-span-4', aspect: 'aspect-[3/4]' },
    { id: 14, type: 'image', src: '/Gallery/Gallery (12).jpeg', span: 'md:col-span-4', aspect: 'aspect-[3/4]' },
    { id: 15, type: 'image', src: '/Gallery/Gallery (13).jpeg', span: 'md:col-span-6', aspect: 'aspect-video' },
    { id: 16, type: 'image', src: '/Gallery/Gallery (14).jpeg', span: 'md:col-span-6', aspect: 'aspect-video' },
    { id: 17, type: 'image', src: '/Gallery/Gallery (15).jpeg', span: 'md:col-span-4', aspect: 'aspect-square' },
    { id: 18, type: 'image', src: '/Gallery/Gallery (16).jpeg', span: 'md:col-span-4', aspect: 'aspect-square' },
    { id: 19, type: 'image', src: '/Gallery/Gallery (17).jpeg', span: 'md:col-span-4', aspect: 'aspect-square' },
    { id: 20, type: 'image', src: '/Gallery/Gallery (18).jpeg', span: 'md:col-span-3', aspect: 'aspect-[3/4]' },
    { id: 21, type: 'image', src: '/Gallery/Gallery (19).jpeg', span: 'md:col-span-6', aspect: 'aspect-video' },
    { id: 22, type: 'image', src: '/Gallery/Gallery (20).jpeg', span: 'md:col-span-3', aspect: 'aspect-[3/4]' },
    { id: 23, type: 'image', src: '/Gallery/Gallery (21).jpeg', span: 'md:col-span-4', aspect: 'aspect-square' },
    { id: 24, type: 'image', src: '/Gallery/Gallery (22).jpeg', span: 'md:col-span-4', aspect: 'aspect-square' },
    { id: 25, type: 'image', src: '/Gallery/Gallery (23).jpeg', span: 'md:col-span-4', aspect: 'aspect-square' },
  ];

  return (
    <div className="flex flex-col w-full bg-surface-50 min-h-screen font-sans overflow-x-hidden pt-[12dvh]">
      
      {/* 1. HERO HEADER: EDITORIAL SCALE */}
      <section className="w-full pt-16 lg:pt-24 pb-12 px-fluid-md lg:px-fluid-lg">
        <div className="mx-auto max-w-[1400px] relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-800/5 rounded-full blur-3xl -z-10"></div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-6 animate-[revealUp_0.8s_0.2s_forwards] opacity-0">
                <span className="w-12 h-[1px] bg-primary-800"></span>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-surface-500">Visual Archive / 2026</span>
              </div>
              <h1 className="font-display text-[clamp(3.5rem,8vw,8rem)] text-surface-900 font-light tracking-tighter leading-[0.9] animate-[revealUp_0.8s_0.4s_forwards] opacity-0">
                Curated <br />
                <span className="italic text-primary-800">Atmospheres.</span>
              </h1>
            </div>
            
            <div className="flex flex-col items-start lg:items-end max-w-md animate-[revealUp_0.8s_0.6s_forwards] opacity-0">
              <p className="text-surface-500 text-fluid-lg leading-relaxed text-left lg:text-right text-balance mb-8">
                A technical exploration of space, light, and material. Our visual gallery documents the intersection of architectural precision and lived comfort.
              </p>
              <div className="flex flex-wrap items-center justify-start lg:justify-end gap-3">
                {['All Moments', 'Living', 'Architecture', 'Details'].map((tab, i) => (
                  <button 
                    key={tab} 
                    className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-500 ${i === 0 ? 'bg-primary-800 text-white shadow-xl scale-105' : 'bg-white text-surface-500 hover:bg-surface-100 border border-surface-200 shadow-sm'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GALLERY GRID: THE MASONRY SYSTEM */}
      <section className="w-full pb-24 px-fluid-md lg:px-fluid-lg">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6">
            {galleryItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`group relative ${item.span} ${item.aspect} rounded-[2rem] overflow-hidden bg-surface-200 border border-surface-200/50 shadow-sm hover:shadow-2xl transition-all duration-700 animate-[revealUp_1s_forwards] opacity-0`}
                style={{ animationDelay: `${(index % 12) * 0.1}s` }}
              >
                {item.type === 'image' ? (
                  <Image 
                    src={item.src} 
                    alt={`Gallery Item ${item.id}`} 
                    fill 
                    className="object-cover transition-transform duration-[2s] cubic-bezier(0.2, 0, 0.2, 1) group-hover:scale-110"
                  />
                ) : (
                  <video 
                    src={item.src} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                  />
                )}
                
                {/* Technical Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute bottom-8 left-8 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em]">Perspective</span>
                    <span className="text-white text-xl font-display font-light">0{item.id} / System</span>
                  </div>
                </div>

                {/* The Inverted Notch Pattern (Apex Signature) */}
                <div className="absolute top-0 right-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <svg className="w-20 h-20 text-white/20 rotate-180" viewBox="0 0 112 80" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,0 A 24,24 0 0,0 24,24 H 88 A 24,24 0 0,1 112,48 V 80 H 0 Z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. EXPERIENCE CALLOUT */}
      <section className="w-full py-24 px-fluid-md lg:px-fluid-lg bg-surface-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
        </div>
        
        <div className="mx-auto max-w-[1400px] relative z-10 flex flex-col items-center text-center">
          <div className="text-[10px] font-bold tracking-[0.5em] text-primary-400 mb-8 uppercase">Experience the System</div>
          <h2 className="text-white text-[clamp(2rem,5vw,4rem)] font-display font-light tracking-tighter leading-none mb-12 max-w-3xl">
            Beyond the frame, <br />
            <span className="italic text-primary-300">lies absolute comfort.</span>
          </h2>
          <Link href="/collection" className="btn-apex bg-white text-surface-900 hover:bg-primary-300 hover:text-white border-transparent px-12 py-5 text-sm">
            View Pieces
          </Link>
        </div>
      </section>

    </div>
  );
}
