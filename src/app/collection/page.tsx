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

// Items from the public/Collection Furnitures directory
const collectionData = [
  {
    category: 'Living Room',
    subcategories: [
      {
        name: 'Sofa',
        items: [
          { id: 'lr-sofa-main', item_code: 'LR-SOF-001', name: 'Sofa Set Main', description: 'Luxurious main sofa set.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/sofa set Main.webp', quantity_in_stock: 5, isMain: true },
          { id: 'lr-sofa-1', item_code: 'LR-SOF-002', name: 'Sofa Set - 1', description: 'Elegant sofa companion piece.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/sofa set -1.webp', quantity_in_stock: 5 },
          { id: 'lr-sofa-2', item_code: 'LR-SOF-003', name: 'Sofa Set - 2', description: 'Comfortable addition to your living space.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/sofa set -2.webp', quantity_in_stock: 5 },
          { id: 'lr-sofa-3', item_code: 'LR-SOF-004', name: 'Sofa Set - 3', description: 'Stylish seating for modern homes.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/sofa set -3.webp', quantity_in_stock: 5 },
        ]
      },
      {
        name: 'Coffee Table',
        items: [
          { id: 'lr-ct-main', item_code: 'LR-CT-001', name: 'Coffee Table Main', description: 'Centerpiece coffee table.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/coffee table Main.webp', quantity_in_stock: 5, isMain: true },
          { id: 'lr-ct-1', item_code: 'LR-CT-002', name: 'Coffee Table - 1', description: 'Contemporary coffee table design.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/coffee table-1.webp', quantity_in_stock: 5 },
          { id: 'lr-ct-2', item_code: 'LR-CT-003', name: 'Coffee Table - 2', description: 'Sleek and functional coffee table.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/coffee table-2.webp', quantity_in_stock: 5 },
          { id: 'lr-ct-3', item_code: 'LR-CT-004', name: 'Coffee Table - 3', description: 'Minimalist coffee table for any room.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/coffee table-3.webp', quantity_in_stock: 5 },
        ]
      },
      {
        name: 'Chest Drawers',
        items: [
          { id: 'lr-cd-main', item_code: 'LR-CD-001', name: 'Chest Drawers Main', description: 'Spacious main chest drawers.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/Chest Drawers main.webp', quantity_in_stock: 5, isMain: true },
          { id: 'lr-cd-1', item_code: 'LR-CD-002', name: 'Chest Drawers - 1', description: 'Classic chest of drawers.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/Chest Drawers -1.webp', quantity_in_stock: 5 },
          { id: 'lr-cd-2', item_code: 'LR-CD-003', name: 'Chest Drawers - 2', description: 'Modern storage solution.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/Chest Drawers -2.webp', quantity_in_stock: 5 },
          { id: 'lr-cd-3', item_code: 'LR-CD-004', name: 'Chest Drawers - 3', description: 'Elegant chest for your living area.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/Chest Drawers -3.webp', quantity_in_stock: 5 },
        ]
      },
      {
        name: 'Consoles',
        items: [
          { id: 'lr-con-main', item_code: 'LR-CON-001', name: 'Wall Console Main', description: 'Sophisticated main console table.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/wall console table Main.webp', quantity_in_stock: 5, isMain: true },
          { id: 'lr-con-1', item_code: 'LR-CON-002', name: 'Wall Console - 1', description: 'Sleek wall console table.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/wall console table -1.webp', quantity_in_stock: 5 },
          { id: 'lr-con-2', item_code: 'LR-CON-003', name: 'Wall Console - 2', description: 'Functional and stylish console.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/wall console table -2.webp', quantity_in_stock: 5 },
          { id: 'lr-con-3', item_code: 'LR-CON-004', name: 'Wall Console - 3', description: 'Artistic console for your hallway.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/wall console table -3.webp', quantity_in_stock: 5 },
        ]
      },
      {
        name: 'Side Tables',
        items: [
          { id: 'lr-st-main', item_code: 'LR-ST-001', name: 'Side Table Main', description: 'Handcrafted main side table.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/side table Main.webp', quantity_in_stock: 5, isMain: true },
          { id: 'lr-st-1', item_code: 'LR-ST-002', name: 'Side Table - 1', description: 'Elegant side table accent.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/side table -1.webp', quantity_in_stock: 5 },
          { id: 'lr-st-2', item_code: 'LR-ST-003', name: 'Side Table - 2', description: 'Versatile side table for any space.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/side table -2.webp', quantity_in_stock: 5 },
          { id: 'lr-st-3', item_code: 'LR-ST-004', name: 'Side Table - 3', description: 'Modern side table with unique finish.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/side table -3.webp', quantity_in_stock: 5 },
        ]
      }
    ]
  },
  {
    category: 'Bed Room',
    subcategories: [
      {
        name: 'Beds',
        items: [
          { id: 'br-bed-main', item_code: 'BR-BED-001', name: 'Bed Main', description: 'Comfortable main bed unit.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Beds main.webp', quantity_in_stock: 5, isMain: true },
          { id: 'br-bed-1', item_code: 'BR-BED-002', name: 'Bed - 1', description: 'Elegant bed frame design.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Beds -1.webp', quantity_in_stock: 5 },
          { id: 'br-bed-2', item_code: 'BR-BED-003', name: 'Bed - 2', description: 'Modern bed for a restful sleep.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Beds -2.webp', quantity_in_stock: 5 },
          { id: 'br-bed-3', item_code: 'BR-BED-004', name: 'Bed - 3', description: 'Premium bed for your bedroom.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Beds -3.webp', quantity_in_stock: 5 },
        ]
      },
      {
        name: 'Side Tables',
        items: [
          { id: 'br-st-main', item_code: 'BR-ST-001', name: 'Bed Side Table Main', description: 'Matching bedside table.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Bed Side table main.webp', quantity_in_stock: 5, isMain: true },
          { id: 'br-st-1', item_code: 'BR-ST-002', name: 'Bed Side Table - 1', description: 'Sleek bedside companion.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Bed Side table -1.webp', quantity_in_stock: 5 },
          { id: 'br-st-2', item_code: 'BR-ST-003', name: 'Bed Side Table - 2', description: 'Functional bedside storage.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Bed Side table -2.webp', quantity_in_stock: 5 },
          { id: 'br-st-3', item_code: 'BR-ST-004', name: 'Bed Side Table - 3', description: 'Stylish bedside accent.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Bed Side table -3.webp', quantity_in_stock: 5 },
        ]
      },
      {
        name: 'Wardrobe',
        items: [
          { id: 'br-wd-main', item_code: 'BR-WD-001', name: 'Wardrobe Main', description: 'Spacious main wardrobe.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Bed Wardrobe Main.webp', quantity_in_stock: 5, isMain: true },
          { id: 'br-wd-1', item_code: 'BR-WD-002', name: 'Wardrobe - 1', description: 'Modern wardrobe solution.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Bed Wardrobe -1.webp', quantity_in_stock: 5 },
          { id: 'br-wd-2', item_code: 'BR-WD-003', name: 'Wardrobe - 2', description: 'Elegant storage for your clothes.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Bed Wardrobe -2.webp', quantity_in_stock: 5 },
          { id: 'br-wd-3', item_code: 'BR-WD-004', name: 'Wardrobe - 3', description: 'Premium wardrobe design.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Bed Wardrobe -3.webp', quantity_in_stock: 5 },
        ]
      },
      {
        name: 'Bed Bench',
        items: [
          { id: 'br-bb-main', item_code: 'BR-BB-001', name: 'Bed Bench Main', description: 'Comfortable main bed bench.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Bed Bench main.webp', quantity_in_stock: 5, isMain: true },
          { id: 'br-bb-1', item_code: 'BR-BB-002', name: 'Bed Bench - 1', description: 'Elegant bed end bench.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Bed Bench -1.webp', quantity_in_stock: 5 },
          { id: 'br-bb-2', item_code: 'BR-BB-003', name: 'Bed Bench - 2', description: 'Modern bench for your bedroom.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Bed Bench -2.webp', quantity_in_stock: 5 },
          { id: 'br-bb-3', item_code: 'BR-BB-004', name: 'Bed Bench - 3', description: 'Stylish seating at your bedside.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Bed Bench -3.webp', quantity_in_stock: 5 },
        ]
      },
      {
        name: 'Dressing table',
        items: [
          { id: 'br-dt-main', item_code: 'BR-DT-001', name: 'Dressing Table Main', description: 'Elegant main dressing table.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Bed Dressing table MAIN.webp', quantity_in_stock: 5, isMain: true },
          { id: 'br-dt-1', item_code: 'BR-DT-002', name: 'Dressing Table - 1', description: 'Contemporary vanity table.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Bed Dressing table -1.webp', quantity_in_stock: 5 },
          { id: 'br-dt-2', item_code: 'BR-DT-003', name: 'Dressing Table - 2', description: 'Stylish dressing mirror set.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Bed Dressing table -2.webp', quantity_in_stock: 5 },
          { id: 'br-dt-3', item_code: 'BR-DT-004', name: 'Dressing Table - 3', description: 'Minimalist dressing table.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Bed Dressing table -3.webp', quantity_in_stock: 5 },
        ]
      }
    ]
  },
  {
    category: 'Dining',
    subcategories: [
      {
        name: 'Dining Table',
        items: [
          { id: 'dr-dt-main', item_code: 'DR-DT-001', name: 'Dining Table Main', description: 'Grand main dining table.', price: 0, category: 'Dining', image_url: '/Collection Furnitures/Dinning Table Main.webp', quantity_in_stock: 5, isMain: true },
          { id: 'dr-dt-1', item_code: 'DR-DT-002', name: 'Dining Table - 1', description: 'Elegant family dining table.', price: 0, category: 'Dining', image_url: '/Collection Furnitures/Dinning Table -1.webp', quantity_in_stock: 5 },
          { id: 'dr-dt-2', item_code: 'DR-DT-003', name: 'Dining Table - 2', description: 'Modern dining centerpiece.', price: 0, category: 'Dining', image_url: '/Collection Furnitures/Dinning Table -2.webp', quantity_in_stock: 5 },
          { id: 'dr-dt-3', item_code: 'DR-DT-004', name: 'Dining Table - 3', description: 'Sleek dining surface.', price: 0, category: 'Dining', image_url: '/Collection Furnitures/Dinning Table -3.webp', quantity_in_stock: 5 },
        ]
      },
      {
        name: 'Dining Chairs',
        items: [
          { id: 'dr-dc-main', item_code: 'DR-DC-001', name: 'Dining Chair Main', description: 'Comfortable main dining chair.', price: 0, category: 'Dining', image_url: '/Collection Furnitures/Dining Chairs main.webp', quantity_in_stock: 5, isMain: true },
          { id: 'dr-dc-1', item_code: 'DR-DC-002', name: 'Dining Chair - 1', description: 'Elegant dining seating.', price: 0, category: 'Dining', image_url: '/Collection Furnitures/Dining Chairs -1.webp', quantity_in_stock: 5 },
          { id: 'dr-dc-2', item_code: 'DR-DC-003', name: 'Dining Chair - 2', description: 'Modern chair for your dining room.', price: 0, category: 'Dining', image_url: '/Collection Furnitures/Dining Chairs -2.webp', quantity_in_stock: 5 },
          { id: 'dr-dc-3', item_code: 'DR-DC-004', name: 'Dining Chair - 3', description: 'Stylish dining chair set.', price: 0, category: 'Dining', image_url: '/Collection Furnitures/Dining Chairs -3.webp', quantity_in_stock: 5 },
        ]
      },
      {
        name: 'Dining Sideboard',
        items: [
          { id: 'dr-ds-main', item_code: 'DR-DS-001', name: 'Dining Sideboard Main', description: 'Spacious main sideboard.', price: 0, category: 'Dining', image_url: '/Collection Furnitures/Dining Sideboard Main.webp', quantity_in_stock: 5, isMain: true },
          { id: 'dr-ds-1', item_code: 'DR-DS-002', name: 'Dining Sideboard - 1', description: 'Elegant dining storage.', price: 0, category: 'Dining', image_url: '/Collection Furnitures/Dining Sideboard -1.webp', quantity_in_stock: 5 },
          { id: 'dr-ds-2', item_code: 'DR-DS-003', name: 'Dining Sideboard - 2', description: 'Modern buffet table.', price: 0, category: 'Dining', image_url: '/Collection Furnitures/Dining Sideboard -2.webp', quantity_in_stock: 5 },
          { id: 'dr-ds-3', item_code: 'DR-DS-004', name: 'Dining Sideboard - 3', description: 'Stylish sideboard for your dining area.', price: 0, category: 'Dining', image_url: '/Collection Furnitures/Dining Sideboard -3.webp', quantity_in_stock: 5 },
        ]
      },
      {
        name: 'Dining Hutch',
        items: [
          { id: 'dr-dh-main', item_code: 'DR-DH-001', name: 'Dining Hutch Main', description: 'Classic main dining hutch.', price: 0, category: 'Dining', image_url: '/Collection Furnitures/Dining Hutch Main.webp', quantity_in_stock: 5, isMain: true },
          { id: 'dr-dh-1', item_code: 'DR-DH-002', name: 'Dining Hutch - 1', description: 'Elegant display cabinet.', price: 0, category: 'Dining', image_url: '/Collection Furnitures/Dining Hutch -1.webp', quantity_in_stock: 5 },
          { id: 'dr-dh-2', item_code: 'DR-DH-003', name: 'Dining Hutch - 2', description: 'Modern hutch for your dinnerware.', price: 0, category: 'Dining', image_url: '/Collection Furnitures/Dining Hutch -2.webp', quantity_in_stock: 5 },
          { id: 'dr-dh-3', item_code: 'DR-DH-004', name: 'Dining Hutch - 3', description: 'Premium hutch design.', price: 0, category: 'Dining', image_url: '/Collection Furnitures/Dining Hutch -3.webp', quantity_in_stock: 5 },
        ]
      }
    ]
  },
  {
    category: 'Accent Furniture',
    subcategories: [
      { name: 'Diwan', items: [] },
      { name: 'Maharaja Diwan', items: [] },
      { name: 'Wall Mirrors', items: [] },
      { name: 'Wase stands', items: [] },
      { name: 'corner stands', items: [] }
    ]
  }
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const getProductImage = (product: Product | any) => {
    if (product.image_url) {
      return product.image_url;
    }
    return '/placeholder.svg';
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex flex-col w-full bg-surface-50 min-h-screen font-sans">

      {/* Editorial Header Section */}
      <section className="w-full pt-32 lg:pt-48 pb-20 px-6 lg:px-24 overflow-hidden">
        <div className="mx-auto max-w-[900px] flex flex-col lg:flex-row lg:items-end justify-between gap-12">
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
              <p className="text-surface-500 text-lg lg:text-xl leading-relaxed text-left lg:text-right text-balance mb-12">
                A curated selection of timeless pieces. Each form follows function, creating harmony in your modern living spaces.
              </p>
              
              {/* Main Navigation Buttons */}
              <div className="flex flex-wrap items-center justify-start lg:justify-end gap-3 mb-6">
                <button
                  onClick={() => {
                    setActiveCategory(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-6 py-2.5 rounded-full text-[12px] font-bold uppercase tracking-widest transition-all duration-300 ${
                    !activeCategory ? 'bg-primary-900 text-surface-50 shadow-lg' : 'bg-transparent text-surface-600 border border-surface-300 hover:border-primary-800'
                  }`}
                >
                  All
                </button>
                {collectionData.map((section) => (
                  <button
                    key={section.category}
                    onClick={() => {
                      setActiveCategory(section.category);
                    }}
                    className={`px-6 py-2.5 rounded-full text-[12px] font-bold uppercase tracking-widest transition-all duration-300 ${
                      activeCategory === section.category
                        ? 'bg-black text-surface-50 shadow-lg'
                        : 'bg-transparent text-surface-600 border border-surface-300 hover:border-primary-800 hover:text-primary-800'
                    }`}
                  >
                    {section.category}
                  </button>
                ))}
              </div>

              {/* Sub-Furniture Type Navigation */}
              {activeCategory && (
                <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2 animate-[revealUp_0.5s_ease-out]">
                  {collectionData
                    .find(c => c.category === activeCategory)
                    ?.subcategories.map((sub) => (
                      <button
                        key={sub.name}
                        onClick={() => scrollToSection(`${activeCategory}-${sub.name}`.toLowerCase().replace(/\s+/g, '-'))}
                        className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-200 text-surface-600 hover:bg-primary-800 hover:text-surface-50 transition-all duration-300"
                      >
                        {sub.name}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Categorized Product Sections */}
      <div className="flex flex-col gap-32 pb-32">
        {collectionData.map((section, sectionIdx) => (
          <section 
            key={section.category} 
            id={section.category.toLowerCase().replace(/\s+/g, '-')}
            className="w-full px-4 lg:px-24 scroll-mt-32"
          >
            <div className="mx-auto max-w-[900px]">

              <div className="flex items-center gap-6 mb-16">
                <h2 className="font-display text-4xl lg:text-5xl text-surface-900 font-light tracking-tight">
                  {section.category}
                </h2>
                <div className="flex-grow h-[1px] bg-surface-200" />
              </div>

              <div className="flex flex-col gap-24">
                {section.subcategories.map((sub, subIdx) => (
                  <div 
                    key={sub.name} 
                    id={`${section.category}-${sub.name}`.toLowerCase().replace(/\s+/g, '-')}
                    className="flex flex-col gap-10 scroll-mt-24"
                  >
                    <h3 className="text-surface-400 text-sm tracking-[0.2em] uppercase font-medium">
                      {sub.name}
                    </h3>
                    
                    {sub.items.length === 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((n) => (
                          <div key={n} className="aspect-[4/5] bg-surface-100 rounded-[2rem] border border-dashed border-surface-300 flex items-center justify-center text-surface-400 text-xs tracking-widest uppercase">
                            Coming Soon
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
                        {sub.items.map((product: any, idx) => {
                          const bg = bgColors[(sectionIdx + subIdx + idx) % bgColors.length];
                          const image = getProductImage(product);
                          // Layout logic: Main image takes 12 cols (full width), others take 4
                          const isMain = product.isMain;
                          const spanClass = isMain ? 'md:col-span-12' : 'md:col-span-4';
                          const aspectClass = isMain ? 'aspect-video' : 'aspect-square';
                          
                          // Calculate display index (e.g., 01, 02...)
                          // For a more accurate count, we'd need to flatten all items across sections, 
                          // but for visual matching we can use a relative index.
                          const displayIndex = String((sectionIdx * 5) + (subIdx * 4) + idx + 1).padStart(2, '0');

                          return (
                            <Reveal 
                              key={product.id} 
                              delay={idx * 0.1} 
                              distance="40px" 
                              className={spanClass}
                            >
                              <button
                                onClick={() => handleProductClick(product as any)}
                                className="group flex flex-col gap-5 text-left cursor-pointer w-full"
                              >
                                {/* Image Container with Precise Cutout */}
                                <div className={`relative w-full ${aspectClass} ${bg} rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover:-translate-y-3`}>
                                  
                                  {/* Top Right Category Badge */}
                                  <div className="absolute top-5 right-5 lg:top-8 lg:right-8 z-30 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-black/60 shadow-sm transition-opacity duration-500 group-hover:opacity-80">
                                    {section.category === 'Dining' ? 'TABLES' : section.category.toUpperCase()}
                                  </div>

                                  {/* Product Image with Zoom Effect - Updated to Full Cover */}
                                  <div className="absolute inset-0">
                                    <div className="relative w-full h-full transition-transform duration-[1.5s] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.1]">
                                      <Image
                                        src={image}
                                        alt={product.name}
                                        fill
                                        className="object-cover object-center"
                                      />
                                    </div>
                                  </div>

                                  {/* Inverted Corner Cutout (Bottom Left) */}
                                  <div className="absolute bottom-0 left-0 z-40 bg-surface-50 pt-5 pr-5 rounded-tr-[2.5rem] flex items-center justify-center min-w-[65px] min-h-[65px] lg:min-w-[85px] lg:min-h-[85px]">
                                    {/* The Inverted Curves */}
                                    <div className="absolute -top-6 left-0 w-6 h-6 bg-transparent rounded-bl-[1.5rem] shadow-[-10px_10px_0_10px_rgb(249,250,251)]" />
                                    <div className="absolute bottom-0 -right-6 w-6 h-6 bg-transparent rounded-bl-[1.5rem] shadow-[-10px_10px_0_10px_rgb(249,250,251)]" />
                                    
                                    <span className="font-display text-2xl lg:text-3xl text-surface-900 font-medium tracking-tight">
                                      {displayIndex}
                                    </span>
                                  </div>

                                  {/* Subtle Gradient Overlays for Depth */}
                                  <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10 opacity-40" />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-500" />
                                </div>

                                {/* Typography with Color Transition */}
                                <div className="flex flex-col gap-2 px-1 transition-transform duration-500 group-hover:translate-x-1">
                                  <h4 className="font-display text-2xl lg:text-3xl text-surface-900 font-light tracking-tight transition-colors duration-500 group-hover:text-primary-800">
                                    {product.name}
                                  </h4>
                                  <p className="text-surface-400 text-sm lg:text-base font-light leading-relaxed max-w-[90%] opacity-80 group-hover:opacity-100 transition-opacity">
                                    {product.description}
                                  </p>
                                </div>
                              </button>
                            </Reveal>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Product Inquiry Modal */}
      <ProductInquiryModal
        product={selectedProduct as any}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
