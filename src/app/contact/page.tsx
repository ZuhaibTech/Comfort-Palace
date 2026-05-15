'use client';

import { useState } from 'react';

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
            <div className="flex-1">
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
                      className="btn-apex bg-primary-800 text-white hover:bg-surface-900 px-8 py-3 text-[10px]"
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
                      <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-surface-900 focus:ring-2 focus:ring-primary-800/20 outline-none transition-all"
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
                        className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-surface-900 focus:ring-2 focus:ring-primary-800/20 outline-none transition-all resize-none"
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
                      className={`w-full py-6 rounded-3xl font-bold uppercase tracking-widest transition-all duration-500 ${status === 'submitting' ? 'bg-surface-200 text-surface-400 cursor-not-allowed' : 'bg-primary-900 text-white hover:bg-surface-900 shadow-xl hover:shadow-2xl active:scale-95'}`}
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
