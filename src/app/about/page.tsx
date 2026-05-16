import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/motion/Reveal';

export default function AboutPage() {
  const values = [
    { title: 'Craftsmanship', desc: 'Every piece is a testament to timeless techniques merged with modern precision.' },
    { title: 'Innovation', desc: 'Pushing the boundaries of ergonomic design and material science.' },
    { title: 'Heritage', desc: 'Built on a foundation of quality that spans generations of comfort.' },
  ];

  return (
    <div className="flex flex-col w-full bg-surface-50 min-h-screen font-sans pt-[12dvh]">
      {/* Editorial Header */}
      <section className="w-full pt-16 lg:pt-24 pb-12 px-fluid-md lg:px-fluid-lg">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <Reveal direction="right" once={true} delay={0.2} distance="100px">
              <div className="max-w-3xl">
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-12 h-[1px] bg-primary-800"></span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-surface-500">The Comfort Palace / Est. 2026</span>
                </div>
                <h1 className="font-display text-[clamp(3rem,6vw,6rem)] text-surface-900 font-light tracking-tighter leading-[0.9] mb-8">
                  Redefining the <br />
                  <span className="italic text-primary-800">Luxury of Lived Space.</span>
                </h1>
                <p className="text-surface-600 text-fluid-lg leading-relaxed max-w-xl">
                  We believe that furniture is more than utility—it's the architecture of your atmosphere. Our mission is to curate pieces that bridge the gap between technical precision and emotional comfort.
                </p>
              </div>
            </Reveal>
            <Reveal direction="left" once={true} delay={0.4} distance="100px">
              <div className="relative aspect-video lg:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
                <Image 
                  src="/images/interior-of-modern-light-bedroom-with-lamps-and-br-2024-11-17-10-48-17-utc.jpg" 
                  alt="Our Design Studio" 
                  fill 
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The Values Grid */}
      <section className="w-full py-24 px-fluid-md lg:px-fluid-lg bg-white border-y border-surface-200/60">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.2} distance="40px">
                <div className="group">
                  <span className="text-primary-800 font-display text-4xl italic block mb-6">0{i + 1}</span>
                  <h3 className="text-xl font-bold text-surface-900 uppercase tracking-widest mb-4 group-hover:text-primary-800 transition-colors">{v.title}</h3>
                  <p className="text-surface-500 leading-relaxed">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="w-full py-24 px-fluid-md lg:px-fluid-lg relative overflow-hidden">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <Reveal direction="right" delay={0.2} distance="80px" className="flex-1 order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-10 bg-primary-800/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
                <Image 
                  src="/images/white-leather-sofa-against-a-wooden-wall-in-a-cont-2025-02-11-19-44-23-utc.jpg" 
                  alt="Signature Piece" 
                  width={800} 
                  height={600} 
                  className="rounded-[4rem] shadow-xl rotate-[-2deg]"
                />
              </div>
            </Reveal>
            <Reveal direction="left" delay={0.4} distance="80px" className="flex-1 order-1 lg:order-2">
              <div>
                <h2 className="font-display text-5xl font-light text-surface-900 mb-8 leading-tight">A legacy of <span className="italic">uncompromising</span> standards.</h2>
                <div className="space-y-6 text-surface-600 text-lg leading-relaxed">
                  <p>Comfort Palace isn't just a furniture brand; it's a commitment to the art of living well. Every curve, material choice, and joint is analyzed for both durability and aesthetic harmony.</p>
                  <p>From our premium deep teal palettes to the hand-selected timber, we ensure that every interaction with our pieces feels like a return to absolute tranquility.</p>
                </div>
                <div className="mt-12 flex gap-8">
                  <div>
                    <div className="text-3xl font-display text-primary-800 mb-1">500+</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Unique Designs</div>
                  </div>
                  <div className="w-px h-12 bg-surface-200"></div>
                  <div>
                    <div className="text-3xl font-display text-primary-800 mb-1">2026</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Launch Year</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-24 px-fluid-md lg:px-fluid-lg bg-primary-900 text-white text-center">
        <Reveal delay={0.2} direction="up" distance="40px">
          <h2 className="font-display text-4xl font-light mb-12">Discover our curated selection.</h2>
          <Link 
            href="/collection" 
            className="btn-apex relative bg-white text-primary-900 px-12 py-5 text-sm group overflow-hidden inline-flex items-center justify-center gap-3 transition-all duration-500 shadow-xl hover:shadow-2xl active:scale-95"
          >
            {/* Animated Background Overlay */}
            <span className="absolute inset-0 bg-primary-50 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
            
            {/* Button Text */}
            <span className="relative z-10 transition-colors duration-500 group-hover:text-primary-800">Browse Collections</span>
            
            {/* Animated Arrow Icon */}
            <svg 
              viewBox="0 0 24 24" 
              className="w-4 h-4 relative z-10 transition-all duration-500 transform translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3"
            >
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
