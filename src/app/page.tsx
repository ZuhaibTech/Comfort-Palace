// src/app/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/motion/Reveal';

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-surface-50 h-full font-sans overflow-x-hidden pt-[12dvh]">
      
      {/* 1. HERO SECTION: EDITORIAL ASYMMETRY */}
      <section className="relative w-full min-h-[90dvh] flex flex-col lg:flex-row items-center px-fluid-md lg:px-fluid-lg pt-10 pb-10">
        
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-[80%] lg:w-[60%] h-full bg-surface-100 -z-10 rounded-bl-[10rem]"></div>

        {/* Left Content Area (Typography) */}
        <div className="w-full lg:w-5/12 flex flex-col pt-10 lg:pt-0 relative z-20 lg:pr-fluid-xl">
          <div className="flex items-center gap-4 mb-fluid-sm translate-y-[-20px] opacity-0 animate-[revealUp_0.8s_0.2s_forwards]">
            <span className="w-16 h-[1px] bg-primary-800"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-surface-500">Curated Living</span>
          </div>
          
          <h1 className="text-surface-900 text-[clamp(3rem,5vw+1.5rem,5.5rem)] font-display text-balance leading-[0.95] tracking-tighter mb-fluid-sm translate-y-[-30px] opacity-0 animate-[revealUp_0.8s_0.4s_forwards]">
            Premium <br/>
            <span className="italic font-light text-primary-800">Furniture</span> <br/>
            Collection
          </h1>
          
          <p className="text-surface-500 text-fluid-base max-w-md font-light leading-relaxed mb-fluid-md translate-y-[-20px] opacity-0 animate-[revealUp_0.8s_0.6s_forwards]">
            Experience timeless comfort with furniture crafted for modern living. Elegant designs, premium quality, and lasting impressions for every space.
          </p>
          
          <div className="flex items-center gap-6 translate-y-[-10px] opacity-0 animate-[revealUp_0.8s_0.8s_forwards]">
            <Link href="/collection" className="btn-apex-primary flex items-center gap-3 group px-10 py-4 text-[10px]">
              Explore Collection
              <span className="w-8 h-[1px] bg-white transition-all group-hover:w-12 group-hover:translate-x-2"></span>
            </Link>
          </div>
        </div>

        {/* Right Image Area (Asymmetrical Editorial Layout) */}
        <div className="w-full lg:w-7/12 relative h-[60dvh] lg:h-[80dvh] mt-10 lg:mt-0 flex items-end justify-end group z-10">
          
          {/* Main Large Image */}
          <div className="relative w-full lg:w-[90%] h-full rounded-tl-[8rem] lg:rounded-tl-[16rem] rounded-bl-2xl rounded-tr-2xl rounded-br-2xl overflow-hidden shadow-2xl">
            <Image 
              src="/images/interior-of-a-rich-house-cozy-living-room-2025-03-25-15-21-37-utc.jpg" 
              alt="Premium Furniture Design" 
              fill 
              className="object-cover transition-transform duration-[3s] ease-out group-hover:scale-105"
              priority
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-900/40 via-transparent to-transparent"></div>
          </div>

          {/* Floating Secondary Image (The Editorial Touch) */}
          <div className="absolute left-0 bottom-[10%] w-[45%] lg:w-[40%] aspect-[3/4] rounded-tr-[5rem] rounded-bl-2xl rounded-br-2xl rounded-tl-2xl overflow-hidden shadow-2xl border-4 border-white translate-y-10 group-hover:translate-y-0 transition-transform duration-[1.5s] ease-out z-20 hidden md:block">
             <Image 
              src="/images/white-leather-sofa-against-a-wooden-wall-in-a-cont-2025-02-11-19-44-23-utc.jpg" 
              alt="Detail Shot" 
              fill 
              className="object-cover"
            />
          </div>

          {/* Floating Accent Badge */}
          <div className="absolute top-[10%] lg:top-[5%] right-5 lg:right-10 w-28 h-28 lg:w-32 lg:h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-xl z-30">
            <svg viewBox="0 0 100 100" className="w-full h-full text-surface-900 animate-[spin_20s_linear_infinite]">
              <path id="curve" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent"/>
              <text className="text-[11px] font-bold uppercase tracking-[0.2em] fill-current">
                <textPath href="#curve" startOffset="0%">• premium artisan quality • comfort palace</textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center p-6">
               <div className="relative w-full h-full">
                 <Image 
                   src="/Logo/Logo.png" 
                   alt="Logo Icon" 
                   fill 
                   className="object-contain"
                 />
               </div>
            </div>
          </div>
        </div>
      </section>


      {/* 3. CATEGORIES: THE GRID SYSTEM */}
      <section className="w-full py-fluid-xl px-fluid-md lg:px-fluid-lg bg-surface-50">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-fluid-lg border-b border-surface-200 pb-fluid-xs">
            <div className="max-w-xl overflow-hidden">
              <Reveal direction="right" distance="100px" delay={0.2}>
                <div className="text-xs font-bold tracking-[0.4em] text-primary-800 mb-fluid-3xs uppercase">01 / Archetypes</div>
                <h2 className="text-fluid-3xl font-display text-surface-900 tracking-tighter leading-none mb-fluid-3xs">Curated Categories</h2>
              </Reveal>
            </div>
            <div className="max-w-[400px] overflow-hidden">
              <Reveal direction="left" distance="100px" delay={0.4}>
                <p className="text-surface-500 text-fluid-base lg:text-right leading-relaxed mb-fluid-xs">
                  Every piece in our collection is a study in form and function, categorized by its architectural intent.
                </p>
              </Reveal>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { id: '01', name: 'Sofa', img: '/images/Sofa.jpg' },
              { id: '02', name: 'Bed', img: '/images/Double Bed.jpg' },
              { id: '03', name: 'Dining Table', img: '/images/Dining Table.jpg' },
              { id: '04', name: 'Chair', img: '/images/WoodenChairs.jpg' },
              { id: '05', name: 'Center Table', img: '/Gallery/Gallery (14).jpeg' },
              { id: '06', name: 'Consoles', img: '/images/Consoles.jpg' },
              { id: '07', name: 'Wall Mirror Antique', img: '/images/Wallmirror.jpg' },
              { id: '08', name: 'Side Table', img: '/images/SideTables.jpg' }
            ].map((cat, i) => (
              <Reveal key={cat.id} delay={0.2 + (i * 0.15)} distance="40px">
                <Link href={`/collection?category=${cat.name.toLowerCase().replace(' ', '-')}`} className="group relative aspect-[3/4] flex flex-col pt-6 px-6 transition-transform duration-700 hover:-translate-y-2">
                  
                  {/* Main Card Image */}
                  <div className="absolute inset-0 rounded-[1.5rem] overflow-hidden z-0 bg-surface-200">
                     <Image 
                       src={cat.img} 
                       alt={cat.name} 
                       fill 
                       className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                     />
                     {/* Subtle readability gradient */}
                     <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
                  </div>
                  
                  {/* Text Content overlay */}
                  <div className="relative z-10 flex flex-col h-full pointer-events-none">
                    <h3 className="text-white text-xl font-sans font-normal tracking-wide drop-shadow-sm">{cat.name}</h3>
                  </div>

                  {/* The Inverted Notch at Bottom Left */}
                  <div className="absolute bottom-[-1px] left-[-1px] z-20 pointer-events-none">
                    <svg className="w-28 h-20 text-surface-50 scale-[1.02] origin-bottom-left" viewBox="0 0 112 80" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0,0 A 24,24 0 0,0 24,24 H 88 A 24,24 0 0,1 112,48 V 80 H 0 Z" />
                    </svg>
                    {/* The Number */}
                    <span className="absolute bottom-4 left-6 text-surface-900 text-2xl font-sans font-normal tracking-tight">{cat.id}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US: THE COMFORT ADVANTAGE */}
      <section className="w-full py-fluid-xl px-fluid-md lg:px-fluid-lg bg-white relative overflow-hidden">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1">
              <Reveal direction="right" delay={0.2} distance="80px">
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-12 h-[1px] bg-primary-800"></span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-surface-500">The Comfort Advantage</span>
                </div>
                <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] text-surface-900 font-light tracking-tighter leading-none mb-10">
                  Crafted for <br />
                  <span className="italic text-primary-800">Uncompromising</span> Standards.
                </h2>
                <p className="text-surface-500 text-lg leading-relaxed mb-12 max-w-xl">
                  We bridge the gap between architectural precision and emotional comfort. Discover why designers and homeowners choose The Comfort Palace for their most significant spaces.
                </p>
              </Reveal>
              
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                  { title: 'premium wood furniture', desc: 'Hand-selected sustainable hardwoods.' },
                  { title: 'Ergonomic Design', desc: 'Engineered for the human form.' },
                  { title: 'Luxury Finishes', desc: 'At Bespoke, we use premium-based polish.' },
                  { title: 'Direct Access', desc: 'Studio quality, accessible pricing.' }
                ].map((item, i) => (
                  <Reveal key={item.title} delay={0.4 + (i * 0.1)} distance="30px">
                    <div className="group">
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-surface-900 mb-2 group-hover:text-primary-800 transition-colors">{item.title}</h4>
                      <p className="text-sm text-surface-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
              
              <Reveal delay={0.8}>
                <div className="mt-16">
                  <Link href="/why-choose-us" className="btn-apex bg-primary-800 text-white hover:bg-surface-900 px-10 py-4 text-[11px]">
                    Learn More
                  </Link>
                </div>
              </Reveal>
            </div>
            
            <div className="flex-1 w-full relative">
              <Reveal direction="left" delay={0.4} distance="100px">
                <div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl rotate-[2deg]">
                  <Image 
                    src="/images/wooden-table-with-chairs-modern-interior-design-2025-04-02-01-47-59-utc.jpg" 
                    alt="Our Craftsmanship" 
                    fill 
                    className="object-cover"
                  />
                </div>
                {/* Floating technical tag */}
                <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-xl border border-surface-100 hidden md:block animate-bounce">
                  <div className="text-[10px] font-bold text-primary-800 uppercase tracking-widest mb-1">Quality Check</div>
                  <div className="text-surface-900 font-display text-xl">100% Certified</div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>


      {/* 4. TECHNICAL SHOWCASE (Replaces Lookbook) */}
      <section className="w-full py-fluid-xl px-fluid-md lg:px-fluid-lg bg-surface-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] mask-radial bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="mx-auto max-w-[1400px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-fluid-lg items-center">
            <div className="lg:col-span-5">
              <Reveal direction="right" delay={0.2} distance="80px">
                <div className="text-xs font-bold tracking-[0.4em] text-primary-800 mb-fluid-3xs uppercase">02 / Technical Depth</div>
                <h2 className="text-surface-900 text-fluid-3xl font-display text-balance tracking-tighter leading-[1.1] mb-fluid-sm">
                  Engineering <br/>
                  <span className="text-gradient">Quiet Luxury.</span>
                </h2>
                <p className="text-surface-500 text-fluid-base font-light leading-relaxed mb-fluid-md">
                  We believe true premium quality lies in the details that are often overlooked. Every joint, every finish, and every silhouette is analyzed through a lens of technical excellence.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-7 flex gap-fluid-3xs">
               {/* Left Column */}
               <div className="flex-1 flex flex-col gap-fluid-3xs">
                 <Reveal direction="down" delay={0.2} distance="80px">
                   <div className="aspect-square relative rounded-fluid-sm overflow-hidden border border-surface-200/50 shadow-sm">
                     <Image src="/images/Consoles.jpg" fill className="object-cover" alt="Detail 1" />
                   </div>
                 </Reveal>
                 <Reveal direction="up" delay={0.4} distance="80px">
                   <div className="aspect-[3/4] relative rounded-fluid-sm overflow-hidden border border-surface-200/50 shadow-sm">
                     <Image src="/images/Wallmirror.jpg" fill className="object-cover" alt="Detail 3" />
                   </div>
                 </Reveal>
               </div>
               {/* Right Column (Staggered) */}
               <div className="flex-1 flex flex-col gap-fluid-3xs pt-fluid-lg">
                 <Reveal direction="down" delay={0.3} distance="80px">
                   <div className="aspect-[3/4] relative rounded-fluid-sm overflow-hidden border border-surface-200/50 shadow-sm">
                     <Image src="/images/interior-modern-living-room-wall-mockup-2025-01-07-23-12-33-utc.jpg" fill className="object-cover" alt="Detail 2" />
                   </div>
                 </Reveal>
                 <Reveal direction="up" delay={0.5} distance="80px">
                   <div className="aspect-square relative rounded-fluid-sm overflow-hidden border border-surface-200/50 shadow-sm">
                     <Image src="/images/empty-conference-room-with-black-chairs-and-wooden-2024-09-15-12-48-09-utc.jpg" fill className="object-cover" alt="Detail 4" />
                   </div>
                 </Reveal>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS: APEX VOICES */}
      <section className="w-full py-fluid-2xl px-fluid-md lg:px-fluid-lg bg-surface-50">
        <Reveal delay={0.2}>
          <div className="mx-auto max-w-[1000px] text-center">
            <div className="text-xs font-bold tracking-[0.4em] text-surface-400 mb-fluid-xs uppercase">03 / Proven Excellence</div>
            <div className="relative">
               <span className="text-[12rem] font-serif absolute -top-24 left-1/2 -translate-x-1/2 text-surface-200/50 leading-none select-none">“</span>
               <p className="text-fluid-xl lg:text-fluid-2xl font-display font-light text-surface-900 leading-[1.3] tracking-tight relative z-10 mb-fluid-md italic">
                 The level of technical detail in their furniture is simply unmatched. It's not just furniture; it's a structural investment that defines the entire room.
               </p>
            </div>
            <div className="flex flex-col items-center gap-fluid-3xs">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-200 border-2 border-primary-800 shadow-xl">
                <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200" width={100} height={100} className="object-cover" alt="Client" />
              </div>
              <div className="flex flex-col">
                <span className="text-fluid-sm font-bold uppercase tracking-widest text-surface-900">Julian Draxler</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-800">Architectural Lead, Berlin</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 6. FINAL CTA: APEX JOIN */}
      <section className="w-full pb-fluid-2xl px-fluid-md lg:px-fluid-lg">
        <Reveal direction="up" distance="60px" delay={0.2}>
          <div className="mx-auto max-w-[1400px] rounded-fluid-lg overflow-hidden bg-primary-800/60 relative max-h-[80vh] flex items-center justify-center text-center shadow-3xl py-fluid-xl">
            <Image src="/images/Sofa.jpg" fill className="object-cover opacity-40 scale-110 hover:scale-100 transition-transform duration-[3s]" alt="Background" />
            <div className="relative z-10 max-w-2xl mx-auto px-fluid-md">
              <h2 className="text-white text-fluid-4xl font-display font-light text-balance tracking-tighter mb-fluid-sm">Elevate Your System.</h2>
              <p className="text-white/70 text-fluid-lg font-light mb-fluid-lg leading-relaxed">
                Join the Comfort Palace ecosystem and transform your living space into a high-performance environment.
              </p>
              <div className="flex flex-col sm:flex-row gap-fluid-3xs justify-center">
                <Link href="/collection" className="btn-apex bg-white text-surface-900 hover:bg-accent-500 hover:text-white border-transparent">
                  Acquire Pieces
                </Link>
                <Link href="/contact" className="btn-apex border-white/20 text-white hover:bg-white/10">
                  Studio Inquiry
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
      
    </div>
  );
}
