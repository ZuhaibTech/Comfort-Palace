'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductInquiryModal from '@/components/ProductInquiryModal';

interface Product {
  id: string;
  item_code: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  quantity_in_stock: number;
}

const galleryItems = [
  { id: 1, type: 'video', src: '/Gallery/Gallery (1).mp4', span: 'md:col-span-8', aspect: 'aspect-[16/9]', product: { id: 'gallery-1', item_code: 'GAL-001', name: 'Premium Living Room Set', description: 'Elegant living room ensemble featuring contemporary design with premium upholstery.', price: 85000, category: 'Living Room', image_url: '/Gallery/Gallery (1).jpeg', quantity_in_stock: 5 } },
  { id: 2, type: 'image', src: '/Gallery/Gallery (1).jpeg', span: 'md:col-span-4', aspect: 'aspect-[3/4]', product: { id: 'gallery-1', item_code: 'GAL-001', name: 'Premium Living Room Set', description: 'Elegant living room ensemble featuring contemporary design with premium upholstery.', price: 85000, category: 'Living Room', image_url: '/Gallery/Gallery (1).jpeg', quantity_in_stock: 5 } },
  { id: 3, type: 'image', src: '/Gallery/Gallery (2).jpeg', span: 'md:col-span-4', aspect: 'aspect-square', product: { id: 'gallery-2', item_code: 'GAL-002', name: 'Modern Accent Collection', description: 'Curated accent pieces that bring sophistication to any interior space.', price: 32000, category: 'Decor', image_url: '/Gallery/Gallery (2).jpeg', quantity_in_stock: 8 } },
  { id: 4, type: 'video', src: '/Gallery/Gallery (2).mp4', span: 'md:col-span-4', aspect: 'aspect-square', product: { id: 'gallery-3', item_code: 'GAL-003', name: 'Designer Lounge Setup', description: 'Artisan-crafted lounge furniture for the discerning homeowner.', price: 120000, category: 'Living Room', image_url: '/Gallery/Gallery (3).jpeg', quantity_in_stock: 3 } },
  { id: 5, type: 'image', src: '/Gallery/Gallery (3).jpeg', span: 'md:col-span-4', aspect: 'aspect-square', product: { id: 'gallery-3', item_code: 'GAL-003', name: 'Designer Lounge Setup', description: 'Artisan-crafted lounge furniture for the discerning homeowner.', price: 120000, category: 'Living Room', image_url: '/Gallery/Gallery (3).jpeg', quantity_in_stock: 3 } },
  { id: 6, type: 'image', src: '/Gallery/Gallery (4).jpeg', span: 'md:col-span-6', aspect: 'aspect-[4/3]', product: { id: 'gallery-4', item_code: 'GAL-004', name: 'Classic Wooden Ensemble', description: 'Handcrafted wooden furniture set with rich natural grain finish.', price: 67000, category: 'Dining Sets', image_url: '/Gallery/Gallery (4).jpeg', quantity_in_stock: 6 } },
  { id: 7, type: 'image', src: '/Gallery/Gallery (5).jpeg', span: 'md:col-span-6', aspect: 'aspect-[4/3]', product: { id: 'gallery-5', item_code: 'GAL-005', name: 'Minimalist Side Unit', description: 'Clean-lined minimalist storage unit crafted from sustainable hardwood.', price: 28000, category: 'Storage', image_url: '/Gallery/Gallery (5).jpeg', quantity_in_stock: 12 } },
  { id: 8, type: 'image', src: '/Gallery/Gallery (6).jpeg', span: 'md:col-span-4', aspect: 'aspect-square', product: { id: 'gallery-6', item_code: 'GAL-006', name: 'Heritage Craft Cabinet', description: 'Traditional cabinet with intricate detailing and modern functionality.', price: 45000, category: 'Storage', image_url: '/Gallery/Gallery (6).jpeg', quantity_in_stock: 4 } },
  { id: 9, type: 'image', src: '/Gallery/Gallery (7).jpeg', span: 'md:col-span-4', aspect: 'aspect-square', product: { id: 'gallery-7', item_code: 'GAL-007', name: 'Artisan Bookshelf Unit', description: 'Open-shelf bookcase designed for both display and storage.', price: 38000, category: 'Storage', image_url: '/Gallery/Gallery (7).jpeg', quantity_in_stock: 7 } },
  { id: 10, type: 'image', src: '/Gallery/Gallery (8).jpeg', span: 'md:col-span-4', aspect: 'aspect-square', product: { id: 'gallery-8', item_code: 'GAL-008', name: 'Executive Desk Collection', description: 'Luxurious executive desk with ergonomic design and premium finish.', price: 55000, category: 'Study Tables', image_url: '/Gallery/Gallery (8).jpeg', quantity_in_stock: 5 } },
  { id: 11, type: 'image', src: '/Gallery/Gallery (9).jpeg', span: 'md:col-span-12', aspect: 'aspect-[21/9]', product: { id: 'gallery-9', item_code: 'GAL-009', name: 'Statement Dining Set', description: 'Grand dining table with matching chairs for memorable gatherings.', price: 95000, category: 'Dining Sets', image_url: '/Gallery/Gallery (9).jpeg', quantity_in_stock: 3 } },
  { id: 12, type: 'image', src: '/Gallery/Gallery (10).jpeg', span: 'md:col-span-4', aspect: 'aspect-[3/4]', product: { id: 'gallery-10', item_code: 'GAL-010', name: 'Velvet Accent Chair', description: 'Plush velvet accent chair with sculptural silhouette.', price: 22000, category: 'Seating', image_url: '/Gallery/Gallery (10).jpeg', quantity_in_stock: 15 } },
  { id: 13, type: 'image', src: '/Gallery/Gallery (11).jpeg', span: 'md:col-span-4', aspect: 'aspect-[3/4]', product: { id: 'gallery-11', item_code: 'GAL-011', name: 'Carved Wood Console', description: 'Intricately carved console table that serves as a focal point.', price: 41000, category: 'Tables', image_url: '/Gallery/Gallery (11).jpeg', quantity_in_stock: 6 } },
  { id: 14, type: 'image', src: '/Gallery/Gallery (12).jpeg', span: 'md:col-span-4', aspect: 'aspect-[3/4]', product: { id: 'gallery-12', item_code: 'GAL-012', name: 'Royal Bed Frame', description: 'King-size bed frame with ornate headboard and solid construction.', price: 78000, category: 'Bedroom', image_url: '/Gallery/Gallery (12).jpeg', quantity_in_stock: 4 } },
  { id: 15, type: 'image', src: '/Gallery/Gallery (13).jpeg', span: 'md:col-span-6', aspect: 'aspect-video', product: { id: 'gallery-13', item_code: 'GAL-013', name: 'Contemporary Sofa Set', description: 'L-shaped sofa set with premium fabric and deep seating comfort.', price: 110000, category: 'Living Room', image_url: '/Gallery/Gallery (13).jpeg', quantity_in_stock: 3 } },
  { id: 16, type: 'image', src: '/Gallery/Gallery (14).jpeg', span: 'md:col-span-6', aspect: 'aspect-video', product: { id: 'gallery-14', item_code: 'GAL-014', name: 'Rustic Center Table', description: 'Reclaimed wood center table with industrial metal accents.', price: 35000, category: 'Tables', image_url: '/Gallery/Gallery (14).jpeg', quantity_in_stock: 8 } },
  { id: 17, type: 'image', src: '/Gallery/Gallery (15).jpeg', span: 'md:col-span-4', aspect: 'aspect-square', product: { id: 'gallery-15', item_code: 'GAL-015', name: 'Designer TV Unit', description: 'Wall-mounted entertainment unit with concealed cable management.', price: 48000, category: 'Storage', image_url: '/Gallery/Gallery (15).jpeg', quantity_in_stock: 6 } },
  { id: 18, type: 'image', src: '/Gallery/Gallery (16).jpeg', span: 'md:col-span-4', aspect: 'aspect-square', product: { id: 'gallery-16', item_code: 'GAL-016', name: 'Luxury Wardrobe System', description: 'Full-height wardrobe with mirror panels and soft-close mechanisms.', price: 92000, category: 'Bedroom', image_url: '/Gallery/Gallery (16).jpeg', quantity_in_stock: 4 } },
  { id: 19, type: 'image', src: '/Gallery/Gallery (17).jpeg', span: 'md:col-span-4', aspect: 'aspect-square', product: { id: 'gallery-17', item_code: 'GAL-017', name: 'Compact Study Desk', description: 'Space-efficient study desk perfect for home offices.', price: 24000, category: 'Study Tables', image_url: '/Gallery/Gallery (17).jpeg', quantity_in_stock: 10 } },
  { id: 20, type: 'image', src: '/Gallery/Gallery (18).jpeg', span: 'md:col-span-3', aspect: 'aspect-[3/4]', product: { id: 'gallery-18', item_code: 'GAL-018', name: 'Ornamental Side Table', description: 'Decorative side table with hand-painted motifs.', price: 18000, category: 'Tables', image_url: '/Gallery/Gallery (18).jpeg', quantity_in_stock: 14 } },
  { id: 21, type: 'image', src: '/Gallery/Gallery (19).jpeg', span: 'md:col-span-6', aspect: 'aspect-video', product: { id: 'gallery-19', item_code: 'GAL-019', name: 'Grand Living Room Suite', description: 'Complete living room furniture suite with coordinated design language.', price: 165000, category: 'Living Room', image_url: '/Gallery/Gallery (19).jpeg', quantity_in_stock: 2 } },
  { id: 22, type: 'image', src: '/Gallery/Gallery (20).jpeg', span: 'md:col-span-3', aspect: 'aspect-[3/4]', product: { id: 'gallery-20', item_code: 'GAL-020', name: 'Artisan Dining Chair Set', description: 'Set of 6 handcrafted dining chairs with cushioned seats.', price: 54000, category: 'Seating', image_url: '/Gallery/Gallery (20).jpeg', quantity_in_stock: 5 } },
  { id: 23, type: 'image', src: '/Gallery/Gallery (21).jpeg', span: 'md:col-span-4', aspect: 'aspect-square', product: { id: 'gallery-21', item_code: 'GAL-021', name: 'Modern Display Cabinet', description: 'Glass-fronted display cabinet with ambient lighting.', price: 62000, category: 'Storage', image_url: '/Gallery/Gallery (21).jpeg', quantity_in_stock: 4 } },
  { id: 24, type: 'image', src: '/Gallery/Gallery (22).jpeg', span: 'md:col-span-4', aspect: 'aspect-square', product: { id: 'gallery-22', item_code: 'GAL-022', name: 'Sculptural Lounge Chair', description: 'Statement lounge chair combining art and ergonomic comfort.', price: 43000, category: 'Seating', image_url: '/Gallery/Gallery (22).jpeg', quantity_in_stock: 7 } },
  { id: 25, type: 'image', src: '/Gallery/Gallery (23).jpeg', span: 'md:col-span-4', aspect: 'aspect-square', product: { id: 'gallery-23', item_code: 'GAL-023', name: 'Heritage Bedroom Suite', description: 'Classic bedroom furniture set with timeless silhouettes.', price: 135000, category: 'Bedroom', image_url: '/Gallery/Gallery (23).jpeg', quantity_in_stock: 2 } },
];

export default function GalleryPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

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
                A technical exploration of space, light, and material. Click on any piece to inquire about pricing and availability.
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
              <button 
                key={item.id}
                onClick={() => handleItemClick(item.product as Product)}
                className={`group relative ${item.span} ${item.aspect} rounded-[2rem] overflow-hidden bg-surface-200 border border-surface-200/50 shadow-sm hover:shadow-2xl transition-all duration-700 animate-[revealUp_1s_forwards] opacity-0 text-left cursor-pointer`}
                style={{ animationDelay: `${(index % 12) * 0.1}s` }}
              >
                {item.type === 'image' ? (
                  <Image 
                    src={item.src} 
                    alt={item.product.name} 
                    fill 
                    className="object-cover transition-transform duration-[2s] group-hover:scale-110"
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
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900/70 via-surface-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em]">{item.product.category}</span>
                      <span className="text-white text-xl font-display font-light">{item.product.name}</span>
                      <span className="text-white/80 text-sm font-medium">₹{item.product.price.toLocaleString()}</span>
                    </div>
                    <span className="bg-white/90 backdrop-blur-md text-surface-900 text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg flex-shrink-0">
                      Inquire
                    </span>
                  </div>
                </div>

                {/* The Inverted Notch Pattern (Apex Signature) */}
                <div className="absolute top-0 right-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <svg className="w-20 h-20 text-white/20 rotate-180" viewBox="0 0 112 80" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,0 A 24,24 0 0,0 24,24 H 88 A 24,24 0 0,1 112,48 V 80 H 0 Z" />
                  </svg>
                </div>
              </button>
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

      {/* Product Inquiry Modal */}
      <ProductInquiryModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
