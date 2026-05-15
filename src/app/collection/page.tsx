'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
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

// Gallery collection items - real furniture pieces from the gallery
const galleryCollectionItems: Product[] = [
  { id: 'gallery-1', item_code: 'GAL-001', name: 'Premium Living Room Set', description: 'Elegant living room ensemble featuring contemporary design with premium upholstery.', price: 85000, category: 'Living Room', image_url: '/Gallery/Gallery (1).jpeg', quantity_in_stock: 5 },
  { id: 'gallery-2', item_code: 'GAL-002', name: 'Modern Accent Collection', description: 'Curated accent pieces that bring sophistication to any interior space.', price: 32000, category: 'Decor', image_url: '/Gallery/Gallery (2).jpeg', quantity_in_stock: 8 },
  { id: 'gallery-3', item_code: 'GAL-003', name: 'Designer Lounge Setup', description: 'Artisan-crafted lounge furniture for the discerning homeowner.', price: 120000, category: 'Living Room', image_url: '/Gallery/Gallery (3).jpeg', quantity_in_stock: 3 },
  { id: 'gallery-4', item_code: 'GAL-004', name: 'Classic Wooden Ensemble', description: 'Handcrafted wooden furniture set with rich natural grain finish.', price: 67000, category: 'Dining Sets', image_url: '/Gallery/Gallery (4).jpeg', quantity_in_stock: 6 },
  { id: 'gallery-5', item_code: 'GAL-005', name: 'Minimalist Side Unit', description: 'Clean-lined minimalist storage unit crafted from sustainable hardwood.', price: 28000, category: 'Storage', image_url: '/Gallery/Gallery (5).jpeg', quantity_in_stock: 12 },
  { id: 'gallery-6', item_code: 'GAL-006', name: 'Heritage Craft Cabinet', description: 'Traditional cabinet with intricate detailing and modern functionality.', price: 45000, category: 'Storage', image_url: '/Gallery/Gallery (6).jpeg', quantity_in_stock: 4 },
  { id: 'gallery-7', item_code: 'GAL-007', name: 'Artisan Bookshelf Unit', description: 'Open-shelf bookcase designed for both display and storage.', price: 38000, category: 'Storage', image_url: '/Gallery/Gallery (7).jpeg', quantity_in_stock: 7 },
  { id: 'gallery-8', item_code: 'GAL-008', name: 'Executive Desk Collection', description: 'Luxurious executive desk with ergonomic design and premium finish.', price: 55000, category: 'Study Tables', image_url: '/Gallery/Gallery (8).jpeg', quantity_in_stock: 5 },
  { id: 'gallery-9', item_code: 'GAL-009', name: 'Statement Dining Set', description: 'Grand dining table with matching chairs for memorable gatherings.', price: 95000, category: 'Dining Sets', image_url: '/Gallery/Gallery (9).jpeg', quantity_in_stock: 3 },
  { id: 'gallery-10', item_code: 'GAL-010', name: 'Velvet Accent Chair', description: 'Plush velvet accent chair with sculptural silhouette.', price: 22000, category: 'Seating', image_url: '/Gallery/Gallery (10).jpeg', quantity_in_stock: 15 },
  { id: 'gallery-11', item_code: 'GAL-011', name: 'Carved Wood Console', description: 'Intricately carved console table that serves as a focal point.', price: 41000, category: 'Tables', image_url: '/Gallery/Gallery (11).jpeg', quantity_in_stock: 6 },
  { id: 'gallery-12', item_code: 'GAL-012', name: 'Royal Bed Frame', description: 'King-size bed frame with ornate headboard and solid construction.', price: 78000, category: 'Bedroom', image_url: '/Gallery/Gallery (12).jpeg', quantity_in_stock: 4 },
  { id: 'gallery-13', item_code: 'GAL-013', name: 'Contemporary Sofa Set', description: 'L-shaped sofa set with premium fabric and deep seating comfort.', price: 110000, category: 'Living Room', image_url: '/Gallery/Gallery (13).jpeg', quantity_in_stock: 3 },
  { id: 'gallery-14', item_code: 'GAL-014', name: 'Rustic Center Table', description: 'Reclaimed wood center table with industrial metal accents.', price: 35000, category: 'Tables', image_url: '/Gallery/Gallery (14).jpeg', quantity_in_stock: 8 },
  { id: 'gallery-15', item_code: 'GAL-015', name: 'Designer TV Unit', description: 'Wall-mounted entertainment unit with concealed cable management.', price: 48000, category: 'Storage', image_url: '/Gallery/Gallery (15).jpeg', quantity_in_stock: 6 },
  { id: 'gallery-16', item_code: 'GAL-016', name: 'Luxury Wardrobe System', description: 'Full-height wardrobe with mirror panels and soft-close mechanisms.', price: 92000, category: 'Bedroom', image_url: '/Gallery/Gallery (16).jpeg', quantity_in_stock: 4 },
  { id: 'gallery-17', item_code: 'GAL-017', name: 'Compact Study Desk', description: 'Space-efficient study desk perfect for home offices.', price: 24000, category: 'Study Tables', image_url: '/Gallery/Gallery (17).jpeg', quantity_in_stock: 10 },
  { id: 'gallery-18', item_code: 'GAL-018', name: 'Ornamental Side Table', description: 'Decorative side table with hand-painted motifs.', price: 18000, category: 'Tables', image_url: '/Gallery/Gallery (18).jpeg', quantity_in_stock: 14 },
  { id: 'gallery-19', item_code: 'GAL-019', name: 'Grand Living Room Suite', description: 'Complete living room furniture suite with coordinated design language.', price: 165000, category: 'Living Room', image_url: '/Gallery/Gallery (19).jpeg', quantity_in_stock: 2 },
  { id: 'gallery-20', item_code: 'GAL-020', name: 'Artisan Dining Chair Set', description: 'Set of 6 handcrafted dining chairs with cushioned seats.', price: 54000, category: 'Seating', image_url: '/Gallery/Gallery (20).jpeg', quantity_in_stock: 5 },
  { id: 'gallery-21', item_code: 'GAL-021', name: 'Modern Display Cabinet', description: 'Glass-fronted display cabinet with ambient lighting.', price: 62000, category: 'Storage', image_url: '/Gallery/Gallery (21).jpeg', quantity_in_stock: 4 },
  { id: 'gallery-22', item_code: 'GAL-022', name: 'Sculptural Lounge Chair', description: 'Statement lounge chair combining art and ergonomic comfort.', price: 43000, category: 'Seating', image_url: '/Gallery/Gallery (22).jpeg', quantity_in_stock: 7 },
  { id: 'gallery-23', item_code: 'GAL-023', name: 'Heritage Bedroom Suite', description: 'Classic bedroom furniture set with timeless silhouettes.', price: 135000, category: 'Bedroom', image_url: '/Gallery/Gallery (23).jpeg', quantity_in_stock: 2 },
];

// Layout presets for the masonry-style editorial grid
const layoutPresets = [
  { span: 'md:col-span-8', aspect: 'aspect-[4/3] md:aspect-[16/9]' },
  { span: 'md:col-span-4', aspect: 'aspect-[4/5] md:aspect-[3/4]' },
  { span: 'md:col-span-4', aspect: 'aspect-square' },
  { span: 'md:col-span-4', aspect: 'aspect-square' },
  { span: 'md:col-span-4', aspect: 'aspect-square' },
  { span: 'md:col-span-12', aspect: 'aspect-[4/3] md:aspect-[21/9]' },
  { span: 'md:col-span-4', aspect: 'aspect-square' },
  { span: 'md:col-span-4', aspect: 'aspect-square' },
  { span: 'md:col-span-4', aspect: 'aspect-square' },
  { span: 'md:col-span-8', aspect: 'aspect-[16/9]' },
  { span: 'md:col-span-4', aspect: 'aspect-[3/4]' },
  { span: 'md:col-span-6', aspect: 'aspect-[4/3]' },
  { span: 'md:col-span-6', aspect: 'aspect-[4/3]' },
  { span: 'md:col-span-4', aspect: 'aspect-[3/4]' },
  { span: 'md:col-span-4', aspect: 'aspect-[3/4]' },
  { span: 'md:col-span-4', aspect: 'aspect-[3/4]' },
  { span: 'md:col-span-6', aspect: 'aspect-video' },
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
  const [backendProducts, setBackendProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(9);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json.success) {
          setBackendProducts(json.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        // Don't show error - gallery items will still display
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Merge backend products + gallery items (backend first, then gallery)
  const allProducts: Product[] = [...backendProducts, ...galleryCollectionItems];

  // Extract unique categories for filter tabs
  const categories = ['All', ...Array.from(new Set(allProducts.map(p => p.category).filter(Boolean) as string[]))];

  // Filter products by category
  const filteredProducts = activeFilter === 'All'
    ? allProducts
    : allProducts.filter(p => p.category?.toLowerCase() === activeFilter.toLowerCase());

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

  const getProductImage = (product: Product) => {
    if (product.image_url) {
      return product.image_url.startsWith('/') ? product.image_url : `/uploads/${product.image_url}`;
    }
    return '/images/Sofa.jpg';
  };

  return (
    <div className="flex flex-col w-full bg-[#f8f7f4] min-h-screen font-sans">

      {/* Editorial Header Section */}
      <section className="w-full pt-32 lg:pt-48 pb-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1400px] flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-12 h-[1px] bg-surface-400 block" />
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
              {categories.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleFilterChange(tab)}
                  className={`px-5 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 ${
                    activeFilter === tab
                      ? 'bg-primary-800 text-white shadow-md'
                      : 'bg-transparent text-surface-600 hover:bg-surface-200 border border-surface-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="w-full pb-16 px-4 lg:px-12">
          <div className="mx-auto max-w-[1400px] flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-6">
              <div className="flex gap-1.5">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="w-2 h-10 bg-primary-800 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-surface-400">
                Loading Collection...
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Product Grid */}
      {!loading && (
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
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className={`group flex flex-col gap-5 ${layout.span} text-left cursor-pointer`}
                      >
                        {/* Image Card with Advanced Cutout */}
                        <div className={`relative w-full ${layout.aspect} ${bg} rounded-[2rem] lg:rounded-[3rem] overflow-hidden p-6 lg:p-10 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2`}>

                          {/* Floating Frosted Glass Badge */}
                          <div className="absolute top-6 right-6 lg:top-10 lg:right-10 z-30 bg-white/30 backdrop-blur-xl border border-white/40 px-5 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] text-surface-900 font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
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
                          <div className="absolute bottom-0 left-0 w-28 h-24 bg-[#f8f7f4] rounded-tr-[2.5rem] flex items-end justify-start pb-6 pl-8 z-20">
                            <span className="text-surface-900 text-3xl font-medium leading-none">{displayIndex}</span>
                            {/* Outer curve top */}
                            <div className="absolute -top-10 left-0 w-10 h-10 bg-transparent rounded-bl-[2.5rem] shadow-[-20px_20px_0_20px_#f8f7f4]" />
                            {/* Outer curve right */}
                            <div className="absolute bottom-0 -right-10 w-10 h-10 bg-transparent rounded-bl-[2.5rem] shadow-[-20px_20px_0_20px_#f8f7f4]" />
                          </div>

                          {/* Hover CTA */}
                          <div className="absolute bottom-8 right-8 z-20 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                            <span className="bg-white/90 backdrop-blur-md text-surface-900 text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full shadow-lg">
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
                            <span className="font-sans text-lg lg:text-xl font-medium text-surface-900">
                              ₹{product.price.toLocaleString()}
                            </span>
                            <span className="text-sm text-primary-800 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 group-hover:translate-y-0 duration-500">
                              Inquire &rarr;
                            </span>
                          </div>
                        </div>
                      </button>
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
                      <span className="relative z-10 group-hover:text-white transition-colors duration-500">Load More Collection</span>
                      <div className="absolute inset-0 bg-surface-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Product Inquiry Modal */}
      <ProductInquiryModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
