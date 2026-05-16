'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

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

interface ProductInquiryModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductInquiryModal({ product, isOpen, onClose }: ProductInquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    requirement: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);

  // Reset form when modal opens with a new product
  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        name: '',
        phone: '',
        email: '',
        requirement: `I'm interested in: ${product.name} (${product.item_code})`
      });
      setStatus('idle');
      setErrorMsg('');
    }
  }, [isOpen, product]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

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
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setStatus('success');
      setFormData({ name: '', phone: '', email: '', requirement: '' });

      // Auto-close after 3 seconds on success
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  if (!isOpen || !product) return null;

  const productImage = product.image_url
    ? (product.image_url.startsWith('/') ? product.image_url : `/uploads/${product.image_url}`)
    : '/images/Sofa.jpg';

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative w-full max-w-[1000px] max-h-[90vh] bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-[revealUp_0.5s_ease-out_forwards]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-surface-100 hover:bg-surface-200 transition-colors text-surface-600 hover:text-surface-900"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="2" y1="2" x2="14" y2="14" />
            <line x1="14" y1="2" x2="2" y2="14" />
          </svg>
        </button>

        {/* Left: Product Preview */}
        <div className="w-full md:w-5/12 bg-surface-100 relative min-h-[200px] md:min-h-[600px] flex-shrink-0">
          <div className="relative w-full h-full min-h-[250px]">
            <Image
              src={productImage}
              alt={product.name}
              fill
              className="object-cover"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Product Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/70 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                {product.category || 'Furniture'}
              </span>
              {product.quantity_in_stock > 0 ? (
                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/20 backdrop-blur-md px-3 py-1 rounded-full">
                  In Stock
                </span>
              ) : (
                <span className="text-[9px] font-bold uppercase tracking-widest text-red-300 bg-red-500/20 backdrop-blur-md px-3 py-1 rounded-full">
                  Made to Order
                </span>
              )}
            </div>
            <h3 className="text-white text-xl md:text-2xl font-display font-light tracking-tight mb-1">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-3">
              <span className="text-white/50 text-xs font-bold uppercase tracking-widest">
                {product.item_code}
              </span>
            </div>
            {product.description && (
              <p className="text-white/60 text-sm mt-3 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>
        </div>

        {/* Right: Inquiry Form */}
        <div className="w-full md:w-7/12 p-6 md:p-10 lg:p-12 overflow-y-auto">
          {status === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 md:py-0">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="oklch(var(--color-primary-800))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-light text-surface-900 mb-3 tracking-tight">
                Inquiry Sent Successfully
              </h3>
              <p className="text-surface-500 max-w-sm leading-relaxed">
                Thank you for your interest in <strong className="text-surface-700">{product.name}</strong>. Our team will reach out to you shortly.
              </p>
              <button
                onClick={onClose}
                className="mt-8 btn-apex bg-primary-800 text-white hover:bg-surface-900 px-8 py-3 text-[10px]"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-[1px] bg-primary-800" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-surface-400">
                    Product Inquiry
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-light text-surface-900 tracking-tight leading-tight">
                  Interested in this <span className="italic text-primary-800">piece?</span>
                </h2>
                <p className="text-surface-400 text-sm mt-2 leading-relaxed">
                  Fill in your details and we'll get back to you with pricing, availability, and delivery options.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-surface-50 border border-surface-200 rounded-xl px-5 py-3.5 text-surface-900 text-sm focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/30 outline-none transition-all placeholder:text-surface-300"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full bg-surface-50 border border-surface-200 rounded-xl px-5 py-3.5 text-surface-900 text-sm focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/30 outline-none transition-all placeholder:text-surface-300"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full bg-surface-50 border border-surface-200 rounded-xl px-5 py-3.5 text-surface-900 text-sm focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/30 outline-none transition-all placeholder:text-surface-300"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400">
                    Your Requirement *
                  </label>
                  <textarea
                    rows={4}
                    required
                    className="w-full bg-surface-50 border border-surface-200 rounded-xl px-5 py-3.5 text-surface-900 text-sm focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/30 outline-none transition-all resize-none placeholder:text-surface-300"
                    placeholder="Tell us about your needs, preferred dimensions, delivery location..."
                    value={formData.requirement}
                    onChange={e => setFormData({ ...formData, requirement: e.target.value })}
                  />
                </div>

                {status === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex items-center gap-2">
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
                  className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-all duration-500 ${
                    status === 'submitting'
                      ? 'bg-surface-200 text-surface-400 cursor-not-allowed'
                      : 'bg-primary-800 text-white hover:bg-surface-900 shadow-xl hover:shadow-2xl active:scale-[0.98]'
                  }`}
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
                    'Send Inquiry'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
