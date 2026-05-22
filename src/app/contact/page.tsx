'use client';

import { useState } from 'react';
import Reveal from '@/components/motion/Reveal';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requirement: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          requirement: formData.requirement
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', requirement: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex flex-col w-full bg-surface-50 min-h-screen font-sans pt-[12dvh]">
      <section className="w-full py-24 px-fluid-md lg:px-fluid-lg">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col lg:flex-row gap-24">
            
            {/* Info Column */}
            <Reveal direction="right" once={true} delay={0.2} distance="80px" className="flex-1">
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-12 h-[1px] bg-primary-800"></span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-surface-500">Contact / Studio Inquiry</span>
                </div>
                <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-surface-900 font-light tracking-tighter leading-none mb-12">
                  Let&apos;s discuss <br />
                  <span className="italic text-primary-800">Your Vision.</span>
                </h1>
                
                <div className="space-y-12">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-4">Location</h3>
                    <a
                      href="https://maps.app.goo.gl/RkitTbxxBiCZ5ZZz5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl text-primary-800 leading-relaxed font-light hover:text-surface-900 transition-colors underline underline-offset-4 decoration-primary-800/30 hover:decoration-surface-900"
                    >
                      View Our Location <br />
                      on Google Maps ↗
                    </a>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-4">Connect</h3>
                    <div className="text-xl text-surface-800 leading-relaxed font-light space-y-2">
                      <a href="mailto:thecomfortpalace123@gmail.com" className="block text-primary-800 hover:text-surface-900 transition-colors">
                        thecomfortpalace123@gmail.com
                      </a>
                      <a href="tel:+919591488660" className="block hover:text-primary-800 transition-colors">
                        +91 95914 88660
                      </a>
                    </div>
                  </div>
                  <div className="pt-8 flex items-center gap-4">
                    {/* Instagram */}
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full border border-surface-200 flex items-center justify-center text-surface-500 hover:text-primary-800 hover:border-primary-800/40 transition-all duration-300 hover:scale-110">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <circle cx="12" cy="12" r="4"/>
                        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                      </svg>
                    </a>
                    {/* X / Twitter */}
                    <a href="https://www.x.com" target="_blank" rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full border border-surface-200 flex items-center justify-center text-surface-500 hover:text-primary-800 hover:border-primary-800/40 transition-all duration-300 hover:scale-110">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.734-8.835L2.25 2.25h6.775l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                    {/* Facebook */}
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full border border-surface-200 flex items-center justify-center text-surface-500 hover:text-primary-800 hover:border-primary-800/40 transition-all duration-300 hover:scale-110">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                      </svg>
                    </a>
                    {/* LinkedIn */}
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full border border-surface-200 flex items-center justify-center text-surface-500 hover:text-primary-800 hover:border-primary-800/40 transition-all duration-300 hover:scale-110">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
                        <rect x="2" y="9" width="4" height="12"/>
                        <circle cx="4" cy="4" r="2"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Form Column */}
            <Reveal direction="left" once={true} delay={0.4} distance="80px" className="flex-1">
              <div className="bg-surface-50 rounded-[4rem] p-10 lg:p-16 shadow-2xl border border-surface-200/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary-800/5 rounded-full blur-3xl -z-0"></div>
                
                {status === 'success' ? (
                  <div className="relative z-10 flex flex-col items-center justify-center text-center py-16">
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="oklch(var(--color-primary-800))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-display font-light text-surface-900 mb-3 tracking-tight">
                      Inquiry Sent Successfully
                    </h3>
                    <p className="text-surface-500 max-w-sm leading-relaxed mb-8">
                      Thank you for reaching out. Our design team will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="btn-apex bg-primary-800 text-surface-50 hover:bg-surface-900 px-8 py-3 text-[10px]"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Full Name</label>
                        <input 
                          type="text" 
                          required
                          className="w-full bg-surface-100 border border-surface-200/80 rounded-2xl px-6 py-4 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all"
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
                          className="w-full bg-surface-100 border border-surface-200/80 rounded-2xl px-6 py-4 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        className="w-full bg-surface-100 border border-surface-200/80 rounded-2xl px-6 py-4 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all"
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Your Requirement</label>
                      <textarea 
                        rows={5}
                        required
                        className="w-full bg-surface-100 border border-surface-200/80 rounded-2xl px-6 py-4 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none"
                        placeholder="Tell us about your space, preferred furniture styles, dimensions..."
                        value={formData.requirement}
                        onChange={e => setFormData({...formData, requirement: e.target.value})}
                      ></textarea>
                    </div>

                    {status === 'error' && (
                      <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        {errorMsg}
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={status === 'submitting'}
                      className={`w-full py-6 rounded-3xl font-bold uppercase tracking-widest transition-all duration-500 ${status === 'submitting' ? 'bg-surface-200 text-surface-400 cursor-not-allowed' : 'bg-primary-900 text-surface-50 hover:bg-primary-600 dark:bg-primary-100 dark:text-surface-900 dark:hover:bg-primary-200 shadow-xl hover:shadow-2xl active:scale-95'}`}
                    >
                      {status === 'submitting' ? (
                        <span className="flex items-center justify-center gap-3">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending Inquiry...
                        </span>
                      ) : (
                        'Initiate Inquiry'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full pb-24 px-fluid-md lg:px-fluid-lg">
        <div className="mx-auto max-w-[1400px]">
          <Reveal delay={0.2} direction="up" distance="40px">
            <div className="relative w-full h-[450px] rounded-[3rem] lg:rounded-[4rem] overflow-hidden border border-surface-200/60 shadow-2xl group">
               {/* Google Maps iframe */}
               <iframe
                 src="https://maps.google.com/maps?q=12.9716,77.5946&z=15&output=embed"
                 width="100%"
                 height="100%"
                 style={{ border: 0, filter: 'grayscale(20%) contrast(1.05)' }}
                 allowFullScreen
                 loading="lazy"
                 referrerPolicy="no-referrer-when-downgrade"
                 title="Comfort Palace Location"
               />

               {/* Overlay CTA */}
               <div className="absolute inset-0 flex items-end justify-center pb-8 pointer-events-none">
                 <a
                   href="https://maps.app.goo.gl/RkitTbxxBiCZ5ZZz5"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="pointer-events-auto flex items-center gap-3 bg-surface-50/95 backdrop-blur-md border border-surface-200/80 shadow-2xl px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest text-primary-800 hover:bg-primary-800 hover:text-surface-50 transition-all duration-300 group-hover:scale-105"
                 >
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                     <circle cx="12" cy="10" r="3" />
                   </svg>
                   Open in Google Maps
                 </a>
               </div>

               {/* Decorative Corner Elements */}
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-800/5 rounded-full blur-3xl pointer-events-none"></div>
               <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary-800/5 rounded-full blur-2xl pointer-events-none"></div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
