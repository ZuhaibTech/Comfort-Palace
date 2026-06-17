import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/motion/Reveal';

export default function AboutPage() {
  const values = [
    { title: 'Craftsmanship', desc: 'Every piece is a testament to timeless techniques merged with modern precision.' },
    { title: 'Ergonomic', desc: 'Pushing the boundaries of ergonomic design and material science.' },
    { title: 'Heritage', desc: 'Over three decades of trusted quality and timeless comfort, starting our journey in 1992.' },
  ];

  const reasons = [
    { id: '01', title: 'Premium Materials', desc: 'We source only the finest sustainable timbers and high-grade handlooms, ensuring your furniture lasts for decades.', img: '/images/Hero-CenterTable-main.jpeg' },
    { id: '02', title: 'Ergonomic Precision', desc: 'Every piece is engineered to support the human form, blending luxury aesthetics with technical comfort.', img: '/images/Sofa-Elevate.jpeg' },
    { id: '03', title: 'Direct To Consumer', desc: 'By eliminating middle-men, we provide studio-quality furniture at a fraction of traditional showroom prices.', img: '/images/Hero-Console-main.jpeg' },
    { id: '04', title: 'Custom Inquiries', desc: 'We work with you to tailor specific pieces to your architectural requirements.', img: '/images/Sofa-Advanced.jpeg' }
  ];

  return (
    <div className="flex flex-col w-full bg-surface-50 min-h-screen font-sans pt-[12dvh]">
      {/* Advantage Header Section */}
      <section className="w-full pt-20 pb-12 px-fluid-md lg:px-fluid-lg">
        <div className="mx-auto max-w-[1400px] text-center">
          <Reveal direction="up" once={true} delay={0.2} distance="40px">
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="w-8 h-[1px] bg-primary-800"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-800">The Comfort Advantage</span>
              <span className="w-8 h-[1px] bg-primary-800"></span>
            </div>
            <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-surface-900 font-light tracking-tighter leading-none mb-8">
              Why choose <br />
              <span className="italic text-primary-800">Comfort Palace?</span>
            </h1>
            <p className="text-surface-50 text-lg max-w-2xl mx-auto leading-relaxed font-light !text-surface-500">
              In an era of disposable design, we stand for longevity, ergonomics, and the uncompromising pursuit of the perfect lived atmosphere.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Editorial Header */}
      <section className="w-full py-12 px-fluid-md lg:px-fluid-lg border-t border-surface-200/50">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <Reveal direction="right" once={true} delay={0.2} distance="100px">
              <div className="max-w-3xl">
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-12 h-[1px] bg-primary-800"></span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-surface-500">Comfort Palace / Est. 1992</span>
                </div>
                <h1 className="font-display text-[clamp(3rem,6vw,6rem)] text-surface-900 font-light tracking-tighter leading-[0.9] mb-8">
                  Redefining the <br />
                  <span className="italic text-primary-800">Luxury of Lived Space.</span>
                </h1>
                <p className="text-surface-600 text-fluid-lg leading-relaxed max-w-xl">
                  We believe that furniture is more than utility—it's the architecture of your atmosphere. Our mission is to curate pieces that bridge the gap between precision and comfort.
                </p>
              </div>
            </Reveal>
            <Reveal direction="left" once={true} delay={0.4} distance="100px">
              <div className="relative aspect-video lg:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
                <Image 
                  src="/images/Bed-About-1.jpeg" 
                  alt="Our Design Studio" 
                  fill 
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Legacy Milestone Section - Refined for Clean Contrast & Mobile Responsiveness */}
      <section className="w-full py-20 lg:py-32 px-4 lg:px-fluid-lg bg-surface-50 relative overflow-hidden">
        {/* Large Watermark Year - Hidden on small screens for clarity */}
        <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-display font-bold text-surface-200/40 select-none pointer-events-none z-0">
          1992
        </div>

        <div className="mx-auto max-w-[1200px] relative z-10">
          <div className="flex flex-col lg:flex-row items-stretch rounded-[2.5rem] lg:rounded-[4rem] overflow-hidden shadow-2xl border border-surface-200 bg-surface-50">
            
            {/* Left Column: Dark Essence */}
            <div className="w-full lg:w-[45%] bg-primary-900 p-10 lg:p-20 text-surface-50 flex flex-col justify-between relative overflow-hidden group">
              <Reveal direction="up" delay={0.2} distance="30px">
                <div className="flex items-center gap-4 mb-12">
                  <span className="w-8 h-[1px] bg-primary-400"></span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-300">Our Heritage</span>
                </div>
                
                <h2 className="font-display text-4xl lg:text-6xl font-light leading-tight mb-8">
                  The Palace <br className="hidden lg:block" /> 
                  <span className="italic text-primary-200">Perspective.</span>
                </h2>
              </Reveal>

              <Reveal direction="up" delay={0.4} distance="30px">
                <div className="mt-auto">
                  <div className="text-6xl lg:text-8xl font-display font-bold text-primary-800/50 leading-none mb-2">1992</div>
                  <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary-400">Foundation Year</div>
                </div>
              </Reveal>

              {/* Background accent */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary-800/30 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:bg-primary-700/40 transition-colors duration-1000"></div>
            </div>

            {/* Right Column: Light Detail */}
            <div className="w-full lg:w-[55%] p-10 lg:p-20 flex flex-col justify-center bg-surface-50">
              <Reveal direction="up" delay={0.6} distance="30px">
                <div className="max-w-md">
                  <h3 className="font-display text-2xl lg:text-3xl italic text-surface-900 leading-snug mb-8">
                    "Furniture is the soul of a home, and we have been crafting comfort since 1992."
                  </h3>
                  
                  <div className="space-y-6 text-surface-500 text-base lg:text-lg leading-relaxed font-light">
                    <p>
                      What began as a small artisan workshop in the heart of the city has blossomed into a hallmark of <span className="text-surface-900 font-medium">modern heritage</span>. 
                    </p>
                    <p>
                      For over three decades, we've blended the tactile honesty of traditional woodworking with the sophisticated ergonomics of contemporary living.
                    </p>
                  </div>

                  <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="px-6 py-3 rounded-full border border-surface-900 text-surface-900 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-surface-900 hover:text-surface-50 transition-all duration-500 cursor-default">
                      Established 1992
                    </div>
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-surface-50 bg-surface-200 overflow-hidden">
                          <Image 
                            src={`/images/Sofa-Advanced.jpeg`} 
                            alt="Team" 
                            width={40} 
                            height={40} 
                            className="object-cover h-full w-full grayscale contrast-125"
                          />
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full border-2 border-surface-50 bg-primary-900 flex items-center justify-center text-[10px] text-surface-50 font-bold">
                        34Y
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* The Values Grid */}
      <section className="w-full py-24 px-fluid-md lg:px-fluid-lg bg-surface-50 border-y border-surface-200/60">
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
                  src="/images/Sofa-About-2.jpeg" 
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
                  <p>From carefully selected materials to expertly crafted finishes, every detail is designed to bring lasting comfort, elegance, and warmth into your home.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full py-24 px-fluid-md lg:px-fluid-lg bg-surface-100/50 border-t border-surface-200">
        <div className="mx-auto max-w-[1400px]">
          <div className="text-center mb-16">
            <Reveal direction="up" delay={0.2} distance="40px">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-800 block mb-3">Core Pillars</span>
              <h2 className="font-display text-4xl font-light text-surface-900">
                Designed for <span className="italic text-primary-800">Longevity & Quality</span>
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reasons.map((reason, i) => (
              <Reveal key={reason.id} delay={i * 0.15} distance="40px">
                <div className="flex flex-col h-full bg-surface-50 rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500 border border-surface-200/50">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image 
                      src={reason.img} 
                      alt={reason.title} 
                      fill 
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {reason.id}
                    </span>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-surface-900 uppercase tracking-wider mb-3">{reason.title}</h3>
                    <p className="text-surface-500 text-sm leading-relaxed flex-grow">{reason.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-24 px-fluid-md lg:px-fluid-lg bg-primary-900 text-surface-50 text-center">
        <Reveal delay={0.2} direction="up" distance="40px">
          <h2 className="font-display text-4xl font-light mb-12">Discover our curated selection.</h2>
          <Link 
            href="/collection" 
            className="btn-apex relative bg-surface-50 text-primary-900 px-12 py-5 text-sm group overflow-hidden inline-flex items-center justify-center gap-3 transition-all duration-500 shadow-xl hover:shadow-2xl active:scale-95"
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
