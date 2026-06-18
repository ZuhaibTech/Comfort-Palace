import React, { useState } from 'react';
import Image from 'next/image';

export default function DemoSales({ isOpen, onClose, products, onSuccess }: any) {
  const [saleStep, setSaleStep] = useState<'products' | 'cart'>('products');
  const [cart, setCart] = useState<any[]>([]);
  const [saleCustomer, setSaleCustomer] = useState({ 
    name: '', email: '', phone: '', address: '', delivery_address: '', pan_number: '', 
    payment_methods: ['Cash'], cash_amount: '', upi_amount: '', card_amount: '', bank_transfer_amount: '', 
    discount: '0', transport_cost: '0', notes: '' 
  });
  const [saleSubmitting, setSaleSubmitting] = useState(false);
  const [saleProductSearch, setSaleProductSearch] = useState('');

  if (!isOpen) return null;

  const getFirstImage = (urlsStr: string) => {
    if (!urlsStr) return '';
    try {
      const urls = JSON.parse(urlsStr);
      return urls[0] || '';
    } catch {
      return urlsStr.split(',')[0] || '';
    }
  };

  // Cart helpers
  const addToCart = (product: any) => {
    const existing = cart.find(c => c.product_id === product.id);
    if (existing) {
      setCart(cart.map(c => c.product_id === product.id ? { ...c, quantity: c.quantity + 1, total_price: (c.quantity + 1) * c.unit_price } : c));
    } else {
      // In Demo Sale, we don't apply GST
      const roundedPrice = Math.round(product.price);
      setCart([...cart, { 
        product_id: product.id, 
        product_name: product.name, 
        item_code: product.item_code, 
        unit_price: roundedPrice, 
        quantity: 1, 
        total_price: roundedPrice, 
        max_stock: product.quantity_in_stock, 
        gst_percentage: null // No GST for demo sale
      }]);
    }
  };

  const updateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) { setCart(cart.filter(c => c.product_id !== productId)); return; }
    setCart(cart.map(c => c.product_id === productId ? { ...c, quantity: qty, total_price: qty * c.unit_price } : c));
  };

  const removeFromCart = (productId: string) => setCart(cart.filter(c => c.product_id !== productId));

  const cartSubtotal = cart.reduce((s, c) => s + c.total_price, 0);
  const discountPct = Number(saleCustomer.discount) || 0;
  const discountAmt = Math.round(cartSubtotal * (discountPct / 100));
  const transportCost = Number(saleCustomer.transport_cost) || 0;
  const cartTotal = cartSubtotal - discountAmt + transportCost;

  const submitSale = async () => {
    if (cart.length === 0) { alert('Add at least one product to the cart.'); return; }
    setSaleSubmitting(true);
    try {
      const payload = {
        customer_name: saleCustomer.name || null,
        customer_email: saleCustomer.email || null,
        customer_phone: saleCustomer.phone || null,
        customer_address: saleCustomer.address || null,
        delivery_address: saleCustomer.delivery_address || null,
        pan_number: saleCustomer.pan_number || null,
        total_amount: cartTotal,
        discount_amount: discountAmt,
        tax_amount: transportCost, // Using tax_amount to store transport cost
        amount_paid: cartTotal,
        payment_method: saleCustomer.payment_methods.join(', '),
        cash_amount: Number(saleCustomer.cash_amount) || 0,
        upi_amount: Number(saleCustomer.upi_amount) || 0,
        card_amount: Number(saleCustomer.card_amount) || 0,
        bank_transfer_amount: Number(saleCustomer.bank_transfer_amount) || 0,
        payment_status: 'completed',
        notes: saleCustomer.notes || null,
        is_demo: true, // FLAG AS DEMO SALE
        sale_items: cart.map(c => ({ 
          product_id: c.product_id, 
          quantity: c.quantity, 
          unit_price: c.unit_price, 
          total_price: c.total_price, 
          gst_percentage: null // Explicitly remove GST
        }))
      };
      
      const res = await fetch('/api/sales', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (result.success) {
        setCart([]);
        setSaleCustomer({ name: '', email: '', phone: '', address: '', delivery_address: '', pan_number: '', payment_methods: ['Cash'], cash_amount: '', upi_amount: '', card_amount: '', bank_transfer_amount: '', discount: '0', transport_cost: '0', notes: '' });
        setSaleStep('products');
        onSuccess(result.data); // pass the new sale back to open the invoice viewer immediately if needed
        onClose();
      } else { alert('Failed: ' + result.error); }
    } catch { alert('Error saving sale.'); } finally { setSaleSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-md">
      <div className="bg-surface-50 rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-blue-200/60 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none z-0"></div>
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-surface-200/60 flex justify-between items-center bg-surface-50/80 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 shadow-sm border border-blue-100 text-blue-600 p-2.5 rounded-2xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>
            </div>
            <div>
              <h2 className="font-display text-3xl font-light text-surface-900 tracking-tight leading-none mb-1">Create <span className="italic text-blue-600">Demo Sale</span></h2>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-400">Process a temporary quotation/demo</span>
            </div>
          </div>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-900 hover:bg-white rounded-full p-2 transition-all"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>

        {/* Step Tabs */}
        <div className="px-6 pt-4 flex gap-6 border-b border-surface-200/40 z-20">
          <button onClick={() => setSaleStep('products')} className={`pb-3 text-[11px] font-bold uppercase tracking-widest border-b-2 transition-all duration-300 ${saleStep === 'products' ? 'border-blue-600 text-blue-800' : 'border-transparent text-surface-400 hover:text-surface-700'}`}>Select Products</button>
          <button onClick={() => setSaleStep('cart')} className={`pb-3 text-[11px] font-bold uppercase tracking-widest border-b-2 transition-all duration-300 ${saleStep === 'cart' ? 'border-blue-600 text-blue-800' : 'border-transparent text-surface-400 hover:text-surface-700'}`}>Cart & Customer Info {cart.length > 0 && <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[10px]">{cart.length}</span>}</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 z-20 bg-surface-50">
          {/* Products Selection */}
          {saleStep === 'products' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <p className="text-sm text-surface-500">Click on a product to add it to your cart.</p>
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <input 
                    type="text" 
                    value={saleProductSearch}
                    onChange={e => setSaleProductSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-blue-600" 
                    placeholder="Search by Item Code..."
                  />
                </div>
              </div>

              {(!products || products.length === 0) ? (
                <div className="py-12 text-center text-surface-500">No products in inventory. Add products first.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {products.filter((p: any) => p.item_code?.toLowerCase().includes(saleProductSearch.toLowerCase())).map((p: any) => {
                    const inCart = cart.find((c: any) => c.product_id === p.id);
                    return (
                      <div key={p.id} onClick={() => !inCart && addToCart(p)} className={`p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md flex items-start gap-4 ${inCart ? 'border-blue-400 bg-blue-50/40 ring-1 ring-blue-400/20' : 'border-surface-200/60 hover:border-blue-300 bg-white'}`}>
                        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-surface-200/60 shrink-0 relative shadow-sm">
                          {p.image_url ? (
                            <img src={getFirstImage(p.image_url)} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-6 h-6 text-surface-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[4rem]">
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="text-[10px] text-surface-400 font-mono font-bold tracking-wider uppercase truncate">{p.item_code}</div>
                              <div className="text-sm font-bold text-surface-900 truncate mt-0.5">{p.name}</div>
                            </div>
                            {inCart && (
                              <div onClick={e => e.stopPropagation()} className="flex items-center gap-1 bg-white border border-blue-200 rounded-md px-1 py-0.5 shadow-sm shrink-0">
                                <button onClick={() => updateCartQty(p.id, inCart.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-blue-700 hover:bg-blue-50 rounded font-bold transition-colors">−</button>
                                <span className="text-xs font-bold text-surface-900 w-5 text-center">{inCart.quantity}</span>
                                <button onClick={() => updateCartQty(p.id, inCart.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-blue-700 hover:bg-blue-50 rounded font-bold transition-colors">+</button>
                              </div>
                            )}
                          </div>
                          <div className="mt-2">
                            <div className="text-lg font-bold text-surface-900 leading-none truncate">₹{p.price?.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {cart.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setSaleStep('cart')} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">Next: Cart & Customer Info →</button>
                </div>
              )}
            </div>
          )}

          {/* Cart & Customer Info */}
          {saleStep === 'cart' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Shopping Cart */}
              <div>
                <div className="bg-white rounded-xl p-5 border border-surface-200/40 shadow-sm">
                  <h3 className="text-sm font-bold text-surface-900 mb-4">Shopping Cart</h3>
                  {cart.length === 0 ? (
                    <div className="py-8 text-center text-surface-400 flex flex-col items-center">
                      <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                      <p className="text-sm">No items in cart</p>
                      <p className="text-xs">Add products from the left to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item: any) => (
                        <div key={item.product_id} className="bg-surface-50/50 p-3 rounded-lg border border-surface-200/60 flex justify-between items-center">
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-surface-900">{item.product_name}</div>
                            <div className="text-xs text-surface-500">₹{item.unit_price?.toLocaleString()} each</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateCartQty(item.product_id, item.quantity - 1)} className="w-7 h-7 rounded border border-surface-200/60 flex items-center justify-center text-surface-600 hover:bg-surface-100">−</button>
                            <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateCartQty(item.product_id, item.quantity + 1)} className="w-7 h-7 rounded border border-surface-200/60 flex items-center justify-center text-surface-600 hover:bg-surface-100">+</button>
                            <button onClick={() => removeFromCart(item.product_id)} className="ml-2 text-red-400 hover:text-red-600"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                          </div>
                          <div className="ml-4 text-sm font-bold text-surface-900 w-20 text-right">₹{item.total_price?.toLocaleString()}</div>
                        </div>
                      ))}
                      <div className="pt-3 border-t border-surface-200/60 space-y-1">
                        <div className="flex justify-between text-sm"><span className="text-surface-500">Subtotal</span><span className="font-semibold">₹{cartSubtotal.toLocaleString()}</span></div>
                        {discountAmt > 0 && <div className="flex justify-between text-sm"><span className="text-surface-500">Discount ({discountPct}%)</span><span className="font-semibold text-red-600">-₹{discountAmt.toLocaleString()}</span></div>}
                        {transportCost > 0 && <div className="flex justify-between text-sm"><span className="text-surface-500">Transport</span><span className="font-semibold">+₹{transportCost.toLocaleString()}</span></div>}
                        <div className="flex justify-between text-base font-bold pt-2 border-t border-surface-200/60"><span>Total</span><span>₹{cartTotal.toLocaleString()}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white rounded-xl p-5 border border-surface-200/40 shadow-sm">
                <h3 className="text-sm font-bold text-surface-900 mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div><label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Customer Name</label><input value={saleCustomer.name} onChange={e => setSaleCustomer({...saleCustomer, name: e.target.value})} className="mt-1 w-full px-3 py-2 border border-blue-400 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Email</label><input value={saleCustomer.email} onChange={e => setSaleCustomer({...saleCustomer, email: e.target.value})} className="mt-1 w-full px-3 py-2 border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-blue-600" /></div>
                    <div><label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Phone</label><input value={saleCustomer.phone} onChange={e => setSaleCustomer({...saleCustomer, phone: e.target.value})} className="mt-1 w-full px-3 py-2 border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-blue-600" /></div>
                  </div>
                  <div><label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Billing Address</label><input value={saleCustomer.address} onChange={e => setSaleCustomer({...saleCustomer, address: e.target.value})} className="mt-1 w-full px-3 py-2 border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-blue-600" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Delivery Address</label><input value={saleCustomer.delivery_address} onChange={e => setSaleCustomer({...saleCustomer, delivery_address: e.target.value})} className="mt-1 w-full px-3 py-2 border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-blue-600" /></div>
                    <div><label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">PAN Card Number</label><input value={saleCustomer.pan_number} onChange={e => setSaleCustomer({...saleCustomer, pan_number: e.target.value})} className="mt-1 w-full px-3 py-2 border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-blue-600 uppercase" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 items-start">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-2 block">Payment Methods</label>
                      <div className="flex flex-wrap gap-2">
                        {['Cash', 'UPI', 'Card', 'Bank Transfer'].map(method => (
                          <label key={method} className="flex items-center gap-1.5 text-sm cursor-pointer hover:bg-surface-100/50 px-2 py-1 rounded transition-colors">
                            <input type="checkbox" checked={saleCustomer.payment_methods.includes(method)} onChange={(e) => {
                              const methods = e.target.checked 
                                ? [...saleCustomer.payment_methods, method] 
                                : saleCustomer.payment_methods.filter(m => m !== method);
                              setSaleCustomer({...saleCustomer, payment_methods: methods.length ? methods : ['Cash']});
                            }} className="rounded border-surface-300 text-blue-600 focus:ring-blue-600 w-4 h-4 cursor-pointer" />
                            {method}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div><label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Discount %</label><input value={saleCustomer.discount} onChange={e => setSaleCustomer({...saleCustomer, discount: e.target.value})} type="number" className="mt-1 w-full px-3 py-2 border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-blue-600" /></div>
                  </div>
                  {saleCustomer.payment_methods.length > 1 && (() => {
                    // Smart auto-fill: when typing in any field, remaining balance goes to the last field
                    const methods = saleCustomer.payment_methods;
                    const fieldMap: Record<string, { key: keyof typeof saleCustomer; label: string; placeholder: string }> = {
                      'Cash':          { key: 'cash_amount',           label: 'Cash Amount (₹)',          placeholder: 'Amount paid in Cash' },
                      'UPI':           { key: 'upi_amount',            label: 'UPI Amount (₹)',            placeholder: 'Amount paid via UPI' },
                      'Card':          { key: 'card_amount',           label: 'Card Amount (₹)',           placeholder: 'Amount paid via Card' },
                      'Bank Transfer': { key: 'bank_transfer_amount',  label: 'Bank Transfer Amount (₹)', placeholder: 'Amount paid via Bank Transfer' },
                    };
                    const lastMethod = methods[methods.length - 1];

                    const handleAmountChange = (changedMethod: string, rawValue: string) => {
                      const enteredAmt = parseFloat(rawValue) || 0;
                      const otherMethods = methods.filter(m => m !== changedMethod);
                      const amountUpdates: Record<string, string> = { [fieldMap[changedMethod].key]: rawValue };

                      if (methods.length === 2) {
                        const other = otherMethods[0];
                        const otherRemaining = cartTotal - enteredAmt;
                        amountUpdates[fieldMap[other].key] = rawValue !== '' && otherRemaining >= 0 ? String(otherRemaining) : '';
                      } else {
                        if (changedMethod !== lastMethod) {
                          const sumOthers = methods
                            .filter(m => m !== lastMethod && m !== changedMethod)
                            .reduce((s, m) => s + (parseFloat(saleCustomer[fieldMap[m].key] as string) || 0), 0);
                          const leftover = cartTotal - enteredAmt - sumOthers;
                          amountUpdates[fieldMap[lastMethod].key] = rawValue !== '' ? String(Math.max(0, leftover)) : '';
                        }
                      }
                      setSaleCustomer({ ...saleCustomer, ...amountUpdates } as typeof saleCustomer);
                    };

                    return (
                      <div className="grid grid-cols-2 gap-3 p-3 bg-surface-100/50 rounded-lg border border-surface-200/60 mt-1">
                        {methods.map(method => {
                          const field = fieldMap[method];
                          const isLastField = method === lastMethod && methods.length > 2;
                          return (
                            <div key={method}>
                              <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">
                                {field.label}
                                {isLastField && <span className="ml-1 text-blue-500 normal-case font-normal">(auto)</span>}
                              </label>
                              <input
                                value={saleCustomer[field.key] as string}
                                onChange={e => handleAmountChange(method, e.target.value)}
                                readOnly={isLastField}
                                type="number"
                                className={`mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none bg-white ${isLastField ? 'border-amber-300 bg-amber-50/50 text-amber-800 cursor-not-allowed' : 'border-surface-200/60 focus:border-blue-600'}`}
                                placeholder={field.placeholder}
                              />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  <div><label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Transport Cost</label><input value={saleCustomer.transport_cost} onChange={e => setSaleCustomer({...saleCustomer, transport_cost: e.target.value})} type="number" className="mt-1 w-full px-3 py-2 border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-blue-600" /></div>
                  <div><label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Notes (Optional)</label><textarea value={saleCustomer.notes} onChange={e => setSaleCustomer({...saleCustomer, notes: e.target.value})} rows={3} placeholder="Add any additional notes for this sale..." className="mt-1 w-full px-3 py-2 border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-blue-600 resize-none"></textarea></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-surface-200/60 flex justify-between items-center bg-surface-50 z-20">
          <div className="text-surface-500 text-sm">{cart.length} items in cart</div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-[11px] uppercase tracking-widest font-bold border border-surface-200 text-surface-600 hover:bg-white hover:text-surface-900 transition-all duration-300 shadow-sm">Cancel</button>
            <button 
              onClick={submitSale}
              disabled={saleSubmitting || cart.length === 0}
              className="px-8 py-2.5 rounded-xl text-[11px] uppercase tracking-widest font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:shadow-none"
            >
              {saleSubmitting ? 'Processing...' : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Complete Demo Sale
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
