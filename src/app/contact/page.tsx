'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    requirement: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate legacy API interaction found in index-ZZxijl62.js
    try {
      // In a real scenario, this would be fetch('/api/contact', ...)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', category: '', requirement: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col w-full bg-surface-50 min-h-screen font-sans pt-[12dvh]">
      <section className="w-full py-24 px-fluid-md lg:px-fluid-lg">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col lg:flex-row gap-24">
            
            {/* Info Column */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-[1px] bg-primary-800"></span>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-surface-500">Contact / Studio Inquiry</span>
              </div>
              <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-surface-900 font-light tracking-tighter leading-none mb-12">
                Let's discuss <br />
                <span className="italic text-primary-800">Your Vision.</span>
              </h1>
              
              <div className="space-y-12">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-4">Location</h3>
                  <p className="text-xl text-surface-800 leading-relaxed font-light">
                    Premium Furniture District, <br />
                    Studio Avenue, Suite 2026
                  </p>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-4">Connect</h3>
                  <p className="text-xl text-surface-800 leading-relaxed font-light">
                    hello@thecomfortpalace.com <br />
                    +1 (800) COMFORT
                  </p>
                </div>
                <div className="pt-8 flex gap-6">
                  {['Instagram', 'Pinterest', 'LinkedIn'].map(social => (
                    <a key={social} href="#" className="text-[11px] font-bold uppercase tracking-widest text-primary-800 hover:text-surface-900 transition-colors underline underline-offset-8 decoration-primary-800/20 hover:decoration-surface-900">
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="flex-1">
              <div className="bg-white rounded-[4rem] p-10 lg:p-16 shadow-2xl border border-surface-200/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary-800/5 rounded-full blur-3xl -z-0"></div>
                
                <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Full Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-surface-900 focus:ring-2 focus:ring-primary-800/20 outline-none transition-all"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Email Address</label>
                      <input 
                        type="email" 
                        required
                        className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-surface-900 focus:ring-2 focus:ring-primary-800/20 outline-none transition-all"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Project Category</label>
                    <select 
                      className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-surface-900 focus:ring-2 focus:ring-primary-800/20 outline-none transition-all appearance-none"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="">Select a category</option>
                      <option value="residential">Residential Design</option>
                      <option value="commercial">Commercial/Office</option>
                      <option value="bespoke">Bespoke Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Technical Requirement</label>
                    <textarea 
                      rows={5}
                      required
                      className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-surface-900 focus:ring-2 focus:ring-primary-800/20 outline-none transition-all resize-none"
                      placeholder="Tell us about your space..."
                      value={formData.requirement}
                      onChange={e => setFormData({...formData, requirement: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === 'submitting'}
                    className={`w-full py-6 rounded-3xl font-bold uppercase tracking-widest transition-all duration-500 ${status === 'submitting' ? 'bg-surface-200 text-surface-400 cursor-not-allowed' : 'bg-primary-900 text-white hover:bg-surface-900 shadow-xl hover:shadow-2xl active:scale-95'}`}
                  >
                    {status === 'submitting' ? 'Sending Inquiry...' : 'Initiate Inquiry'}
                  </button>

                  {status === 'success' && (
                    <div className="text-center p-4 bg-primary-50 rounded-2xl text-primary-800 font-bold text-sm animate-bounce">
                      Inquiry Sent Successfully.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
