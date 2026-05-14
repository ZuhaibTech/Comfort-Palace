import Image from 'next/image';
import Link from 'next/link';

export default function WhyChoosePage() {
  const reasons = [
    { 
      id: '01', 
      title: 'Premium Materials', 
      desc: 'We source only the finest sustainable timbers and high-grade leathers, ensuring your furniture lasts for decades.',
      img: '/images/wooden-table-with-chairs-modern-interior-design-2025-04-02-01-47-59-utc.jpg'
    },
    { 
      id: '02', 
      title: 'Ergonomic Precision', 
      desc: 'Every piece is engineered to support the human form, blending luxury aesthetics with technical comfort.',
      img: '/images/white-leather-sofa-against-a-wooden-wall-in-a-cont-2025-02-11-19-44-23-utc.jpg'
    },
    { 
      id: '03', 
      title: 'Direct To Consumer', 
      desc: 'By eliminating middle-men, we provide studio-quality furniture at a fraction of traditional showroom prices.',
      img: '/images/dinner-tea-table-with-chairs-on-the-balcony-in-bri-2025-03-09-18-28-59-utc.jpg'
    },
    { 
      id: '04', 
      title: 'Custom Inquiries', 
      desc: 'Our design studio works with you to tailor specific pieces to your architectural requirements.',
      img: '/images/Consoles.jpg'
    }
  ];

  return (
    <div className="flex flex-col w-full bg-white min-h-screen font-sans pt-[12dvh]">
      {/* Dynamic Header */}
      <section className="w-full py-24 px-fluid-md lg:px-fluid-lg bg-surface-50">
        <div className="mx-auto max-w-[1400px] text-center">
          <div className="inline-flex items-center gap-4 mb-8">
            <span className="w-8 h-[1px] bg-primary-800"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-800">The Comfort Advantage</span>
            <span className="w-8 h-[1px] bg-primary-800"></span>
          </div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-surface-900 font-light tracking-tighter leading-none mb-8">
            Why choose <br />
            <span className="italic text-primary-800">Comfort Palace?</span>
          </h1>
          <p className="text-surface-500 text-lg max-w-2xl mx-auto leading-relaxed">
            In an era of disposable design, we stand for longevity, ergonomics, and the uncompromising pursuit of the perfect lived atmosphere.
          </p>
        </div>
      </section>

      {/* Feature Blocks: Alternating Layout */}
      <section className="w-full py-12">
        <div className="mx-auto max-w-[1400px] px-fluid-md lg:px-fluid-lg">
          <div className="flex flex-col gap-32">
            {reasons.map((reason, i) => (
              <div key={reason.id} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-20 items-center`}>
                <div className="flex-1 w-full">
                  <div className="relative aspect-[4/5] lg:aspect-video rounded-[3rem] overflow-hidden group shadow-2xl">
                    <Image 
                      src={reason.img} 
                      alt={reason.title} 
                      fill 
                      className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-primary-900/10 mix-blend-multiply"></div>
                  </div>
                </div>
                <div className="flex-1 max-w-xl">
                  <span className="text-primary-800 font-display text-6xl italic block mb-8 opacity-20">{reason.id}</span>
                  <h2 className="text-3xl font-bold text-surface-900 uppercase tracking-widest mb-6 leading-tight">{reason.title}</h2>
                  <p className="text-surface-500 text-lg leading-relaxed mb-10">
                    {reason.desc}
                  </p>
                  <div className="h-px w-24 bg-primary-800/30"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="w-full py-32 px-fluid-md lg:px-fluid-lg mt-24">
        <div className="mx-auto max-w-[1400px] bg-surface-900 rounded-[4rem] p-16 lg:p-24 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-800/20 rounded-full blur-[120px] -z-10"></div>
          <h2 className="text-white font-display text-4xl lg:text-5xl font-light mb-12">Built for life. <span className="italic text-primary-300">Guaranteed for comfort.</span></h2>
          <div className="flex flex-wrap justify-center gap-12 text-white/60">
            <div className="flex flex-col items-center gap-2">
              <span className="text-white font-bold text-xl uppercase tracking-tighter">10 Year</span>
              <span className="text-[10px] uppercase tracking-widest">Warranty</span>
            </div>
            <div className="w-px h-12 bg-white/10 hidden md:block"></div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-white font-bold text-xl uppercase tracking-tighter">Global</span>
              <span className="text-[10px] uppercase tracking-widest">Shipping</span>
            </div>
            <div className="w-px h-12 bg-white/10 hidden md:block"></div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-white font-bold text-xl uppercase tracking-tighter">Eco-Certified</span>
              <span className="text-[10px] uppercase tracking-widest">Materials</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-24 text-center">
        <Link href="/collection" className="btn-apex bg-primary-800 text-white hover:bg-surface-900 px-16 py-6 text-sm">
          Experience the Difference
        </Link>
      </section>
    </div>
  );
}
