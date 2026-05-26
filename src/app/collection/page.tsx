'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ProductInquiryModal from '@/components/ProductInquiryModal';
import Reveal from '@/components/motion/Reveal';

// Gallery collection items - real furniture pieces from the gallery
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

// Items from the public/Collections directory
const collectionFolderItems: Product[] = [
  { id: 'coll-1', item_code: 'COLL-001', name: 'Sofa Set', description: 'Luxurious sofa set for ultimate comfort.', price: 0, category: 'Living Room', image_url: '/Collections/sofa set.webp', quantity_in_stock: 5 },
  { id: 'coll-2', item_code: 'COLL-002', name: 'Elephant Accent Table', description: 'Unique artisan-crafted accent table.', price: 0, category: 'Tables', image_url: '/Collections/Elephant Accent Table.webp', quantity_in_stock: 5 },
  { id: 'coll-3', item_code: 'COLL-003', name: 'Accent Chair', description: 'Elegant accent chair for modern living.', price: 0, category: 'Seating', image_url: '/Collections/accent chair-1.webp', quantity_in_stock: 5 },
  { id: 'coll-4', item_code: 'COLL-004', name: 'Accent Chair', description: 'Contemporary seating solution with premium finish.', price: 0, category: 'Seating', image_url: '/Collections/accent chair-2.webp', quantity_in_stock: 5 },
  { id: 'coll-5', item_code: 'COLL-005', name: 'Accent Chair', description: 'Stylish accent piece for sophisticated interiors.', price: 0, category: 'Seating', image_url: '/Collections/accent chair-3.webp', quantity_in_stock: 5 },
  { id: 'coll-6', item_code: 'COLL-006', name: 'Coffee Table', description: 'Classic coffee table for everyday elegance.', price: 0, category: 'Tables', image_url: '/Collections/coffee table.webp', quantity_in_stock: 5 },
  { id: 'coll-7', item_code: 'COLL-007', name: 'Coffee Table', description: 'Sleek coffee table with contemporary design.', price: 0, category: 'Tables', image_url: '/Collections/coffee table-1.webp', quantity_in_stock: 5 },
  { id: 'coll-8', item_code: 'COLL-008', name: 'Coffee Table', description: 'Elegant coffee table for modern homes.', price: 0, category: 'Tables', image_url: '/Collections/coffee table-2.webp', quantity_in_stock: 5 },
  { id: 'coll-9', item_code: 'COLL-009', name: 'Coffee Table', description: 'Minimalist coffee table for a clean look.', price: 0, category: 'Tables', image_url: '/Collections/coffee table-3.webp', quantity_in_stock: 5 },
  { id: 'coll-10', item_code: 'COLL-010', name: 'Dinning Table', description: 'Elegant dining table for your dining space.', price: 0, category: 'Dining Sets', image_url: '/Collections/Dinning Table.webp', quantity_in_stock: 5 },
  { id: 'coll-11', item_code: 'COLL-011', name: 'Dinning Table', description: 'Grand dining table for family gatherings.', price: 0, category: 'Dining Sets', image_url: '/Collections/Dinning Table-1.webp', quantity_in_stock: 5 },
  { id: 'coll-12', item_code: 'COLL-012', name: 'Center Table', description: 'Modern center table, a focal point for your lounge.', price: 0, category: 'Tables', image_url: '/Collections/Center table.webp', quantity_in_stock: 5 },
  { id: 'coll-13', item_code: 'COLL-013', name: 'Wall Mirror', description: 'Decorative wall mirror to brighten your space.', price: 0, category: 'Decor', image_url: '/Collections/Wall Mirror.webp', quantity_in_stock: 5 },
  { id: 'coll-14', item_code: 'COLL-014', name: 'Low Coffee Table', description: 'Modern low-profile coffee table.', price: 0, category: 'Tables', image_url: '/Collections/Low Coffee Table.webp', quantity_in_stock: 5 },
  { id: 'coll-15', item_code: 'COLL-015', name: 'Wall Console Table', description: 'Sleek wall console for hallways and living rooms.', price: 0, category: 'Tables', image_url: '/Collections/wall console table.webp', quantity_in_stock: 5 },
  { id: 'coll-16', item_code: 'COLL-016', name: 'Side Table', description: 'Compact and stylish side table.', price: 0, category: 'Tables', image_url: '/Collections/side table-2.webp', quantity_in_stock: 5 },
  { id: 'coll-17', item_code: 'COLL-017', name: 'Accent Table', description: 'Versatile accent table for any room.', price: 0, category: 'Tables', image_url: '/Collections/accent table.webp', quantity_in_stock: 5 },
];

// Layout presets for the masonry-style editorial grid
const layoutPresets = [
  { span: 'md:col-span-8', aspect: 'aspect-[4/3] md:aspect-[16/9]' }, // 1. Sofa Set
  { span: 'md:col-span-4', aspect: 'aspect-[4/5] md:aspect-[3/4]' }, // 2. Elephant Accent Table
  { span: 'md:col-span-4', aspect: 'aspect-square' },                // 3. Accent Chair-1
  { span: 'md:col-span-4', aspect: 'aspect-square' },                // 4. Accent Chair-2
  { span: 'md:col-span-4', aspect: 'aspect-square' },                // 5. Accent Chair-3
  { span: 'md:col-span-12', aspect: 'aspect-[4/3] md:aspect-[21/9]' },// 6. Coffee Table
  { span: 'md:col-span-4', aspect: 'aspect-square' },                // 7. Coffee Table-1
  { span: 'md:col-span-4', aspect: 'aspect-square' },                // 8. Coffee Table-2
  { span: 'md:col-span-4', aspect: 'aspect-square' },                // 9. Coffee Table-3
  { span: 'md:col-span-8', aspect: 'aspect-[16/9]' },                // 10. Dinning Table
  { span: 'md:col-span-4', aspect: 'aspect-[3/4]' },                // 11. Dinning Table-1
  { span: 'md:col-span-6', aspect: 'aspect-[4/3]' },                // 12. Center Table
  { span: 'md:col-span-6', aspect: 'aspect-[4/3]' },                // 13. Wall Mirror
  { span: 'md:col-span-4', aspect: 'aspect-[3/4]' },                // 14. Low Coffee Table
  { span: 'md:col-span-8', aspect: 'aspect-[16/9]' },                // 15. Wall Console Table
  { span: 'md:col-span-6', aspect: 'aspect-[4/3]' },                 // 16. Side Table-2
  { span: 'md:col-span-6', aspect: 'aspect-[4/3]' },                 // 17. Accent Table
  { span: 'md:col-span-6', aspect: 'aspect-video' },
  { span: 'md:col-span-3', aspect: 'aspect-[3/4]' },
  { span: 'md:col-span-6', aspect: 'aspect-video' },
  { span: 'md:col-span-3', aspect: 'aspect-[3/4]' },
];

// Warm muted background tones for product cards
const bgColors = [
  'bg-[#b5b1a8]', 'bg-[#c5bbab]', 'bg-[#b6b3b2]',
  'bg-[#c2b5a6]', 'bg-[#c7c0b3]', 'bg-[#d3cec4]',
  'bg-[#bab5ae]', 'bg-[#c8c3b9]', 'bg-[#b0aca4]',
  'bg-[#cfc9be]', 'bg-[#bfb8ad]', 'bg-[#c3bdb3]',
  'bg-[#b8b3aa]', 'bg-[#d1cbc1]', 'bg-[#c0b9ae]',
  'bg-[#b9b4ab]', 'bg-[#c6c0b6]', 'bg-[#beb8ae]',
  'bg-[#d0c9bf]', 'bg-[#c4bdb3]', 'bg-[#b7b2a9]',
];

export default function CollectionPage() {
  const [visibleCount, setVisibleCount] = useState(9);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle deep-linking from homepage categories
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('category');
      if (catParam) {
        const mapping: { [key: string]: string } = {
          'sofa': 'Sofa',
          'bed': 'Bed',
          'dining-table': 'Dining Table',
          'chair': 'Chair',
          'center-table': 'Center Table',
          'consoles': 'Consoles',
          'wall-mirror-antique': 'Wall Mirror Antique',
          'side-table': 'Side Table'
        };
        const mappedFilter = mapping[catParam.toLowerCase()];
        if (mappedFilter) {
          setActiveFilter(mappedFilter);
        } else {
          setActiveFilter(catParam.charAt(0).toUpperCase() + catParam.slice(1));
        }
      }
    }
  }, []);

  // Use only the items from the Collections folder
  const allProducts: Product[] = [...collectionFolderItems];

  // Extract unique categories (exclude Decor and Storage from filter buttons)
  const hiddenCategories = ['Decor', 'Storage'];
  const categories = ['All', ...Array.from(new Set(allProducts.map(p => p.category).filter(Boolean) as string[])).filter(cat => !hiddenCategories.includes(cat))];

  // Filter products
  const filteredProducts = activeFilter === 'All'
    ? allProducts
    : allProducts.filter(p => {
        const cat = p.category?.toLowerCase() || '';
        const name = p.name?.toLowerCase() || '';
        const filter = activeFilter.toLowerCase();
        
        // Direct category match
        if (cat === filter) return true;
        
        // Custom subcategory matches
        if (filter === 'sofa') return name.includes('sofa') || cat === 'living room';
        if (filter === 'bed') return name.includes('bed') || cat === 'bedroom';
        if (filter === 'dining table') return name.includes('dining') || name.includes('dinner') || cat === 'dining sets';
        if (filter === 'chair') return name.includes('chair') || name.includes('lounge') || cat === 'seating';
        if (filter === 'center table') return name.includes('center table') || name.includes('coffee table') || cat === 'tables';
        if (filter === 'consoles') return name.includes('console') || cat === 'tables';
        if (filter === 'wall mirror antique') return name.includes('mirror') || name.includes('wallmirror') || cat === 'decor';
        if (filter === 'side table') return name.includes('side table') || name.includes('sidetables') || cat === 'tables';
        
        return false;
      });

  const visibleItems = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 9, filteredProducts.length));
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setVisibleCount(9);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Logic for handling deep-linking from Gallery (Initial Entry Only)
  const hasInitialScrolled = useRef(false);

  useEffect(() => {
    const handleInitialHashScroll = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#product-') && !hasInitialScrolled.current) {
        const id = hash.replace('#product-', '');
        const productIndex = allProducts.findIndex(p => p.id === id);
        
        if (productIndex !== -1) {
          // Force visibility for the target piece if it's beyond initial load
          if (productIndex >= visibleCount) {
            setVisibleCount(productIndex + 1);
          }
          
          hasInitialScrolled.current = true;
          
          setTimeout(() => {
            const element = document.getElementById(`product-${id}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 600);
        }
      }
    };

    handleInitialHashScroll();
  }, [allProducts]); // React to allProducts changes

  const getProductImage = (product: Product) => {
    if (product.image_url) {
      return product.image_url.startsWith('/') ? product.image_url : `/uploads/${product.image_url}`;
    }
    return '/images/Sofa.jpg';
  };

  return (
    <div className="flex flex-col w-full bg-surface-50 min-h-screen font-sans">

      {/* Editorial Header Section */}
      <section className="w-full pt-32 lg:pt-48 pb-20 px-6 lg:px-12 overflow-hidden">
        <div className="mx-auto max-w-[1400px] flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <Reveal direction="right" once={true} delay={0.2} distance="100px">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-[1px] bg-surface-400 block" />
                <span className="text-[12px] font-medium tracking-[0.2em] text-surface-500 uppercase">Archive / 2026</span>
              </div>
              <h1 className="font-display text-6xl lg:text-[6.5rem] text-surface-900 font-light tracking-tighter leading-[0.95]">
                The Master <br /> Collection.
              </h1>
            </div>
          </Reveal>

          <Reveal direction="left" once={true} delay={0.4} distance="100px">
            <div className="flex flex-col items-start lg:items-end max-w-sm">
              <p className="text-surface-500 text-lg lg:text-xl leading-relaxed text-left lg:text-right text-balance mb-8">
                A curated selection of timeless pieces. Each form follows function, creating harmony in your modern living spaces.
              </p>
              <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2">
                {categories.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleFilterChange(tab)}
                    className={`px-5 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 ${
                      activeFilter === tab
                        ? 'bg-primary-800 text-surface-50 shadow-md'
                        : 'bg-transparent text-surface-600 hover:bg-surface-200 border border-surface-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Product Grid */}
      <section className="w-full pb-32 px-4 lg:px-12">
          <div className="mx-auto max-w-[1400px]">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <p className="text-surface-400 text-lg font-light">No products found in this category.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
                  {visibleItems.map((product, index) => {
                    const layout = layoutPresets[index % layoutPresets.length];
                    const bg = bgColors[index % bgColors.length];
                    const displayIndex = String(index + 1).padStart(2, '0');
                    const image = getProductImage(product);

                    return (
                      <Reveal 
                        key={product.id} 
                        id={`product-${product.id}`}
                        delay={(index % 3) * 0.1} 
                        distance="40px" 
                        className={layout.span}
                      >
                        <button
                          onClick={() => handleProductClick(product)}
                          className="group flex flex-col gap-5 text-left cursor-pointer w-full"
                        >
                          {/* Image Card with Advanced Cutout */}
                          <div className={`relative w-full ${layout.aspect} ${bg} rounded-[2rem] lg:rounded-[3rem] overflow-hidden p-6 lg:p-10 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2`}>
  
                            {/* Floating Frosted Glass Badge */}
                            <div className="absolute top-6 right-6 lg:top-10 lg:right-10 z-30 bg-surface-50/30 backdrop-blur-xl border border-surface-50/40 px-5 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] text-surface-900 font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                              {product.category || 'Furniture'}
                            </div>
  
                            {/* High-Res Product Image */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="relative w-full h-full drop-shadow-2xl group-hover:scale-105 transition-transform duration-[1.2s]">
                                <Image
                                  src={image}
                                  alt={product.name}
                                  fill
                                  className="object-cover object-center rounded-none"
                                />
                              </div>
                            </div>
  
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
  
                            {/* Intricate Bottom-Left Cutout */}
                            <div className="absolute bottom-0 left-0 w-28 h-24 bg-surface-50 rounded-tr-[2.5rem] flex items-end justify-start pb-6 pl-8 z-20">
                              <span className="text-surface-900 text-3xl font-medium leading-none">{displayIndex}</span>
                              {/* Outer curve top */}
                              <div className="absolute -top-10 left-0 w-10 h-10 bg-transparent rounded-bl-[2.5rem] shadow-[-20px_20px_0_20px_oklch(var(--color-surface-50))]" />
                              {/* Outer curve right */}
                              <div className="absolute bottom-0 -right-10 w-10 h-10 bg-transparent rounded-bl-[2.5rem] shadow-[-20px_20px_0_20px_oklch(var(--color-surface-50))]" />
                            </div>
  
                            {/* Hover CTA */}
                            <div className="absolute bottom-8 right-8 z-20 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                              <span className="bg-surface-50/90 backdrop-blur-md text-surface-900 text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full shadow-lg">
                                Inquire Now
                              </span>
                            </div>
                          </div>
  
                          {/* Minimalist Meta Data */}
                          <div className="flex items-start justify-between px-2">
                            <div>
                              <h3 className="font-display text-2xl lg:text-3xl text-surface-900 font-light group-hover:text-primary-800 transition-colors tracking-tight">
                                {product.name}
                              </h3>
                              {product.description && (
                                <p className="text-surface-400 text-sm mt-1 line-clamp-1 max-w-[300px]">{product.description}</p>
                              )}
                            </div>
                            <div className="flex flex-col items-end flex-shrink-0">
                              <span className="text-sm text-primary-800 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 group-hover:translate-y-0 duration-500">
                                Inquire &rarr;
                              </span>
                            </div>
                          </div>
                        </button>
                      </Reveal>
                    );
                  })}
                </div>

                <div className="mt-32 flex flex-col items-center justify-center border-t border-surface-200 pt-16">
                  <p className="text-surface-500 text-sm tracking-widest uppercase mb-8">
                    Showing {visibleItems.length} of {filteredProducts.length} pieces
                  </p>
                  {hasMore && (
                    <button
                      onClick={handleLoadMore}
                      className="relative group overflow-hidden bg-transparent border border-surface-900 text-surface-900 px-12 py-5 rounded-full font-medium text-sm transition-colors"
                    >
                      <span className="relative z-10 group-hover:text-surface-50 transition-colors duration-500">Load More Collection</span>
                      <div className="absolute inset-0 bg-surface-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
                    </button>
                  )}
                </div>
              </>
            )}
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
