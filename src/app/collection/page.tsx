import Image from 'next/image';
import Link from 'next/link';

export default function CollectionPage() {
  const collections = [
    {
      id: '01',
      name: 'Cloud Modular Sofa',
      category: 'Living',
      price: '$1,250',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop',
      bg: 'bg-[#b5b1a8]',
      span: 'md:col-span-8',
      aspect: 'aspect-[4/3] md:aspect-[16/9]'
    },
    {
      id: '02',
      name: 'Grace Lounge Chair',
      category: 'Seating',
      price: '$345',
      image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=800&auto=format&fit=crop',
      bg: 'bg-[#c5bbab]',
      span: 'md:col-span-4',
      aspect: 'aspect-[4/5] md:aspect-[3/4]'
    },
    {
      id: '03',
      name: 'Minimalist Dining Table',
      category: 'Tables',
      price: '$520',
      image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=800&auto=format&fit=crop',
      bg: 'bg-[#b6b3b2]',
      span: 'md:col-span-4',
      aspect: 'aspect-square'
    },
    {
      id: '04',
      name: 'Orbital Floor Lamp',
      category: 'Lighting',
      price: '$189',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop',
      bg: 'bg-[#c2b5a6]',
      span: 'md:col-span-4',
      aspect: 'aspect-square'
    },
    {
      id: '05',
      name: 'Serene Platform Bed',
      category: 'Bedroom',
      price: '$890',
      image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=800&auto=format&fit=crop',
      bg: 'bg-[#c7c0b3]',
      span: 'md:col-span-4',
      aspect: 'aspect-square'
    },
    {
      id: '06',
      name: 'Oak Wood Sideboard',
      category: 'Storage',
      price: '$680',
      image: 'https://images.unsplash.com/photo-1595514535415-eb9f96b7cd5d?q=80&w=1200&auto=format&fit=crop',
      bg: 'bg-[#d3cec4]',
      span: 'md:col-span-12',
      aspect: 'aspect-[4/3] md:aspect-[21/9]'
    }
  ];

  return (
    <div className="flex flex-col w-full bg-[#f8f7f4] min-h-screen font-sans">
      
      {/* Editorial Header Section */}
      <section className="w-full pt-32 lg:pt-48 pb-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1400px] flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-12 h-[1px] bg-surface-400 block"></span>
              <span className="text-[12px] font-medium tracking-[0.2em] text-surface-500 uppercase">Archive / 2026</span>
            </div>
            <h1 className="font-display text-6xl lg:text-[6.5rem] text-surface-900 font-light tracking-tighter leading-[0.95]">
              The Master <br /> Collection.
            </h1>
          </div>
          
          <div className="flex flex-col items-start lg:items-end max-w-sm">
            <p className="text-surface-500 text-lg lg:text-xl leading-relaxed text-left lg:text-right text-balance mb-8">
              A curated selection of timeless pieces. Each form follows function, creating harmony in your modern living spaces.
            </p>
            <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2">
              {['All', 'Seating', 'Lighting', 'Tables', 'Decor'].map((tab, i) => (
                <button 
                  key={tab} 
                  className={`px-5 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 ${i === 0 ? 'bg-primary-800 text-white shadow-md' : 'bg-transparent text-surface-600 hover:bg-surface-200 border border-surface-300'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetrical Editorial Grid */}
      <section className="w-full pb-32 px-4 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
            {collections.map((item) => (
              <Link href={`/product/${item.name.toLowerCase().replace(/ /g, '-')}`} key={item.id} className={`group flex flex-col gap-5 ${item.span}`}>
                
                {/* Image Card with Advanced Cutout */}
                <div className={`relative w-full ${item.aspect} ${item.bg} rounded-[2rem] lg:rounded-[3rem] overflow-hidden p-6 lg:p-10 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2`}>
                  
                  {/* Floating Frosted Glass Badge */}
                  <div className="absolute top-6 right-6 lg:top-10 lg:right-10 z-30 bg-white/30 backdrop-blur-xl border border-white/40 px-5 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] text-surface-900 font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                    {item.category}
                  </div>

                  {/* High-Res Product Image */}
                  <div className="absolute inset-0 flex items-center justify-center p-8 lg:p-16">
                    <div className="relative w-full h-full max-w-[90%] max-h-[90%] drop-shadow-2xl group-hover:scale-105 transition-transform duration-[1.2s] cubic-bezier(0.2,0.8,0.2,1)">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover object-center rounded-2xl mix-blend-multiply opacity-95" 
                      />
                    </div>
                  </div>

                  {/* Intricate Bottom-Left Cutout */}
                  <div className="absolute bottom-0 left-0 w-28 h-24 bg-[#f8f7f4] rounded-tr-[2.5rem] flex items-end justify-start pb-6 pl-8 z-20">
                    <span className="text-surface-900 text-3xl font-medium leading-none">{item.id}</span>
                    {/* Outer curve top */}
                    <div className="absolute -top-10 left-0 w-10 h-10 bg-transparent rounded-bl-[2.5rem] shadow-[-20px_20px_0_20px_#f8f7f4]"></div>
                    {/* Outer curve right */}
                    <div className="absolute bottom-0 -right-10 w-10 h-10 bg-transparent rounded-bl-[2.5rem] shadow-[-20px_20px_0_20px_#f8f7f4]"></div>
                  </div>
                </div>

                {/* Minimalist Meta Data */}
                <div className="flex items-start justify-between px-2">
                  <div>
                    <h3 className="font-display text-2xl lg:text-3xl text-surface-900 font-light group-hover:text-primary-800 transition-colors tracking-tight">{item.name}</h3>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-sans text-lg lg:text-xl font-medium text-surface-900">{item.price}</span>
                    <span className="text-sm text-surface-500 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 group-hover:translate-y-0 duration-500">Explore &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Load More Module */}
          <div className="mt-32 flex flex-col items-center justify-center border-t border-surface-200 pt-16">
            <p className="text-surface-500 text-sm tracking-widest uppercase mb-8">Showing 6 of 24 pieces</p>
            <button className="relative group overflow-hidden bg-transparent border border-surface-900 text-surface-900 px-12 py-5 rounded-full font-medium text-sm transition-colors">
              <span className="relative z-10 group-hover:text-white transition-colors duration-500">Load More Collection</span>
              <div className="absolute inset-0 bg-surface-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
