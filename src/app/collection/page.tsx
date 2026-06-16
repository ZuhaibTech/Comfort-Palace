'use client';
import { useState, useEffect } from 'react';
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
          { id: 'lr-cd-main', item_code: 'LR-CD-001', name: 'Chest of Drawers Main', description: 'Spacious main chest drawers.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/Chest Drawers main.webp', quantity_in_stock: 5, isMain: true },
          { id: 'lr-cd-1', item_code: 'LR-CD-002', name: 'Chest Drawers - 1', description: 'Classic chest of drawers.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/Chest Drawers -1.webp', quantity_in_stock: 5 },
          { id: 'lr-cd-2', item_code: 'LR-CD-003', name: 'Chest Drawers - 2', description: 'Modern storage solution.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/Chest Drawers -2.webp', quantity_in_stock: 5 },
          { id: 'lr-cd-3', item_code: 'LR-CD-004', name: 'Chest Drawers - 3', description: 'Elegant chest for your living area.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/Chest Drawers -3.webp', quantity_in_stock: 5 },
        ]
      },
      {
        name: 'Consoles',
        items: [
          { id: 'lr-con-main', item_code: 'LR-CON-001', name: 'Console Main', description: 'Sophisticated main console table.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/wall console table Main.webp', quantity_in_stock: 5, isMain: true },
          { id: 'lr-con-1', item_code: 'LR-CON-002', name: 'Console - 1', description: 'Sleek wall console table.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/wall console table -1.webp', quantity_in_stock: 5 },
          { id: 'lr-con-2', item_code: 'LR-CON-003', name: 'Console - 2', description: 'Functional and stylish console.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/wall console table -4.webp', quantity_in_stock: 5 },
          { id: 'lr-con-3', item_code: 'LR-CON-004', name: 'Console - 3', description: 'Artistic console for your hallway.', price: 0, category: 'Living Room', image_url: '/Collection Furnitures/wall console table -3.webp', quantity_in_stock: 5 },
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
          { id: 'br-wd-2', item_code: 'BR-WD-003', name: 'Wardrobe - 2', description: 'Elegant storage for your clothes.', price: 0, category: 'Bed Room', image_url: '/Collection Furnitures/Bed Wardrobe -4.webp', quantity_in_stock: 5 },
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
      {
        name: 'Diwan',
        items: [
          { id: 'af-dw-main', item_code: 'AF-DW-001', name: 'Premium Diwan Main', description: 'Majestic diwan for royal comfort.', price: 0, category: 'Accent Furniture', image_url: '/Collection Furnitures/A Diwan Main.webp', quantity_in_stock: 5, isMain: true },
          { id: 'af-dw-1', item_code: 'AF-DW-002', name: 'Accent Diwan - 1', description: 'Elegant diwan with intricate carvings.', price: 0, category: 'Accent Furniture', image_url: '/Collection Furnitures/A Diwan -1.webp', quantity_in_stock: 5 },
          { id: 'af-dw-2', item_code: 'AF-DW-003', name: 'Accent Diwan - 2', description: 'Modern take on traditional diwan design.', price: 0, category: 'Accent Furniture', image_url: '/Collection Furnitures/A Diwan -2.webp', quantity_in_stock: 5 },
          { id: 'af-dw-3', item_code: 'AF-DW-004', name: 'Accent Diwan - 3', description: 'Comfortable diwan for your living space.', price: 0, category: 'Accent Furniture', image_url: '/Collection Furnitures/A Diwan -3.webp', quantity_in_stock: 5 },
        ]
      },
      {
        name: 'Maharaja Diwan',
        items: [
          { id: 'af-mdw-main', item_code: 'AF-MDW-001', name: 'Maharaja Diwan Main', description: 'The ultimate royal diwan experience.', price: 0, category: 'Accent Furniture', image_url: '/Collection Furnitures/A Maharaja Diwan Main.webp', quantity_in_stock: 5, isMain: true },
          { id: 'af-mdw-1', item_code: 'AF-MDW-002', name: 'Maharaja Diwan - 1', description: 'Handcrafted luxury Maharaja diwan.', price: 0, category: 'Accent Furniture', image_url: '/Collection Furnitures/A Maharaja Diwan -1.webp', quantity_in_stock: 5 },
          { id: 'af-mdw-2', item_code: 'AF-MDW-003', name: 'Maharaja Diwan - 2', description: 'Classic Maharaja style with modern comfort.', price: 0, category: 'Accent Furniture', image_url: '/Collection Furnitures/A Maharaja Diwan -2.webp', quantity_in_stock: 5 },
          { id: 'af-mdw-3', item_code: 'AF-MDW-004', name: 'Maharaja Diwan - 3', description: 'Ornate Maharaja diwan for grand interiors.', price: 0, category: 'Accent Furniture', image_url: '/Collection Furnitures/A Maharaja Diwan -3.webp', quantity_in_stock: 5 },
        ]
      },
      {
        name: 'Wall Mirrors',
        items: [
          { id: 'af-wm-main', item_code: 'AF-WM-001', name: 'Wall Mirror Main', description: 'Grand statement wall mirror.', price: 0, category: 'Accent Furniture', image_url: '/Collection Furnitures/A Wall Mirror Mirror.webp', quantity_in_stock: 5, isMain: true },
          { id: 'af-wm-1', item_code: 'AF-WM-002', name: 'Wall Mirror - 1', description: 'Elegant framed wall mirror.', price: 0, category: 'Accent Furniture', image_url: '/Collection Furnitures/A Wall Mirror -1.webp', quantity_in_stock: 5 },
          { id: 'af-wm-2', item_code: 'AF-WM-003', name: 'Wall Mirror - 2', description: 'Contemporary wall mirror design.', price: 0, category: 'Accent Furniture', image_url: '/Collection Furnitures/A Wall Mirror -2.webp', quantity_in_stock: 5 },
          { id: 'af-wm-3', item_code: 'AF-WM-004', name: 'Wall Mirror - 3', description: 'Minimalist wall mirror for any room.', price: 0, category: 'Accent Furniture', image_url: '/Collection Furnitures/A Wall Mirror -3.webp', quantity_in_stock: 5 },
        ]
      },
      {
        name: 'Waave Stands',
        items: [
          { id: 'af-ws-main', item_code: 'AF-WS-001', name: 'Waave Stand Main', description: 'Sculptural waave stand for your accents.', price: 0, category: 'Accent Furniture', image_url: '/Collection Furnitures/A Waave Stands Main.webp', quantity_in_stock: 5, isMain: true },
          { id: 'af-ws-1', item_code: 'AF-WS-002', name: 'Waave Stand - 1', description: 'Modern waave stand design.', price: 0, category: 'Accent Furniture', image_url: '/Collection Furnitures/A Waave Stands -1.webp', quantity_in_stock: 5 },
          { id: 'af-ws-2', item_code: 'AF-WS-003', name: 'Waave Stand - 2', description: 'Elegant waave stand for display.', price: 0, category: 'Accent Furniture', image_url: '/Collection Furnitures/A Waave Stands -2.webp', quantity_in_stock: 5 },
          { id: 'af-ws-3', item_code: 'AF-WS-004', name: 'Waave Stand - 3', description: 'Minimalist waave stand accent.', price: 0, category: 'Accent Furniture', image_url: '/Collection Furnitures/A Waave Stands -3.webp', quantity_in_stock: 5 },
        ]
      },
      {
        name: 'Corner Stands',
        items: [
          { id: 'af-cs-main', item_code: 'AF-CS-001', name: 'Signature Corner Stand', description: 'Exquisite corner stand for display.', price: 0, category: 'Accent Furniture', image_url: '/Collection Furnitures/A Corner Stands Main.webp', quantity_in_stock: 5, isMain: true },
          { id: 'af-cs-1', item_code: 'AF-CS-002', name: 'Corner Stand - 1', description: 'Sleek corner display stand.', price: 0, category: 'Accent Furniture', image_url: '/Collection Furnitures/A Corner Stands -1.webp', quantity_in_stock: 5 },
          { id: 'af-cs-2', item_code: 'AF-CS-003', name: 'Corner Stand - 2', description: 'Traditional corner stand craftsmanship.', price: 0, category: 'Accent Furniture', image_url: '/Collection Furnitures/A Corner Stands -2.webp', quantity_in_stock: 5 },
          { id: 'af-cs-3', item_code: 'AF-CS-004', name: 'Corner Stand - 3', description: 'Modern corner storage solution.', price: 0, category: 'Accent Furniture', image_url: '/Collection Furnitures/A Corner Stands -3.webp', quantity_in_stock: 5 },
        ]
      }
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
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll listener for "Back to Top" button
  useEffect(() => {
    const handleScroll = () => {
      // Use both window.scrollY and documentElement.scrollTop for maximum compatibility
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const getAbsoluteIndex = (sectionIdx: number, subIdx: number, itemIdx: number) => {
    let count = 0;
    for (let i = 0; i < sectionIdx; i++) {
      collectionData[i].subcategories.forEach(sub => count += sub.items.length);
    }
    for (let i = 0; i < subIdx; i++) {
      count += collectionData[sectionIdx].subcategories[i].items.length;
    }
    return count + itemIdx + 1;
  };

  return (
    <div className="flex flex-col w-full bg-surface-50 min-h-screen font-sans selection:bg-primary-900 selection:text-white">

      {/* Extreme Luxury Background Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary-100/20 blur-[150px] rounded-full animate-[spin_30s_linear_infinite]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-surface-200/40 blur-[120px] rounded-full animate-[spin_25s_linear_infinite_reverse]" />
        <div className="absolute top-[20%] right-[10%] w-px h-full bg-gradient-to-b from-transparent via-surface-900/5 to-transparent" />
      </div>

      {/* Editorial Header Section */}
      <section className="relative w-full pt-20 lg:pt-28 pb-16 px-6 lg:px-24 overflow-hidden z-10">
        <div className="mx-auto max-w-[1100px] flex flex-col lg:flex-row lg:items-end justify-between gap-12 lg:gap-20">
          <Reveal direction="right" once={true} delay={0.2} distance="100px">
            <div className="max-w-4xl">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-16 h-px bg-surface-900/40" />
                <span className="text-[10px] font-black tracking-[0.5em] text-surface-900 uppercase">Est. 2026 / Global Archive</span>
              </div>
              <h1 className="font-display text-8xl lg:text-[9.5rem] text-surface-900 font-light tracking-[-0.04em] leading-[0.8] whitespace-nowrap">
                The Master <br />
                <span className="relative inline-block overflow-hidden">
                  <span className="italic font-serif opacity-10 hover:opacity-100 transition-all duration-[2s] cursor-default">Collection.</span>
                </span>
              </h1>
            </div>
          </Reveal>

          <Reveal direction="left" once={true} delay={0.4} distance="100px">
            <div className="flex flex-col items-start lg:items-end w-full lg:w-[480px] shrink-0">
              <div className="relative mb-6">
                <p className="text-surface-500 text-base lg:text-lg font-light leading-relaxed text-center lg:text-right">
                  A curated selection of timeless pieces.<br className="hidden lg:block" />
                  Each form follows function, creating<br className="hidden lg:block" />
                  harmony in your modern living spaces.
                </p>
              </div>

              {/* Main Navigation - Extreme Glassmorphism */}
              <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 mb-10 w-full lg:w-[420px]">
                <button
                  onClick={() => {
                    setActiveCategory(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`group relative px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-700 ${!activeCategory
                    ? 'bg-surface-900 text-surface-50 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)]'
                    : 'bg-surface-100 text-surface-900 border border-surface-200 hover:bg-surface-200'
                    }`}
                >
                  <span className="relative z-10">All</span>
                  {!activeCategory && <div className="absolute inset-0 bg-primary-900 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700" />}
                </button>
                {collectionData.map((section) => (
                  <button
                    key={section.category}
                    onClick={() => {
                      setActiveCategory(section.category);
                    }}
                    className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-700 ${activeCategory === section.category
                      ? 'bg-surface-900 text-surface-50 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)]'
                      : 'bg-surface-100 text-surface-900 border border-surface-200 hover:bg-surface-200'
                      }`}
                  >
                    {section.category}
                  </button>
                ))}
              </div>

              {/* Sub-Furniture Pill Strip - Liquid Reveal */}
              {activeCategory && (
                <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2.5 animate-[revealUp_0.8s_cubic-bezier(0.16,1,0.3,1)]">
                  {collectionData
                    .find(c => c.category === activeCategory)
                    ?.subcategories.map((sub) => (
                      <button
                        key={sub.name}
                        onClick={() => scrollToSection(`${activeCategory}-${sub.name}`.toLowerCase().replace(/\s+/g, '-'))}
                        className="px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.25em] bg-surface-100 text-surface-900 border border-surface-200 hover:bg-surface-200 transition-all duration-500"
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
      <div className="relative flex flex-col gap-56 pb-64 z-10">
        {collectionData.map((section, sectionIdx) => (
          <section
            key={section.category}
            id={section.category.toLowerCase().replace(/\s+/g, '-')}
            className="w-full px-4 lg:px-24 scroll-mt-32"
          >
            <div className="mx-auto max-w-[900px]">

              <div className="flex flex-col gap-6 mb-24 group/section">
                <div className="flex items-center gap-10">
                  <span className="font-serif text-6xl text-surface-900/10 transition-colors duration-1000 group-hover/section:text-surface-900/20 italic">0{sectionIdx + 1}</span>
                  <h2 className="font-display text-6xl lg:text-7xl text-surface-900 font-light tracking-[-0.05em] transition-transform duration-1000 group-hover/section:translate-x-4">
                    {section.category}
                  </h2>
                </div>
                <div className="w-full h-px bg-gradient-to-r from-surface-900/10 via-surface-900/5 to-transparent" />
              </div>

              <div className="flex flex-col gap-48">
                {section.subcategories.map((sub, subIdx) => (
                  <div
                    key={sub.name}
                    id={`${section.category}-${sub.name}`.toLowerCase().replace(/\s+/g, '-')}
                    className="flex flex-col gap-16 scroll-mt-24 group/sub"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-2 h-2 rounded-full bg-surface-900/20 group-hover/sub:bg-primary-900 transition-colors duration-700" />
                        <h3 className="text-surface-900 text-[12px] tracking-[0.4em] uppercase font-black">
                          {sub.name}
                        </h3>
                      </div>
                      <span className="text-[10px] text-surface-900/20 font-mono tracking-widest">SUB-SECTION_{subIdx + 1}</span>
                    </div>

                    {sub.items.length === 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[1, 2, 3].map((n) => (
                          <div key={n} className="aspect-square bg-[#f5f5f5] rounded-[4rem] border border-black/[0.03] flex flex-col items-center justify-center gap-6 group/placeholder transition-all duration-1000 hover:bg-white hover:shadow-2xl">
                            <div className="w-12 h-[1px] bg-black/10 group-hover/placeholder:w-20 group-hover/placeholder:bg-primary-900 transition-all duration-1000" />
                            <span className="text-[10px] tracking-[0.4em] uppercase font-black text-black/20 group-hover/placeholder:text-black transition-colors duration-700">Coming Soon</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">
                        {sub.items.map((product: any, idx) => {
                          const bg = bgColors[(sectionIdx + subIdx + idx) % bgColors.length];
                          const image = getProductImage(product);
                          const isMain = product.isMain;
                          const spanClass = isMain ? 'md:col-span-12' : 'md:col-span-4';
                          const aspectClass = isMain ? 'aspect-video' : 'aspect-square';
                          const displayIndex = String(getAbsoluteIndex(sectionIdx, subIdx, idx)).padStart(2, '0');

                          return (
                            <Reveal
                              key={product.id}
                              delay={idx * 0.1}
                              distance="80px"
                              className={spanClass}
                            >
                              <button
                                onClick={() => handleProductClick(product as any)}
                                className="group flex flex-col gap-10 text-left cursor-pointer w-full"
                              >
                                {/* Extreme Product Container */}
                                <div className={`relative w-full ${aspectClass} ${bg} ${isMain ? 'rounded-[4rem] lg:rounded-[5rem]' : 'rounded-[1.5rem] lg:rounded-[2rem]'} overflow-hidden transition-all duration-[1.5s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:shadow-[0_60px_100px_-30px_rgba(0,0,0,0.2)] group-hover:-translate-y-6`}>

                                  {/* Apex Floating Badge */}
                                  <div className={`absolute z-30 bg-[#111] rounded-full font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all duration-700 group-hover:scale-110 group-hover:bg-white group-hover:text-black ${isMain
                                    ? 'top-6 right-6 lg:top-8 lg:right-8 px-4 py-1.5 text-[8px]'
                                    : 'top-2 right-3 lg:top-3 lg:right-4 px-3 py-1 text-[6px] lg:text-[7px]'
                                    }`}>
                                    {section.category === 'Dining' ? 'TABLES' : section.category.toUpperCase()}
                                  </div>

                                  {/* Fluid Product Image */}
                                  <div className="absolute inset-0">
                                    <div className="relative w-full h-full transition-transform duration-[3s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-[1.18]">
                                      <Image
                                        src={image}
                                        alt={product.name}
                                        fill
                                        className="object-cover object-center transition-all duration-[2s] grayscale-[0.4] group-hover:grayscale-0 contrast-[1.1]"
                                      />
                                    </div>
                                  </div>

                                  {/* Base Overlay for Text Legibility */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-20 pointer-events-none transition-opacity duration-1000 group-hover:opacity-70" />

                                  {/* Floating Number */}
                                  <div className={`absolute z-40 transition-all duration-700 ${isMain ? 'bottom-8 left-8 lg:bottom-10 lg:left-10' : 'bottom-6 left-6 lg:bottom-8 lg:left-8'
                                    }`}>
                                    <span className={`font-display font-light tracking-tighter text-white drop-shadow-md opacity-90 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110 ${isMain ? 'text-4xl lg:text-5xl' : 'text-2xl lg:text-3xl'
                                      }`}>
                                      {displayIndex}
                                    </span>
                                  </div>

                                  {/* Dynamic Light Overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 opacity-30 group-hover:opacity-60 transition-opacity duration-1000 z-30 pointer-events-none" />
                                </div>

                                {/* Luxury Typography Block */}
                                <div className="flex flex-col gap-4 px-4 transition-all duration-1000 group-hover:translate-x-4">
                                  <div className="flex items-center gap-5 w-full overflow-hidden">
                                    <h4 className="font-display text-2xl lg:text-3xl text-surface-900 font-light tracking-tighter truncate transition-all duration-700 group-hover:text-primary-800">
                                      {product.name}
                                    </h4>
                                    <div className="flex-grow h-px bg-surface-900/5 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-1000 delay-100" />
                                  </div>
                                  <p className="text-surface-500 text-sm lg:text-base font-light leading-relaxed max-w-[90%] opacity-40 group-hover:opacity-100 transition-all duration-1000">
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

      {/* Extreme Floating Navigation Anchor */}
      <div className={`fixed bottom-8 right-8 lg:bottom-12 lg:right-12 z-[9999] transition-all duration-[1.2s] cubic-bezier(0.16, 1, 0.3, 1) ${showScrollTop ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-32 scale-50 pointer-events-none'
        }`}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group relative w-14 h-14 rounded-full bg-transparent border border-surface-900 text-surface-900 flex items-center justify-center transition-all duration-700 hover:scale-110 active:scale-90 hover:bg-surface-900 hover:text-surface-50"
          aria-label="Back to Top"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-500 group-hover:-translate-y-1"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
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
