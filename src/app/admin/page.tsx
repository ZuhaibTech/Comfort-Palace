'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';

type Tab = 'inventory' | 'sales' | 'feedback' | 'system';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>('inventory');
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'inventory') {
        const res = await fetch('/api/products');
        const json = await res.json();
        setProducts(json.data || []);
      } else if (activeTab === 'sales') {
        const res = await fetch('/api/sales');
        const json = await res.json();
        setSales(json.data || []);
      } else if (activeTab === 'feedback') {
        const res = await fetch('/api/testimonials');
        const json = await res.json();
        setTestimonials(json.data || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-surface-50 min-h-screen font-sans pt-[12dvh]">
      
      {/* 1. ADMIN HEADER */}
      <section className="w-full py-fluid-md px-fluid-md lg:px-fluid-lg bg-surface-900 border-b border-white/5">
        <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row justify-between items-start md:items-center gap-fluid-xs">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary-400 mb-2">
              <span>Apex / Control</span>
              <span>/</span>
              <span className="text-white">v4.0.0</span>
            </div>
            <h1 className="text-fluid-2xl font-display font-light text-white tracking-tighter">System Orchestration</h1>
          </div>
          
          <div className="flex gap-fluid-3xs">
             <div className="glass-dark px-4 py-2 rounded-fluid-3xs border border-white/10 flex flex-col">
               <span className="text-[8px] font-bold uppercase tracking-widest text-surface-400">System Load</span>
               <span className="text-fluid-xs text-primary-400 font-technical">0.042 ms</span>
             </div>
             <div className="glass-dark px-4 py-2 rounded-fluid-3xs border border-white/10 flex flex-col">
               <span className="text-[8px] font-bold uppercase tracking-widest text-surface-400">Database</span>
               <span className="text-fluid-xs text-green-400 font-technical">Encrypted</span>
             </div>
          </div>
        </div>
      </section>

      {/* 2. TAB NAVIGATION */}
      <section className="w-full bg-white border-b border-surface-200/40 px-fluid-md lg:px-fluid-lg">
        <div className="mx-auto max-w-[1400px] flex gap-fluid-md">
          {[
            { id: 'inventory', label: 'Inventory / Units' },
            { id: 'sales', label: 'Sales / Revenue' },
            { id: 'feedback', label: 'Feedback / Signals' },
            { id: 'system', label: 'System / Core' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`py-6 text-[10px] font-bold uppercase tracking-[0.3em] transition-all relative ${activeTab === tab.id ? 'text-primary-800' : 'text-surface-400 hover:text-surface-900'}`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary-800"></div>}
            </button>
          ))}
        </div>
      </section>

      {/* 3. MODULE RENDERER */}
      <main className="flex-1 w-full py-fluid-lg px-fluid-md lg:px-fluid-lg">
        <div className="mx-auto max-w-[1400px]">
          
          {loading ? (
             <div className="w-full h-96 flex items-center justify-center">
               <div className="flex gap-1">
                 {[1,2,3].map(i => <div key={i} className="w-1.5 h-8 bg-primary-800 animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>)}
               </div>
             </div>
          ) : (
            <div className="reveal-up">
              {activeTab === 'inventory' && (
                <div className="space-y-fluid-md">
                  <div className="flex justify-between items-end border-b border-surface-200 pb-fluid-xs">
                    <h2 className="text-fluid-lg font-display font-light text-surface-900">Inventory Units</h2>
                    <button className="btn-apex-primary py-2 px-6 text-[9px]">Add Unit +</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="text-left border-b border-surface-200">
                          <th className="py-4 text-[9px] font-bold uppercase tracking-widest text-surface-400">ID / Code</th>
                          <th className="py-4 text-[9px] font-bold uppercase tracking-widest text-surface-400">Unit Name</th>
                          <th className="py-4 text-[9px] font-bold uppercase tracking-widest text-surface-400">Category</th>
                          <th className="py-4 text-[9px] font-bold uppercase tracking-widest text-surface-400 text-right">Value</th>
                          <th className="py-4 text-[9px] font-bold uppercase tracking-widest text-surface-400 text-right">Stock</th>
                          <th className="py-4 text-[9px] font-bold uppercase tracking-widest text-surface-400 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p: any) => (
                          <tr key={p.id} className="border-b border-surface-100 hover:bg-surface-100 transition-colors group">
                            <td className="py-4 text-fluid-xs font-technical text-surface-400">{p.item_code}</td>
                            <td className="py-4 text-fluid-xs font-bold text-surface-900">{p.name}</td>
                            <td className="py-4 text-fluid-xs text-surface-500">{p.category || 'N/A'}</td>
                            <td className="py-4 text-fluid-xs text-right font-display text-surface-900">${p.price.toLocaleString()}</td>
                            <td className="py-4 text-right">
                               <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${p.quantity_in_stock < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                 {p.quantity_in_stock}
                               </span>
                            </td>
                            <td className="py-4 text-right">
                              <button className="text-[10px] font-bold text-primary-800 hover:underline">Edit</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'sales' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-fluid-md">
                   {[
                     { label: 'Total Volume', value: `$${sales.reduce((acc: number, s: any) => acc + s.total_amount, 0).toLocaleString()}`, color: 'text-primary-800' },
                     { label: 'Units Transacted', value: sales.length, color: 'text-surface-900' },
                     { label: 'Pending Logistics', value: '04', color: 'text-accent-600' }
                   ].map((stat, i) => (
                     <div key={i} className="bg-white p-fluid-md rounded-fluid-sm border border-surface-200 shadow-sm">
                       <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-400 mb-2 block">{stat.label}</span>
                       <span className={`text-fluid-xl font-display font-light ${stat.color}`}>{stat.value}</span>
                     </div>
                   ))}
                   <div className="md:col-span-3 bg-white p-fluid-md rounded-fluid-sm border border-surface-200">
                      <p className="text-surface-400 text-center py-20 italic">Global sales visualization module initializing...</p>
                   </div>
                </div>
              )}

              {activeTab === 'feedback' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-sm">
                  {testimonials.map((t: any) => (
                    <div key={t.id} className="bg-white p-fluid-sm rounded-fluid-sm border border-surface-200 flex gap-fluid-xs">
                      <div className="w-12 h-12 bg-surface-100 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                         <div className="flex justify-between">
                           <h4 className="text-fluid-xs font-bold text-surface-900">{t.name}</h4>
                           <span className="text-[8px] font-bold uppercase text-primary-800">{t.role}</span>
                         </div>
                         <p className="text-fluid-xs text-surface-500 mt-2 italic leading-relaxed">"{t.content}"</p>
                         <div className="mt-4 flex gap-4">
                           <button className="text-[9px] font-bold uppercase tracking-widest text-green-600">Approve</button>
                           <button className="text-[9px] font-bold uppercase tracking-widest text-red-400">Discard</button>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'system' && (
                <div className="max-w-2xl mx-auto space-y-fluid-md">
                   <div className="glass-light p-fluid-md rounded-fluid-md border border-surface-200">
                      <h3 className="text-fluid-base font-display font-light text-surface-900 mb-4">Core Encryption Status</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-surface-100">
                           <span className="text-[10px] font-bold uppercase text-surface-400">API Access</span>
                           <span className="text-[10px] font-bold text-green-500 uppercase">Operational</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-surface-100">
                           <span className="text-[10px] font-bold uppercase text-surface-400">SSL Termination</span>
                           <span className="text-[10px] font-bold text-green-500 uppercase">Active</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-surface-100">
                           <span className="text-[10px] font-bold uppercase text-surface-400">Database Mirroring</span>
                           <span className="text-[10px] font-bold text-primary-800 uppercase">Scheduled</span>
                        </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
