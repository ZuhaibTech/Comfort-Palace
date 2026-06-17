'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Tab = 'dashboard' | 'products' | 'archived' | 'sales' | 'testimonials' | 'forms';

const CATEGORIES = [
  'Sofas', 'Dining Sets', 'Dining Chairs', 'Dressing Tables', 'Dressing Sets', 
  'Stools & Pouffes', 'Centre Table', 'Coffee Table', 'Tv Units', 'Bed Side Tables', 
  'Bed Set', 'Pillows', 'Book Shelves', 'Shoe Racks', 'Crockery Units', 
  'Wardrobes', 'Study Tables', 'Office Furniture', 'Outdoor Furniture', 'Chairs', 'Ottomans'
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [forms, setForms] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile2, setImageFile2] = useState<File | null>(null);
  const [imagePreview2, setImagePreview2] = useState('');
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  // Edit Product Modal State
  const [editProduct, setEditProduct] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({ item_code: '', hsn_code: '', category: '', name: '', description: '', price: '', cost_price: '', gst_percentage: '', profit_percentage: '', profit_amount: '', quantity_in_stock: '', low_stock_threshold: '10' });

  const [formData, setFormData] = useState({
    item_code: '',
    hsn_code: '',
    category: '',
    name: '',
    description: '',
    price: '',
    cost_price: '',
    gst_percentage: '',
    profit_percentage: '',
    profit_amount: '',
    quantity_in_stock: '',
    low_stock_threshold: '10'
  });

  // New Sale modal state
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [saleStep, setSaleStep] = useState<'products' | 'cart'>('products');
  const [cart, setCart] = useState<any[]>([]);
  const [saleCustomer, setSaleCustomer] = useState({ name: '', email: '', phone: '', address: '', delivery_address: '', pan_number: '', payment_methods: ['Cash'], cash_amount: '', upi_amount: '', card_amount: '', bank_transfer_amount: '', discount: '0', transport_cost: '0', notes: '' });
  const [saleSubmitting, setSaleSubmitting] = useState(false);
  const [editSaleId, setEditSaleId] = useState<string | null>(null);
  const [viewInvoice, setViewInvoice] = useState<any>(null);
  const [saleProductSearch, setSaleProductSearch] = useState('');

  // Sales filters
  const [salesStartDate, setSalesStartDate] = useState('');
  const [salesEndDate, setSalesEndDate] = useState('');
  const [salesSearch, setSalesSearch] = useState('');

  // Return Invoice state
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [returnSearch, setReturnSearch] = useState('');
  const [returnSearchResults, setReturnSearchResults] = useState<any[]>([]);
  const [returnSelectedSale, setReturnSelectedSale] = useState<any>(null);
  const [returnItems, setReturnItems] = useState<{[productId: string]: number}>({});
  const [returnNotes, setReturnNotes] = useState('');
  const [returnSubmitting, setReturnSubmitting] = useState(false);
  const [returnSearching, setReturnSearching] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, salesRes, formsRes, testimonialsRes] = await Promise.all([
        fetch('/api/products').catch(() => ({ json: () => ({ data: [] }) })),
        fetch('/api/sales').catch(() => ({ json: () => ({ data: [] }) })),
        fetch('/api/contact').catch(() => ({ json: () => ({ data: [] }) })),
        fetch('/api/testimonials').catch(() => ({ json: () => ({ data: [] }) }))
      ]);
      
      const productsData = await (productsRes as any).json();
      const salesData = await (salesRes as any).json();
      const formsData = await (formsRes as any).json();
      const testimonialsData = await (testimonialsRes as any).json();
      
      setProducts(productsData.data || []);
      setSales(salesData.data || []);
      setForms(formsData.data || []);
      setTestimonials(testimonialsData.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };

    // Auto-calculate profit amount and SP when CP, GST%, or PF% change
    if (name === 'cost_price' || name === 'profit_percentage' || name === 'gst_percentage') {
      const cp = Number(name === 'cost_price' ? value : updated.cost_price) || 0;
      const pf = Number(name === 'profit_percentage' ? value : updated.profit_percentage) || 0;
      const gst = Number(name === 'gst_percentage' ? value : updated.gst_percentage) || 0;
      if (cp > 0) {
        const profitAmt = Math.round(cp * (pf / 100));
        const gstAmt = Math.round(cp * (gst / 100));
        updated.profit_amount = String(profitAmt);
        updated.price = String(cp + gstAmt + profitAmt);
      }
    }

    setFormData(updated);
  };

  // Cart helpers
  const addToCart = (product: any) => {
    const existing = cart.find(c => c.product_id === product.id);
    if (existing) {
      setCart(cart.map(c => c.product_id === product.id ? { ...c, quantity: c.quantity + 1, total_price: (c.quantity + 1) * c.unit_price } : c));
    } else {
      setCart([...cart, { product_id: product.id, product_name: product.name, item_code: product.item_code, unit_price: product.price, quantity: 1, total_price: product.price, max_stock: product.quantity_in_stock, gst_percentage: product.gst_percentage ?? null }]);
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
        sale_items: cart.map(c => ({ product_id: c.product_id, quantity: c.quantity, unit_price: c.unit_price, total_price: c.total_price, gst_percentage: c.gst_percentage ?? null }))
      };
      
      const url = editSaleId ? `/api/sales/${editSaleId}` : '/api/sales';
      const method = editSaleId ? 'PUT' : 'POST';
      
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (result.success) {
        setIsNewSaleOpen(false);
        setEditSaleId(null);
        setCart([]);
        setSaleCustomer({ name: '', email: '', phone: '', address: '', delivery_address: '', pan_number: '', payment_methods: ['Cash'], cash_amount: '', upi_amount: '', card_amount: '', bank_transfer_amount: '', discount: '0', transport_cost: '0', notes: '' });
        setSaleStep('products');
        fetchData();
      } else { alert('Failed: ' + result.error); }
    } catch { alert('Error saving sale.'); } finally { setSaleSubmitting(false); }
  };

  const openEditSale = (sale: any) => {
    setEditSaleId(sale.id);
    const mappedCart = (sale.sale_items || []).map((item: any) => ({
      product_id: item.product_id,
      name: item.product_name || 'Unknown Product',
      price: item.unit_price,
      unit_price: item.unit_price,
      quantity: item.quantity,
      total_price: item.total_price,
      quantity_in_stock: 9999 // bypass stock limit checking during edit
    }));
    setCart(mappedCart);
    
    // Calculate subtotal to properly restore discount percentage
    const subtotal = mappedCart.reduce((s: number, c: any) => s + c.total_price, 0);
    const discountPct = (sale.discount_amount && subtotal > 0) ? String(Math.round((sale.discount_amount / subtotal) * 100)) : '0';
    
    setSaleCustomer({
      name: sale.customer_name || '', email: sale.customer_email || '', phone: sale.customer_phone || '',
      address: sale.customer_address || '', 
      delivery_address: sale.delivery_address || '',
      pan_number: sale.pan_number || '',
      payment_methods: sale.payment_method ? sale.payment_method.split(',').map((s: string) => s.trim()) : ['Cash'],
      cash_amount: sale.cash_amount ? String(sale.cash_amount) : '',
      upi_amount: sale.upi_amount ? String(sale.upi_amount) : '',
      card_amount: sale.card_amount ? String(sale.card_amount) : '',
      bank_transfer_amount: sale.bank_transfer_amount ? String(sale.bank_transfer_amount) : '',
      discount: discountPct,
      transport_cost: sale.tax_amount ? String(sale.tax_amount) : '0',
      notes: sale.notes || ''
    });
    setSaleStep('cart');
    setIsNewSaleOpen(true);
  };

  const deleteSale = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sale? This will restore the product stock.')) return;
    try {
      await fetch(`/api/sales/${id}`, { method: 'DELETE' });
      fetchData();
    } catch { alert('Error deleting sale'); }
  };

  // Edit product handler
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updated = { ...editFormData, [name]: value };
    if (name === 'cost_price' || name === 'profit_percentage' || name === 'gst_percentage') {
      const cp = Number(name === 'cost_price' ? value : updated.cost_price) || 0;
      const pf = Number(name === 'profit_percentage' ? value : updated.profit_percentage) || 0;
      const gst = Number(name === 'gst_percentage' ? value : updated.gst_percentage) || 0;
      if (cp > 0) {
        const profitAmt = Math.round(cp * (pf / 100));
        const gstAmt = Math.round(cp * (gst / 100));
        updated.profit_amount = String(profitAmt);
        updated.price = String(cp + gstAmt + profitAmt);
      }
    }
    setEditFormData(updated);
  };

  const submitEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    try {
      const res = await fetch(`/api/products/${editProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_code: editFormData.item_code, name: editFormData.name, description: editFormData.description,
          price: Number(editFormData.price), cost_price: Number(editFormData.cost_price) || null,
          gst_percentage: Number(editFormData.gst_percentage) || null, profit_percentage: Number(editFormData.profit_percentage) || null,
          quantity_in_stock: Number(editFormData.quantity_in_stock), low_stock_threshold: Number(editFormData.low_stock_threshold),
          category: editFormData.category || null, image_url: editProduct.image_url
        })
      });
      const result = await res.json();
      if (result.success) { setEditProduct(null); fetchData(); } else { alert('Failed: ' + result.error); }
    } catch { alert('Error updating product.'); }
  };

  // Safe date formatting helper
  const formatSaleDate = (sale: any) => {
    const d = sale.sale_date || sale.created_at;
    if (!d) return '—';
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString();
  };

  // Filtered sales
  const filteredSales = sales.filter((s: any) => {
    let pass = true;
    const sDate = s.sale_date || s.created_at || '';
    if (salesStartDate) pass = pass && sDate >= salesStartDate;
    if (salesEndDate) pass = pass && sDate <= salesEndDate + 'T23:59:59';
    if (salesSearch) {
      const q = salesSearch.toLowerCase();
      pass = pass && ((s.sale_number || '').toLowerCase().includes(q) || (s.customer_name || '').toLowerCase().includes(q) || (s.id || '').toLowerCase().includes(q));
    }
    return pass;
  });

  const getFirstImage = (urlData: string) => {
    if (!urlData) return '';
    try {
      const parsed = JSON.parse(urlData);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch(e) {}
    return urlData;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, slot: 1 | 2 = 1) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      if (slot === 1) {
        setImageFile(file);
        setImagePreview(previewUrl);
      } else {
        setImageFile2(file);
        setImagePreview2(previewUrl);
      }
    }
  };

  const submitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingImage(true);
    
    try {
      const imageUrls: string[] = [];
      
      // 1. Upload Image 1
      if (imageFile) {
        const fd = new FormData();
        fd.append('file', imageFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          imageUrls.push(uploadData.data.url);
        } else {
          alert('Image 1 upload failed: ' + uploadData.error);
          setUploadingImage(false);
          return;
        }
      }

      // 2. Upload Image 2
      if (imageFile2) {
        const fd2 = new FormData();
        fd2.append('file', imageFile2);
        const uploadRes2 = await fetch('/api/upload', { method: 'POST', body: fd2 });
        const uploadData2 = await uploadRes2.json();
        if (uploadData2.success) {
          imageUrls.push(uploadData2.data.url);
        } else {
          alert('Image 2 upload failed: ' + uploadData2.error);
          setUploadingImage(false);
          return;
        }
      }

      const imageUrl = imageUrls.length > 0 ? JSON.stringify(imageUrls) : '';

      // 2. Submit Product
      const payload = {
        ...formData,
        price: Number(formData.price),
        cost_price: formData.cost_price ? Number(formData.cost_price) : null,
        gst_percentage: formData.gst_percentage ? Number(formData.gst_percentage) : null,
        profit_percentage: formData.profit_percentage ? Number(formData.profit_percentage) : null,
        quantity_in_stock: Number(formData.quantity_in_stock),
        low_stock_threshold: Number(formData.low_stock_threshold),
        image_url: imageUrl
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success) {
        // Reset form and reload
        setIsAddModalOpen(false);
        setImageFile(null);
        setImagePreview('');
        setImageFile2(null);
        setImagePreview2('');
        setFormData({
          item_code: '', hsn_code: '', category: '', name: '', description: '', price: '',
          cost_price: '', gst_percentage: '', profit_percentage: '', profit_amount: '', quantity_in_stock: '', low_stock_threshold: '10'
        });
        fetchData(); // Refresh product list
      } else {
        alert('Failed to add product: ' + result.error);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while adding the product.');
    } finally {
      setUploadingImage(false);
    }
  };

  const totalProducts = products.length;
  const lowStock = products.filter((p: any) => p.quantity_in_stock < 3).length;
  const totalSalesCount = sales.length;
  const totalRevenue = sales.reduce((acc: number, s: any) => acc + (s.total_amount || 0), 0);

  // Return Invoice helpers
  const searchForReturn = async (query: string) => {
    setReturnSearch(query);
    if (query.length < 2) { setReturnSearchResults([]); return; }
    setReturnSearching(true);
    try {
      const res = await fetch(`/api/sales/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setReturnSearchResults(data.data || []);
    } catch (_e) { setReturnSearchResults([]); }
    setReturnSearching(false);
  };

  const selectSaleForReturn = (sale: any) => {
    setReturnSelectedSale(sale);
    setReturnItems({});
    setReturnSearchResults([]);
    setReturnSearch('');
  };

  const toggleReturnItem = (productId: string, maxQty: number) => {
    setReturnItems(prev => {
      if (prev[productId] !== undefined) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: maxQty };
    });
  };

  const updateReturnQty = (productId: string, qty: number, maxQty: number) => {
    if (qty < 1) qty = 1;
    if (qty > maxQty) qty = maxQty;
    setReturnItems(prev => ({ ...prev, [productId]: qty }));
  };

  const returnTotal = returnSelectedSale
    ? returnSelectedSale.sale_items
        .filter((item: any) => returnItems[item.product_id] !== undefined)
        .reduce((sum: number, item: any) => sum + (returnItems[item.product_id] || 0) * (item.unit_price || 0), 0)
    : 0;

  const submitReturn = async () => {
    if (!returnSelectedSale || Object.keys(returnItems).length === 0) return;
    setReturnSubmitting(true);
    try {
      const items = returnSelectedSale.sale_items
        .filter((item: any) => returnItems[item.product_id] !== undefined)
        .map((item: any) => ({
          product_id: item.product_id,
          quantity: returnItems[item.product_id],
          unit_price: item.unit_price
        }));

      const res = await fetch('/api/sales/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_sale_id: returnSelectedSale.id,
          return_items: items,
          notes: returnNotes
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Return invoice ${data.data.sale_number} created successfully!`);
        setIsReturnOpen(false);
        setReturnSelectedSale(null);
        setReturnItems({});
        setReturnNotes('');
        fetchData();
      } else {
        alert('Return failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('An error occurred while processing the return.');
    }
    setReturnSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-surface-50 font-sans relative pt-[12dvh] print:bg-transparent print:pt-0 print:min-h-0">
      {/* Header */}
      <header className="bg-surface-50/80 backdrop-blur-xl border-b border-surface-200/60 sticky top-[12dvh] z-40 print:hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative h-12 w-48">
              <Image 
                src="/Logo/LOGO main.svg" 
                alt="Comfort Palace" 
                fill 
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-semibold text-surface-700 bg-white border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors">
              Reset Password
            </button>
            <Link 
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-surface-700 bg-white border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 print:hidden">
        
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-display text-[clamp(2.5rem,4vw,3.5rem)] font-light tracking-tighter text-surface-900 leading-none mb-2">Inventory <span className="italic text-primary-800">Management</span></h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-surface-400">Dashboard & Overview</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-surface-200/60 pb-4">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'products', label: 'Products' },
            { id: 'sales', label: 'Sales' },
            { id: 'forms', label: 'Forms' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all duration-500 border ${
                activeTab === tab.id
                  ? 'bg-primary-900 text-surface-50 border-primary-900 shadow-xl scale-105'
                  : 'bg-surface-50/40 text-surface-500 border-surface-200 hover:bg-white hover:text-surface-900 hover:shadow-sm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Total Products */}
              <div className="bg-surface-50 rounded-[2rem] p-8 shadow-sm border border-surface-200/60 flex flex-col justify-between group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-800/5 rounded-full blur-2xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-primary-800/10"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-surface-500 font-bold text-[10px] uppercase tracking-widest">Total<br/>Products</h3>
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-surface-100 group-hover:scale-110 transition-transform duration-500">
                      <svg className="w-5 h-5 text-primary-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-5xl font-display font-light text-surface-900 mb-2">{totalProducts}</div>
                </div>
                <p className="text-surface-400 text-xs tracking-wider relative z-10">Items in inventory</p>
              </div>

              {/* Total Sales */}
              <div className="bg-surface-50 rounded-[2rem] p-8 shadow-sm border border-surface-200/60 flex flex-col justify-between group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-800/5 rounded-full blur-2xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-primary-800/10"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-surface-500 font-bold text-[10px] uppercase tracking-widest">Total<br/>Sales</h3>
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-surface-100 group-hover:scale-110 transition-transform duration-500">
                      <svg className="w-5 h-5 text-primary-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-5xl font-display font-light text-surface-900 mb-2">{totalSalesCount}</div>
                  <p className="text-surface-400 text-xs tracking-wider">Completed transactions</p>
                </div>
                <button 
                  onClick={() => setActiveTab('sales')}
                  className="text-primary-800 hover:text-primary-900 text-[10px] font-bold uppercase tracking-widest text-left mt-6 inline-flex items-center relative z-10"
                >
                  View Analytics <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>

              {/* Revenue */}
              <div className="bg-surface-50 rounded-[2rem] p-8 shadow-sm border border-surface-200/60 flex flex-col justify-between group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-800/5 rounded-full blur-2xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-primary-800/10"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-surface-500 font-bold text-[10px] uppercase tracking-widest">Total<br/>Revenue</h3>
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-surface-100 group-hover:scale-110 transition-transform duration-500">
                      <svg className="w-5 h-5 text-primary-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-4xl font-display font-light text-surface-900 mb-2">₹{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <p className="text-surface-400 text-xs tracking-wider">Gross revenue</p>
                </div>
                <button 
                  onClick={() => setActiveTab('sales')}
                  className="text-primary-800 hover:text-primary-900 text-[10px] font-bold uppercase tracking-widest text-left mt-6 inline-flex items-center relative z-10"
                >
                  View Analytics <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-surface-50 rounded-[2rem] p-8 shadow-sm border border-surface-200/60 flex flex-col justify-between group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-red-500/10"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-surface-500 font-bold text-[10px] uppercase tracking-widest">Low Stock<br/>Alerts</h3>
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-surface-100 group-hover:scale-110 transition-transform duration-500">
                      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-5xl font-display font-light text-red-500 mb-2">{lowStock}</div>
                </div>
                <p className="text-surface-400 text-xs tracking-wider relative z-10">Items below threshold</p>
              </div>

            </div>

            {/* Recent Sales Section */}
            <div className="bg-surface-50 rounded-[2rem] p-10 shadow-sm border border-surface-200/60 transition-all duration-500 hover:shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-800/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
              <div className="relative z-10">
                <h2 className="font-display text-[clamp(2rem,3vw,2.5rem)] font-light text-surface-900 mb-1">Recent <span className="italic text-primary-800">Sales</span></h2>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-400 mb-8">Latest transactions & operations</p>
              </div>
              
              {loading ? (
                <div className="text-surface-400 py-10 flex items-center justify-center gap-3 relative z-10">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-xs uppercase tracking-widest font-bold">Loading Ledger...</span>
                </div>
              ) : sales.length === 0 ? (
                <div className="text-surface-400 py-16 text-center text-sm font-light border border-dashed border-surface-200/60 rounded-[1.5rem] bg-surface-100/50 relative z-10">No recent sales data available.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-surface-200/60">
                        <th className="py-4 px-6 text-[10px] font-bold text-surface-400 uppercase tracking-widest text-left">Order ID</th>
                        <th className="py-4 px-6 text-[10px] font-bold text-surface-400 uppercase tracking-widest text-left">Date</th>
                        <th className="py-4 px-6 text-[10px] font-bold text-surface-400 uppercase tracking-widest text-right">Amount</th>
                        <th className="py-4 px-6 text-[10px] font-bold text-surface-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.slice(0, 5).map((sale: any) => (
                        <tr key={sale.id} className="border-b border-surface-100 hover:bg-surface-100/50 transition-colors duration-300">
                          <td className="py-5 px-6 text-sm text-surface-900 font-medium">{sale.sale_number || `#${sale.id.slice(0,8)}`}</td>
                          <td className="py-5 px-6 text-sm text-surface-500">{formatSaleDate(sale)}</td>
                          <td className="py-5 px-6 text-sm text-surface-900 font-semibold text-right">₹{sale.total_amount.toLocaleString()}</td>
                          <td className="py-5 px-6 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button onClick={() => setViewInvoice(sale)} className="p-2 text-surface-400 hover:text-primary-800 hover:bg-surface-200 rounded-xl transition-all duration-300" title="View Invoice">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                              </button>
                              <button onClick={() => openEditSale(sale)} className="p-2 text-primary-800 hover:bg-primary-50 hover:text-primary-900 rounded-xl transition-all duration-300" title="Edit">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              </button>
                              <button onClick={() => deleteSale(sale.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300" title="Delete">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  className="pl-10 pr-4 py-2 w-full border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-primary-800" 
                  placeholder="Search products..."
                />
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-4 py-2 border border-surface-200/60 text-surface-600 rounded-lg text-sm font-semibold hover:bg-surface-50 flex items-center justify-center gap-2 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export to Excel
                </button>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-semibold hover:bg-primary-900 flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Product
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-surface-200/40 min-h-[400px]">
              {loading ? (
                 <div className="text-surface-500 py-8 text-center">Loading products...</div>
              ) : products.length === 0 ? (
                <>
                  <h2 className="text-xl font-bold text-surface-900 mb-2">Products (0)</h2>
                  <div className="py-16 text-center text-surface-500 flex flex-col items-center">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p>No products yet. Add your first product!</p>
                  </div>
                </>
              ) : (
                <div>
                  <h2 className="font-display text-3xl font-light text-surface-900 mb-6">Products <span className="italic text-primary-800">({products.length})</span></h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-surface-200/60">
                          <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase">Image</th>
                          <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase">Item Code</th>
                          <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase">Name & Category</th>
                          <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase text-right">Price</th>
                          <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase text-right">Stock</th>
                          <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product: any) => (
                          <tr key={product.id} className="border-b border-surface-200/40 hover:bg-surface-50">
                            <td className="py-4 px-4">
                              <div className="w-12 h-12 bg-surface-100 rounded-lg overflow-hidden border border-surface-200/60 relative">
                                {product.image_url ? (
                                  <img src={getFirstImage(product.image_url)} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <svg className="w-6 h-6 text-surface-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm font-bold text-surface-700 font-mono">{product.item_code}</div>
                              {product.hsn_code && <div className="text-xs text-surface-400 mt-1">HSN: {product.hsn_code}</div>}
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm font-bold text-surface-900">{product.name}</div>
                              <div className="text-xs text-surface-500 mt-1">{product.category || 'Uncategorized'}</div>
                            </td>
                            <td className="py-4 px-4 text-sm text-surface-900 font-semibold text-right">₹{product.price?.toLocaleString()}</td>
                            <td className="py-4 px-4 text-right">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.quantity_in_stock <= product.low_stock_threshold ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {product.quantity_in_stock}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => { setEditProduct(product); setEditFormData({ item_code: product.item_code, hsn_code: product.hsn_code || '', category: product.category || '', name: product.name, description: product.description || '', price: String(product.price || ''), cost_price: String(product.cost_price || ''), gst_percentage: String(product.gst_percentage || ''), profit_percentage: String(product.profit_percentage || ''), profit_amount: '', quantity_in_stock: String(product.quantity_in_stock || ''), low_stock_threshold: String(product.low_stock_threshold || '10') }); }} className="p-1.5 text-primary-800 hover:bg-primary-50 rounded-lg transition-colors" title="Edit">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                                <button onClick={async () => { if (confirm('Archive this product?')) { await fetch(`/api/products/${product.id}`, { method: 'DELETE' }); fetchData(); } }} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Archive">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FORMS TAB */}
        {activeTab === 'forms' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-surface-200/40 min-h-[400px]">
              <h2 className="font-display text-3xl font-light text-surface-900 mb-6">Contact <span className="italic text-primary-800">Inquiries ({forms.length})</span></h2>
              {loading ? (
                <div className="text-surface-500 py-8 text-center">Loading forms...</div>
              ) : forms.length === 0 ? (
                <div className="py-16 text-center text-surface-500">No forms submitted yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-surface-200/60">
                        <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase">Date</th>
                        <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase">Name</th>
                        <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase">Email/Phone</th>
                        <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase">Requirement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {forms.map((form: any) => (
                        <tr key={form.id} className="border-b border-surface-200/40 hover:bg-surface-50">
                          <td className="py-4 px-4 text-sm text-surface-500">{new Date(form.created_at).toLocaleDateString()}</td>
                          <td className="py-4 px-4 text-sm font-semibold text-surface-900">{form.first_name} {form.last_name}</td>
                          <td className="py-4 px-4 text-sm text-surface-500">
                            <div>{form.email}</div>
                            <div className="text-xs">{form.phone}</div>
                          </td>
                          <td className="py-4 px-4 text-sm text-surface-600 max-w-xs truncate">{form.requirement}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SALES TAB */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="font-display text-3xl font-light text-surface-900">Sales <span className="italic text-primary-800">History</span></h2>
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-surface-200/60 text-surface-600 rounded-lg text-sm font-semibold hover:bg-surface-50 flex items-center gap-2 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Export Excel
                </button>
                <button onClick={() => { setIsReturnOpen(true); setReturnSelectedSale(null); setReturnSearch(''); setReturnSearchResults([]); setReturnItems({}); setReturnNotes(''); }} className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 flex items-center gap-2 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                  Return Invoice
                </button>
                <button onClick={() => { setIsNewSaleOpen(true); setSaleStep('products'); }} className="px-4 py-2 bg-[#0b5c2a] text-white rounded-lg text-sm font-semibold hover:bg-green-800 flex items-center gap-2 transition-colors shadow-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  New Sale
                </button>
              </div>
            </div>

            {/* Date Filters */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-surface-200/40">
              <h3 className="text-sm font-bold text-surface-900 mb-3">Filter by Date Range</h3>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <input type="date" value={salesStartDate} onChange={e => setSalesStartDate(e.target.value)} className="px-3 py-1.5 border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-primary-800" placeholder="Select Start Date" />
                </div>
                <span className="text-surface-400 text-sm">to</span>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <input type="date" value={salesEndDate} onChange={e => setSalesEndDate(e.target.value)} className="px-3 py-1.5 border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-primary-800" placeholder="Select End Date" />
                </div>
                <button onClick={() => { setSalesStartDate(''); setSalesEndDate(''); }} className="px-3 py-1.5 border border-surface-200/60 text-surface-500 rounded-lg text-sm hover:bg-surface-50 transition-colors">Clear Filters</button>
              </div>
            </div>

            {/* Sales Table */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-surface-200/40 min-h-[300px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display text-2xl font-light text-surface-900">All Sales <span className="italic text-primary-800">({filteredSales.length})</span></h3>
                <div className="relative w-72">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg className="h-4 w-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                  <input type="text" value={salesSearch} onChange={e => setSalesSearch(e.target.value)} className="pl-9 pr-4 py-2 w-full border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-primary-800" placeholder="Search by invoice number or customer" />
                </div>
              </div>
              {loading ? (
                <div className="text-surface-500 py-8 text-center">Loading sales...</div>
              ) : filteredSales.length === 0 ? (
                <div className="py-12 text-center text-surface-500">No sales found for the selected date range. Create your first sale!</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-surface-200/60">
                        <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase">Order ID</th>
                        <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase">Date</th>
                        <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase">Customer</th>
                        <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase">Status</th>
                        <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase text-right">Amount</th>
                        <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSales.map((sale: any) => (
                        <tr key={sale.id} className={`border-b border-surface-200/40 hover:bg-surface-50 ${sale.is_return ? 'bg-red-50/30' : ''}`}>
                          <td className="py-4 px-4 text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <span className={sale.is_return ? 'text-red-600' : 'text-surface-900'}>{sale.sale_number || `#${sale.id.slice(0,8)}`}</span>
                              {sale.is_return ? <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 uppercase tracking-wider">Return</span> : null}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-surface-500">{formatSaleDate(sale)}</td>
                          <td className="py-4 px-4">
                            <div className="text-sm font-semibold text-surface-900">{sale.customer_name || 'Walk-in Customer'}</div>
                            <div className="text-xs text-surface-500">{sale.customer_phone || ''}</div>
                          </td>
                          <td className="py-4 px-4 text-sm">
                            {sale.is_return ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">Refund</span>
                            ) : (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${sale.payment_status === 'completed' || sale.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} capitalize`}>
                                {sale.payment_status || 'pending'}
                              </span>
                            )}
                          </td>
                          <td className={`py-4 px-4 text-sm font-semibold text-right ${sale.is_return ? 'text-red-600' : 'text-surface-900'}`}>
                            {sale.is_return ? '-' : ''}₹{Math.abs(sale.total_amount || 0)?.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setViewInvoice(sale)} className="p-1.5 text-surface-500 hover:bg-surface-100 rounded-lg transition-colors" title="View Invoice">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                              </button>
                              {!sale.is_return && (
                                <button onClick={() => openEditSale(sale)} className="p-1.5 text-primary-800 hover:bg-primary-50 rounded-lg transition-colors" title="Edit">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                              )}
                              <button onClick={() => deleteSale(sale.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RETURN INVOICE MODAL */}
        {isReturnOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative border border-surface-200/60">
              {/* Header */}
              <div className="px-8 py-5 border-b border-surface-200/40 flex justify-between items-center sticky top-0 bg-white z-20 rounded-t-3xl">
                <div>
                  <h2 className="font-display text-2xl font-light text-surface-900">Return <span className="italic text-red-600">Invoice</span></h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-surface-400 mt-1">Process a Customer Return</p>
                </div>
                <button onClick={() => setIsReturnOpen(false)} className="text-surface-400 hover:text-surface-900 p-2 bg-surface-100 hover:bg-surface-200 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="p-8 space-y-6">
                {/* Step 1: Search for bill */}
                {!returnSelectedSale ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-400 mb-2 block">Search Original Bill</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                          type="text"
                          value={returnSearch}
                          onChange={e => searchForReturn(e.target.value)}
                          placeholder="Enter bill number or customer name..."
                          className="pl-12 pr-4 py-3.5 w-full border-2 border-surface-200 rounded-2xl text-sm focus:outline-none focus:border-red-400 transition-colors bg-surface-50/50"
                          autoFocus
                        />
                      </div>
                    </div>

                    {returnSearching && (
                      <div className="text-center py-6 text-surface-400 text-sm">Searching...</div>
                    )}

                    {!returnSearching && returnSearchResults.length > 0 && (
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {returnSearchResults.map((sale: any) => (
                          <button
                            key={sale.id}
                            onClick={() => selectSaleForReturn(sale)}
                            className="w-full text-left p-4 bg-surface-50/80 hover:bg-surface-100 rounded-xl border border-surface-200/60 transition-all duration-200 group"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-bold text-surface-900 group-hover:text-red-700 transition-colors">{sale.sale_number}</p>
                                <p className="text-xs text-surface-500 mt-0.5">{sale.customer_name || 'Walk-in Customer'} · {formatSaleDate(sale)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-surface-900">₹{Math.abs(sale.total_amount || 0).toLocaleString()}</p>
                                <p className="text-[10px] text-surface-400">{sale.sale_items?.length || 0} items</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {!returnSearching && returnSearch.length >= 2 && returnSearchResults.length === 0 && (
                      <div className="text-center py-10 text-surface-400">
                        <svg className="w-12 h-12 mx-auto mb-3 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-sm font-semibold">No bills found</p>
                        <p className="text-xs mt-1">Try a different bill number or customer name</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Step 2: Select products to return */
                  <div className="space-y-6">
                    {/* Selected Bill Info */}
                    <div className="bg-surface-50/80 rounded-2xl p-5 border border-surface-200/40">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-400 mb-1">Original Bill</p>
                          <p className="text-lg font-bold text-surface-900">{returnSelectedSale.sale_number}</p>
                          <p className="text-sm text-surface-500 mt-0.5">{returnSelectedSale.customer_name || 'Walk-in Customer'} · {formatSaleDate(returnSelectedSale)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-400 mb-1">Bill Total</p>
                          <p className="text-lg font-bold text-surface-900">₹{Math.abs(returnSelectedSale.total_amount || 0).toLocaleString()}</p>
                        </div>
                      </div>
                      <button onClick={() => { setReturnSelectedSale(null); setReturnItems({}); }} className="mt-3 text-xs text-red-500 hover:text-red-700 font-semibold transition-colors">
                        ← Choose a different bill
                      </button>
                    </div>

                    {/* Product Selection */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-400 mb-3">Select Products to Return</p>
                      <div className="space-y-2">
                        {returnSelectedSale.sale_items?.map((item: any) => {
                          const isSelected = returnItems[item.product_id] !== undefined;
                          return (
                            <div
                              key={item.product_id}
                              className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? 'border-red-300 bg-red-50/50 shadow-sm'
                                  : 'border-surface-200/60 bg-white hover:border-surface-300'
                              }`}
                              onClick={() => toggleReturnItem(item.product_id, item.quantity)}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                                    isSelected ? 'bg-red-500 border-red-500' : 'border-surface-300'
                                  }`}>
                                    {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-surface-900">{item.product_name || `Product ${item.product_id.slice(0,8)}`}</p>
                                    <p className="text-xs text-surface-400">₹{Number(item.unit_price).toLocaleString()} × {item.quantity} purchased</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  {isSelected && (
                                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Qty:</span>
                                      <button
                                        onClick={() => updateReturnQty(item.product_id, (returnItems[item.product_id] || 1) - 1, item.quantity)}
                                        className="w-7 h-7 rounded-lg border border-surface-200 flex items-center justify-center text-surface-600 hover:bg-surface-100 text-sm"
                                      >−</button>
                                      <span className="text-sm font-bold w-6 text-center">{returnItems[item.product_id]}</span>
                                      <button
                                        onClick={() => updateReturnQty(item.product_id, (returnItems[item.product_id] || 1) + 1, item.quantity)}
                                        className="w-7 h-7 rounded-lg border border-surface-200 flex items-center justify-center text-surface-600 hover:bg-surface-100 text-sm"
                                      >+</button>
                                    </div>
                                  )}
                                  <p className="text-sm font-bold text-surface-900 w-24 text-right">
                                    ₹{(isSelected ? (returnItems[item.product_id] || 0) * Number(item.unit_price) : Number(item.total_price)).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-400 mb-2 block">Return Reason (Optional)</label>
                      <textarea
                        value={returnNotes}
                        onChange={e => setReturnNotes(e.target.value)}
                        rows={2}
                        placeholder="Enter reason for return..."
                        className="w-full px-4 py-3 border border-surface-200/60 rounded-xl text-sm focus:outline-none focus:border-red-400 resize-none"
                      />
                    </div>

                    {/* Refund Summary */}
                    {Object.keys(returnItems).length > 0 && (
                      <div className="bg-red-50 border border-red-200/60 rounded-2xl p-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400 mb-1">Refund Amount</p>
                            <p className="text-3xl font-display font-light text-red-700">₹{returnTotal.toLocaleString()}</p>
                          </div>
                          <div className="text-right text-xs text-red-500">
                            {Object.keys(returnItems).length} product(s) selected<br/>
                            Items will be restocked
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              {returnSelectedSale && (
                <div className="px-8 py-5 border-t border-surface-200/40 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-3xl">
                  <button onClick={() => setIsReturnOpen(false)} className="px-6 py-2.5 rounded-full text-sm font-semibold border border-surface-200 text-surface-500 hover:bg-surface-50 transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={submitReturn}
                    disabled={returnSubmitting || Object.keys(returnItems).length === 0}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 flex items-center gap-2 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    {returnSubmitting ? 'Processing...' : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                        Process Return
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TESTIMONIALS TAB */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-surface-200/40 min-h-[400px]">
              <h2 className="font-display text-3xl font-light text-surface-900 mb-6">Testimonials <span className="italic text-primary-800">({testimonials.length})</span></h2>
              {loading ? (
                <div className="text-surface-500 py-8 text-center">Loading testimonials...</div>
              ) : testimonials.length === 0 ? (
                <div className="py-16 text-center text-surface-500 flex flex-col items-center">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p>No testimonials available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((testi: any) => (
                    <div key={testi.id} className="p-6 border border-surface-200/40 rounded-xl bg-surface-50">
                      <div className="flex items-center gap-1 text-yellow-400 mb-3">
                        {[...Array(testi.rating || 5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        ))}
                      </div>
                      <p className="text-surface-600 text-sm mb-4 line-clamp-4">"{testi.content}"</p>
                      <div className="text-sm font-bold text-surface-900">{testi.name}</div>
                      <div className="text-xs text-surface-500">{new Date(testi.created_at).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ARCHIVED TAB */}
        {activeTab === 'archived' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-surface-200/40 min-h-[400px]">
              <h2 className="text-xl font-bold text-surface-900 mb-6">Archived Products</h2>
              <div className="py-16 text-center text-surface-500 flex flex-col items-center">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <p>No archived products found.</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Add New Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-md">
          <div className="bg-surface-50 rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-500 border border-surface-200/60 relative overflow-x-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-800/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none z-0"></div>
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-surface-200/60 flex justify-between items-center sticky top-0 bg-surface-50/80 backdrop-blur-xl z-20">
              <div className="flex items-center gap-4">
                <div className="bg-white shadow-sm border border-surface-100 text-primary-800 p-2.5 rounded-2xl">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-display text-3xl font-light text-surface-900 tracking-tight leading-none mb-1">Add <span className="italic text-primary-800">New Product</span></h2>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-400">Fill in the details to add a new product to your inventory</span>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-surface-400 hover:text-surface-900 hover:bg-white rounded-full p-2 transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={submitProduct} className="p-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Item Code *</label>
                  <input required name="item_code" value={formData.item_code} onChange={handleInputChange} type="text" className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">HSN Code</label>
                  <input name="hsn_code" value={formData.hsn_code} onChange={handleInputChange} type="text" className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Category</label>
                  <input list="categories" name="category" value={formData.category} onChange={handleInputChange} placeholder="Select or type..." className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none" />
                  <datalist id="categories">
                    {CATEGORIES.map(cat => <option key={cat} value={cat} />)}
                  </datalist>
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Product Name *</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none" />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none resize-none"></textarea>
                </div>

                <div className="grid grid-cols-4 gap-3 md:col-span-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">CP *</label>
                    <input required name="cost_price" value={formData.cost_price} onChange={handleInputChange} type="number" placeholder="Cost Price" className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">GST% *</label>
                    <select required name="gst_percentage" value={formData.gst_percentage} onChange={handleInputChange} className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none">
                      <option value="">Select GST%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">PF% *</label>
                    <input required name="profit_percentage" value={formData.profit_percentage} onChange={handleInputChange} type="number" step="0.01" placeholder="Profit %" className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">&nbsp;</label>
                    <input readOnly value={formData.profit_amount ? `₹${formData.profit_amount}` : ''} type="text" placeholder="Profit Amt" className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-500 outline-none cursor-not-allowed" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">SP (Auto Calculated)</label>
                  <input readOnly value={formData.price ? `₹${Number(formData.price).toLocaleString()}` : ''} type="text" placeholder="Sale Price = CP + GST + Profit" className="w-full bg-green-50 border-2 border-green-300 rounded-xl px-4 py-3 text-green-800 font-bold text-lg outline-none cursor-not-allowed" />
                  {formData.cost_price && formData.gst_percentage && formData.profit_percentage && (
                    <p className="text-[10px] text-surface-400 mt-1">
                      CP ₹{formData.cost_price} + GST ₹{Math.round(Number(formData.cost_price) * Number(formData.gst_percentage) / 100)} ({formData.gst_percentage}%) + Profit ₹{formData.profit_amount} ({formData.profit_percentage}%) = SP ₹{formData.price}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Initial Stock *</label>
                  <input required name="quantity_in_stock" value={formData.quantity_in_stock} onChange={handleInputChange} type="number" className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Low Stock Alert</label>
                  <input name="low_stock_threshold" value={formData.low_stock_threshold} onChange={handleInputChange} type="number" className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none" />
                </div>

                <div className="md:col-span-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-3 block">Product Images (Max 2)</label>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Image 1 */}
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${imagePreview ? 'border-primary-400 bg-primary-50' : 'border-surface-200/80 hover:border-primary-400 hover:bg-surface-100/50'}`}
                    >
                      <input 
                        type="file" 
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => handleImageChange(e, 1)}
                      />
                      {imagePreview ? (
                        <div className="relative">
                          <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-surface-200/60">
                            <Image src={imagePreview} alt="Preview 1" fill className="object-cover" />
                          </div>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(''); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-md">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="bg-primary-500 text-white p-2.5 rounded-lg mb-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                          </div>
                          <p className="text-xs font-bold text-surface-900 mb-0.5">Image 1</p>
                          <p className="text-[10px] text-surface-400">Click to upload</p>
                        </>
                      )}
                    </div>

                    {/* Image 2 */}
                    <div 
                      onClick={() => fileInputRef2.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${imagePreview2 ? 'border-primary-400 bg-primary-50' : 'border-surface-200/80 hover:border-primary-400 hover:bg-surface-100/50'}`}
                    >
                      <input 
                        type="file" 
                        accept="image/*"
                        ref={fileInputRef2}
                        className="hidden"
                        onChange={(e) => handleImageChange(e, 2)}
                      />
                      {imagePreview2 ? (
                        <div className="relative">
                          <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-surface-200/60">
                            <Image src={imagePreview2} alt="Preview 2" fill className="object-cover" />
                          </div>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setImageFile2(null); setImagePreview2(''); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-md">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="bg-surface-300 text-white p-2.5 rounded-lg mb-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                          </div>
                          <p className="text-xs font-bold text-surface-900 mb-0.5">Image 2</p>
                          <p className="text-[10px] text-surface-400">Optional</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-surface-200/40 flex justify-end gap-3 sticky bottom-0 bg-white">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold border border-surface-200 text-surface-500 hover:bg-white hover:text-surface-900 transition-all duration-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploadingImage}
                  className="px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold bg-primary-900 text-surface-50 hover:bg-primary-800 shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {uploadingImage ? 'Uploading...' : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Product
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Create New Sale Modal */}
      {isNewSaleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-md">
          <div className="bg-surface-50 rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-surface-200/60 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-800/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none z-0"></div>
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-surface-200/60 flex justify-between items-center bg-surface-50/80 backdrop-blur-xl z-20">
              <div className="flex items-center gap-4">
                <div className="bg-white shadow-sm border border-surface-100 text-primary-800 p-2.5 rounded-2xl">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>
                </div>
                <div>
                  <h2 className="font-display text-3xl font-light text-surface-900 tracking-tight leading-none mb-1">Create <span className="italic text-primary-800">New Sale</span></h2>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-400">Process a new customer order</span>
                </div>
              </div>
              <button onClick={() => setIsNewSaleOpen(false)} className="text-surface-400 hover:text-surface-900 hover:bg-white rounded-full p-2 transition-all"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>

            {/* Step Tabs */}
            <div className="px-6 pt-4 flex gap-6 border-b border-surface-200/40">
              <button onClick={() => setSaleStep('products')} className={`pb-3 text-[11px] font-bold uppercase tracking-widest border-b-2 transition-all duration-300 ${saleStep === 'products' ? 'border-primary-800 text-primary-900' : 'border-transparent text-surface-400 hover:text-surface-700'}`}>Select Products</button>
              <button onClick={() => setSaleStep('cart')} className={`pb-3 text-[11px] font-bold uppercase tracking-widest border-b-2 transition-all duration-300 ${saleStep === 'cart' ? 'border-primary-800 text-primary-900' : 'border-transparent text-surface-400 hover:text-surface-700'}`}>Cart & Customer Info {cart.length > 0 && <span className="ml-2 bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full text-[10px]">{cart.length}</span>}</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
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
                        className="pl-9 pr-4 py-2 w-full border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-primary-800" 
                        placeholder="Search by Item Code..."
                      />
                    </div>
                  </div>

                  {products.length === 0 ? (
                    <div className="py-12 text-center text-surface-500">No products in inventory. Add products first.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {products.filter((p: any) => p.item_code?.toLowerCase().includes(saleProductSearch.toLowerCase())).map((p: any) => {
                        const inCart = cart.find((c: any) => c.product_id === p.id);
                        return (
                          <div key={p.id} onClick={() => !inCart && addToCart(p)} className={`p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md flex items-start gap-4 ${inCart ? 'border-blue-400 bg-primary-50/40 ring-1 ring-blue-400/20' : 'border-surface-200/60 hover:border-blue-300'}`}>
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
                                  <div onClick={e => e.stopPropagation()} className="flex items-center gap-1 bg-white border border-primary-200 rounded-md px-1 py-0.5 shadow-sm shrink-0">
                                    <button onClick={() => updateCartQty(p.id, inCart.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-primary-700 hover:bg-primary-50 rounded font-bold transition-colors">−</button>
                                    <span className="text-xs font-bold text-surface-900 w-5 text-center">{inCart.quantity}</span>
                                    <button onClick={() => updateCartQty(p.id, inCart.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-primary-700 hover:bg-primary-50 rounded font-bold transition-colors">+</button>
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
                      <button onClick={() => setSaleStep('cart')} className="px-6 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-900 transition-colors">Next: Cart & Customer Info →</button>
                    </div>
                  )}
                </div>
              )}

              {/* Cart & Customer Info */}
              {saleStep === 'cart' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Shopping Cart */}
                  <div>
                    <div className="bg-surface-50 rounded-xl p-5 border border-surface-200/40">
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
                            <div key={item.product_id} className="bg-white p-3 rounded-lg border border-surface-200/60 flex justify-between items-center">
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
                  <div className="bg-surface-50 rounded-xl p-5 border border-surface-200/40">
                    <h3 className="text-sm font-bold text-surface-900 mb-4">Customer Information</h3>
                    <div className="space-y-3">
                      <div><label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Customer Name</label><input value={saleCustomer.name} onChange={e => setSaleCustomer({...saleCustomer, name: e.target.value})} className="mt-1 w-full px-3 py-2 border border-blue-400 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Email</label><input value={saleCustomer.email} onChange={e => setSaleCustomer({...saleCustomer, email: e.target.value})} className="mt-1 w-full px-3 py-2 border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-primary-800" /></div>
                        <div><label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Phone</label><input value={saleCustomer.phone} onChange={e => setSaleCustomer({...saleCustomer, phone: e.target.value})} className="mt-1 w-full px-3 py-2 border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-primary-800" /></div>
                      </div>
                      <div><label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Billing Address</label><input value={saleCustomer.address} onChange={e => setSaleCustomer({...saleCustomer, address: e.target.value})} className="mt-1 w-full px-3 py-2 border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-primary-800" /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Delivery Address</label><input value={saleCustomer.delivery_address} onChange={e => setSaleCustomer({...saleCustomer, delivery_address: e.target.value})} className="mt-1 w-full px-3 py-2 border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-primary-800" /></div>
                        <div><label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">PAN Card Number</label><input value={saleCustomer.pan_number} onChange={e => setSaleCustomer({...saleCustomer, pan_number: e.target.value})} className="mt-1 w-full px-3 py-2 border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-primary-800 uppercase" /></div>
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
                                }} className="rounded border-surface-300 text-primary-800 focus:ring-primary-800 w-4 h-4 cursor-pointer" />
                                {method}
                              </label>
                            ))}
                          </div>
                        </div>
                        <div><label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Discount %</label><input value={saleCustomer.discount} onChange={e => setSaleCustomer({...saleCustomer, discount: e.target.value})} type="number" className="mt-1 w-full px-3 py-2 border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-primary-800" /></div>
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
                                    {isLastField && <span className="ml-1 text-[#C5A059] normal-case font-normal">(auto)</span>}
                                  </label>
                                  <input
                                    value={saleCustomer[field.key] as string}
                                    onChange={e => handleAmountChange(method, e.target.value)}
                                    readOnly={isLastField}
                                    type="number"
                                    className={`mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none bg-white ${isLastField ? 'border-amber-300 bg-amber-50/50 text-amber-800 cursor-not-allowed' : 'border-surface-200/60 focus:border-primary-800'}`}
                                    placeholder={field.placeholder}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}

                      <div><label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Transport Cost</label><input value={saleCustomer.transport_cost} onChange={e => setSaleCustomer({...saleCustomer, transport_cost: e.target.value})} type="number" className="mt-1 w-full px-3 py-2 border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-primary-800" /></div>
                      <div><label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Notes (Optional)</label><textarea value={saleCustomer.notes} onChange={e => setSaleCustomer({...saleCustomer, notes: e.target.value})} rows={3} placeholder="Add any additional notes for this sale..." className="mt-1 w-full px-3 py-2 border border-surface-200/60 rounded-lg text-sm focus:outline-none focus:border-primary-800 resize-none"></textarea></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {saleStep === 'cart' && (
              <div className="px-6 py-4 border-t border-surface-200/40 flex justify-end gap-3">
                <button onClick={() => setIsNewSaleOpen(false)} className="px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold border border-surface-200 text-surface-500 hover:bg-white hover:text-surface-900 transition-all duration-300">Cancel</button>
                <button onClick={submitSale} disabled={saleSubmitting || cart.length === 0} className="px-6 py-2 bg-[#0b5c2a] text-white rounded-lg text-sm font-semibold hover:bg-green-800 flex items-center gap-2 disabled:opacity-50">
                  {saleSubmitting ? 'Processing...' : (<><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Complete Sale</>)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-surface-200/40 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-surface-900 flex items-center gap-2">
                <div className="bg-blue-100 text-primary-900 p-1.5 rounded-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </div>
                Edit Product
              </h2>
              <button onClick={() => setEditProduct(null)} className="text-surface-400 hover:text-surface-600 p-1"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>

            <form onSubmit={submitEditProduct} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Item Code *</label>
                  <input required name="item_code" value={editFormData.item_code} onChange={handleEditInputChange} type="text" className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">HSN Code</label>
                  <input name="hsn_code" value={editFormData.hsn_code} onChange={handleEditInputChange} type="text" className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Category</label>
                  <input list="categories" name="category" value={editFormData.category} onChange={handleEditInputChange} placeholder="Select or type..." className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none" />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Product Name *</label>
                  <input required name="name" value={editFormData.name} onChange={handleEditInputChange} type="text" className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none" />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Description</label>
                  <textarea name="description" value={editFormData.description} onChange={handleEditInputChange} rows={4} className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none resize-none"></textarea>
                </div>

                <div className="grid grid-cols-4 gap-3 md:col-span-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">CP *</label>
                    <input required name="cost_price" value={editFormData.cost_price} onChange={handleEditInputChange} type="number" placeholder="Cost Price" className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">GST% *</label>
                    <select required name="gst_percentage" value={editFormData.gst_percentage} onChange={handleEditInputChange} className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none">
                      <option value="">Select GST%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">PF% *</label>
                    <input required name="profit_percentage" value={editFormData.profit_percentage} onChange={handleEditInputChange} type="number" step="0.01" placeholder="Profit %" className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">&nbsp;</label>
                    <input readOnly value={editFormData.profit_amount ? `₹${editFormData.profit_amount}` : ''} type="text" placeholder="Profit Amt" className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-500 outline-none cursor-not-allowed" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">SP (Auto Calculated)</label>
                  <input readOnly value={editFormData.price ? `₹${Number(editFormData.price).toLocaleString()}` : ''} type="text" placeholder="Sale Price = CP + GST + Profit" className="w-full bg-green-50 border-2 border-green-300 rounded-xl px-4 py-3 text-green-800 font-bold text-lg outline-none cursor-not-allowed" />
                  {editFormData.cost_price && editFormData.gst_percentage && editFormData.profit_percentage && (
                    <p className="text-[10px] text-surface-400 mt-1">
                      CP ₹{editFormData.cost_price} + GST ₹{Math.round(Number(editFormData.cost_price) * Number(editFormData.gst_percentage) / 100)} ({editFormData.gst_percentage}%) + Profit ₹{editFormData.profit_amount} ({editFormData.profit_percentage}%) = SP ₹{editFormData.price}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Quantity in Stock *</label>
                  <input required name="quantity_in_stock" value={editFormData.quantity_in_stock} onChange={handleEditInputChange} type="number" className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-1">Low Stock Alert</label>
                  <input name="low_stock_threshold" value={editFormData.low_stock_threshold} onChange={handleEditInputChange} type="number" className="w-full bg-surface-100 border border-surface-200/80 rounded-xl px-4 py-3 text-surface-900 focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/40 outline-none transition-all resize-none" />
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-surface-200/40 flex justify-end gap-3">
                <button type="button" onClick={() => setEditProduct(null)} className="px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold border border-surface-200 text-surface-500 hover:bg-white hover:text-surface-900 transition-all duration-300">Cancel</button>
                <button type="submit" className="px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold bg-primary-900 text-surface-50 hover:bg-primary-800 shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* View Invoice Modal (Luxury Edition) */}
      {viewInvoice && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 bg-surface-900/40 backdrop-blur-sm print:bg-white print:p-0 print:block print:static">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] w-full max-w-5xl max-h-[90vh] overflow-y-auto print:shadow-none print:w-full print:max-w-full print:h-auto print:max-h-none print:rounded-none relative border border-white/60 print:border-none print:overflow-visible">
            
            {/* Header (Non-printable) */}
            <div className="px-8 py-5 border-b border-surface-200/40 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-xl z-20 print:hidden rounded-t-3xl">
              <h2 className="text-xl font-display text-surface-900 flex items-center gap-2">Invoice <span className="italic text-[#C5A059]">Detail</span></h2>
              <div className="flex gap-3">
                <button onClick={() => window.print()} className="px-5 py-2 bg-surface-900 text-white rounded-full text-sm font-semibold hover:bg-[#C5A059] transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  Export PDF
                </button>
                <button onClick={() => setViewInvoice(null)} className="text-surface-400 hover:text-surface-900 p-2 bg-surface-100 hover:bg-surface-200 rounded-full transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
            </div>

            {/* Printable Area */}
            <div className="p-10 md:p-14 print:p-6 print:m-0" id="invoice-printable">
              
              {/* Brand & Document Header */}
              <div className="flex justify-between items-start mb-12 print:mb-5 border border-surface-200/60 print:border-surface-300 rounded-2xl print:rounded-lg p-6 print:p-4">
                <div>
                  <div className="w-48 h-12 relative mb-4">
                     <Image src="/Logo/LOGO main.svg" alt="Comfort Palace" fill className="object-contain object-left print:grayscale" priority />
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {/* GST */}
                    <p className="text-sm font-semibold text-surface-700">GST: 29AADFC9976H1ZO</p>
                    {/* Email */}
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-[#C5A059] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-surface-500 font-light">thecomfortpalace123@gmail.com</span>
                    </div>
                    {/* Phone */}
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-[#C5A059] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm text-surface-500 font-light">+91 95914 88660</span>
                    </div>
                    {/* Address */}
                    <div className="flex items-start gap-1.5">
                      <svg className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-xs text-surface-500 font-light leading-snug">#6, R.T nagar Main Road,<br/>Opp R.T Nagar Post Office, Bangalore 560032</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <h1 className="text-4xl font-display font-light text-surface-900 tracking-tight uppercase">Invoice</h1>
                  <p className="text-sm text-surface-500 mt-2 font-mono">{viewInvoice.sale_number || `#${viewInvoice.id.slice(0,8)}`}</p>
                  <p className="text-sm font-semibold text-surface-900 mt-1">{formatSaleDate(viewInvoice)}</p>
                  <div className="mt-4 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-[#C5A059]/30 text-[#C5A059] bg-[#C5A059]/5">
                    {viewInvoice.payment_status || 'Pending'}
                  </div>
                </div>
              </div>



              {/* Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 print:gap-4 mb-6 print:mb-4 print:break-inside-avoid">
                <div className="bg-surface-50/50 p-4 print:p-3 rounded-2xl border border-surface-200/40">
                  <p className="text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em] mb-2 print:mb-1.5 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Billed To
                  </p>
                  <div className="grid grid-cols-2 gap-4 print:gap-2">
                    <div>
                      <h3 className="text-lg print:text-base font-display text-surface-900">{viewInvoice.customer_name || 'Walk-in Customer'}</h3>
                      {viewInvoice.customer_phone && <p className="text-sm print:text-xs text-surface-600 font-mono mt-1">{viewInvoice.customer_phone}</p>}
                    </div>
                    <div>
                      {viewInvoice.customer_email && <p className="text-sm print:text-xs text-surface-600 truncate" title={viewInvoice.customer_email}>{viewInvoice.customer_email}</p>}
                      {viewInvoice.customer_address && <p className="text-sm print:text-xs text-surface-600 mt-1 leading-relaxed">{viewInvoice.customer_address}</p>}
                    </div>
                  </div>
                  {viewInvoice.pan_number && viewInvoice.pan_number !== 'NULL' && viewInvoice.pan_number !== 'null' && <p className="text-xs print:text-[10px] font-semibold text-surface-500 mt-2 print:mt-1 uppercase">PAN: <span className="text-surface-900">{viewInvoice.pan_number}</span></p>}
                </div>

                <div className="bg-surface-50/50 p-4 print:p-3 rounded-2xl border border-surface-200/40">
                  <p className="text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em] mb-2 print:mb-1.5 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Delivery To
                  </p>
                  {viewInvoice.delivery_address ? (
                    <p className="text-sm print:text-xs text-surface-600 leading-relaxed whitespace-pre-wrap">{viewInvoice.delivery_address}</p>
                  ) : (
                    <p className="text-sm print:text-xs text-surface-400 italic">Same as billing address</p>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="rounded-2xl border border-surface-200/60 overflow-x-auto mb-12 print:mb-5">
                <table className="w-full text-left border-collapse min-w-[750px] print:min-w-0">
                  <thead>
                    <tr className="bg-surface-50/80 border-b border-surface-200/60">
                      <th className="py-4 print:py-1.5 px-3 print:px-1.5 text-[10px] print:text-[8px] font-bold text-surface-400 uppercase tracking-widest text-center w-10 print:w-6">Sl.No</th>
                      <th className="py-4 print:py-1.5 px-4 print:px-1.5 text-[10px] print:text-[8px] font-bold text-surface-400 uppercase tracking-widest">Product</th>
                      <th className="py-4 print:py-1.5 px-4 print:px-1.5 text-[10px] print:text-[8px] font-bold text-surface-400 uppercase tracking-widest text-center">Qty</th>
                      <th className="py-4 print:py-1.5 px-4 print:px-1.5 text-[10px] print:text-[8px] font-bold text-surface-400 uppercase tracking-widest text-right">
                        Unit Price<br/><span className="font-normal normal-case text-[9px] print:text-[7px]">(excl. GST)</span>
                      </th>
                      <th className="py-4 print:py-1.5 px-4 print:px-1.5 text-[10px] print:text-[8px] font-bold text-surface-400 uppercase tracking-widest text-right">
                        GST<br/><span className="font-normal normal-case text-[9px] print:text-[7px]">(GST%/2)</span>
                      </th>
                      <th className="py-4 print:py-1.5 px-4 print:px-1.5 text-[10px] print:text-[8px] font-bold text-surface-400 uppercase tracking-widest text-right">
                        CGST<br/><span className="font-normal normal-case text-[9px] print:text-[7px]">(GST%/2)</span>
                      </th>
                      <th className="py-4 print:py-1.5 px-4 print:px-1.5 text-[10px] print:text-[8px] font-bold text-surface-400 uppercase tracking-widest text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(viewInvoice.sale_items || []).map((item: any, idx: number) => {
                      const image = item.product_image_url ? getFirstImage(item.product_image_url) : null;
                      const gstPct = Number(item.gst_percentage || item.product_gst_percentage || 0);
                      const qty = Number(item.quantity) || 1;
                      const spPerUnit = Number(item.unit_price) || 0; // SP = CP + GST + Profit
                      const lineTotal = Number(item.total_price) || spPerUnit * qty;

                      // Taxable value (CP + Profit, pre-GST) per line:
                      // SP = taxable * (1 + gst%/100)  =>  taxable = SP / (1 + gst%/100)
                      const lineTaxable = gstPct > 0 ? lineTotal / (1 + gstPct / 100) : lineTotal;
                      const unitPriceExGST = lineTaxable / qty; // per-unit pre-GST price
                      const totalGstAmt = lineTotal - lineTaxable;  // total GST on this line
                      const halfGst = totalGstAmt / 2; // GST col = CGST col = half each

                      return (
                        <tr key={idx} className="border-b border-surface-100 last:border-0 hover:bg-surface-50/30 transition-colors">
                          {/* Sl.No */}
                          <td className="py-5 print:py-2 px-3 print:px-1.5 text-sm print:text-[10px] text-surface-400 font-mono text-center">{idx + 1}</td>
                          {/* Product */}
                          <td className="py-5 print:py-2 px-4 print:px-1.5">
                            <div className="flex items-center gap-3 print:gap-1.5">
                              <div className="w-12 h-12 rounded-lg border border-surface-200 overflow-hidden bg-white shrink-0 flex items-center justify-center print:hidden">
                                {image ? <img src={image} alt={item.product_name} className="w-full h-full object-cover" /> : <div className="w-6 h-6 bg-surface-200 rounded-sm"></div>}
                              </div>
                              <div>
                                <p className="text-sm print:text-[10px] font-bold text-surface-900">{item.product_name || `Product ID: ${item.product_id.slice(0,8)}`}</p>
                                {item.product_item_code && <p className="text-[10px] print:text-[8px] text-surface-400 font-mono mt-0.5">{item.product_item_code}</p>}
                              </div>
                            </div>
                          </td>
                          {/* Qty */}
                          <td className="py-5 print:py-2 px-4 print:px-1.5 text-sm print:text-[10px] text-surface-600 font-semibold text-center">{item.quantity}</td>
                          {/* Unit Price (excl. GST) */}
                          <td className="py-5 print:py-2 px-4 print:px-1.5 text-sm print:text-[10px] text-surface-600 text-right whitespace-nowrap">
                            ₹{unitPriceExGST.toFixed(2)}
                          </td>
                          {/* GST (half) */}
                          <td className="py-5 print:py-2 px-4 print:px-1.5 text-right whitespace-nowrap">
                            {gstPct > 0 ? (
                              <div>
                                <p className="text-sm print:text-[10px] text-surface-600">₹{halfGst.toFixed(2)}</p>
                                <p className="text-[9px] print:text-[7px] text-surface-400">{gstPct / 2}%</p>
                              </div>
                            ) : (
                              <span className="text-sm print:text-[10px] text-surface-400">—</span>
                            )}
                          </td>
                          {/* CGST (half) */}
                          <td className="py-5 print:py-2 px-4 print:px-1.5 text-right whitespace-nowrap">
                            {gstPct > 0 ? (
                              <div>
                                <p className="text-sm print:text-[10px] text-surface-600">₹{halfGst.toFixed(2)}</p>
                                <p className="text-[9px] print:text-[7px] text-surface-400">{gstPct / 2}%</p>
                              </div>
                            ) : (
                              <span className="text-sm print:text-[10px] text-surface-400">—</span>
                            )}
                          </td>
                          {/* Total (inclusive of GST) */}
                          <td className="py-5 print:py-2 px-4 print:px-1.5 text-sm print:text-[10px] text-surface-900 font-bold text-right whitespace-nowrap">₹{lineTotal.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer Summary area */}
              <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-12 print:gap-6 print:break-inside-avoid">
                
                {/* Notes and Payment Splitting */}
                <div className="space-y-8">
                  <div className="bg-surface-50/50 p-6 print:p-3 rounded-2xl border border-surface-200/40">
                    <p className="text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em] mb-4">Payment Summary</p>
                    <div className="space-y-2 text-sm text-surface-600">
                      <div className="flex justify-between items-center pb-2 border-b border-surface-200/40">
                        <span className="capitalize">Method(s)</span>
                        <span className="font-semibold text-surface-900">{viewInvoice.payment_method || 'Cash'}</span>
                      </div>
                      
                      {(viewInvoice.cash_amount > 0 || viewInvoice.upi_amount > 0 || viewInvoice.card_amount > 0 || viewInvoice.bank_transfer_amount > 0) && (
                        <div className="pt-2 space-y-2">
                          {viewInvoice.cash_amount > 0 && (
                            <div className="flex justify-between items-center text-xs">
                              <span>Cash Portion</span>
                              <span className="font-mono">₹{viewInvoice.cash_amount.toLocaleString()}</span>
                            </div>
                          )}
                          {viewInvoice.upi_amount > 0 && (
                            <div className="flex justify-between items-center text-xs">
                              <span>UPI Portion</span>
                              <span className="font-mono">₹{viewInvoice.upi_amount.toLocaleString()}</span>
                            </div>
                          )}
                          {viewInvoice.card_amount > 0 && (
                            <div className="flex justify-between items-center text-xs">
                              <span>Card Portion</span>
                              <span className="font-mono">₹{viewInvoice.card_amount.toLocaleString()}</span>
                            </div>
                          )}
                          {viewInvoice.bank_transfer_amount > 0 && (
                            <div className="flex justify-between items-center text-xs">
                              <span>Bank Transfer Portion</span>
                              <span className="font-mono">₹{viewInvoice.bank_transfer_amount.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {viewInvoice.notes && viewInvoice.notes !== 'null' && viewInvoice.notes !== 'NULL' && (
                    <div>
                      <p className="text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em] mb-2">Remarks</p>
                      <p className="text-sm text-surface-600 leading-relaxed italic border-l-2 border-[#C5A059] pl-4 py-1">{viewInvoice.notes}</p>
                    </div>
                  )}
                </div>

                {/* Grand Total Breakdown */}
                <div className="flex justify-end">
                  <div className="w-full max-w-sm">
                    <div className="bg-surface-900 text-white rounded-3xl p-8 print:p-4 shadow-2xl relative overflow-hidden print:bg-white print:text-surface-900 print:shadow-none print:border print:border-surface-300">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 print:hidden"></div>
                      
                      <div className="space-y-4 relative z-10">
                        <div className="flex justify-between text-sm text-surface-300 print:text-surface-600">
                          <span>Subtotal</span>
                          <span>₹{((viewInvoice.total_amount || 0) + (viewInvoice.discount_amount || 0) - (viewInvoice.tax_amount || 0)).toLocaleString()}</span>
                        </div>
                        
                        {(viewInvoice.tax_amount || 0) > 0 && (
                          <div className="flex justify-between text-sm text-surface-300 print:text-surface-600">
                            <span>Transport Cost</span>
                            <span>+₹{viewInvoice.tax_amount.toLocaleString()}</span>
                          </div>
                        )}
                        
                        {(viewInvoice.discount_amount || 0) > 0 && (
                          <div className="flex justify-between text-sm text-[#C5A059] print:text-green-600">
                            <span>Discount</span>
                            <span>-₹{viewInvoice.discount_amount.toLocaleString()}</span>
                          </div>
                        )}
                        
                        <div className="border-t border-surface-700/50 print:border-surface-200 pt-6 mt-6">
                          <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Grand Total</p>
                          <div className="flex justify-between items-end">
                            <span className="text-4xl font-display font-light text-white print:text-surface-900">
                              ₹{viewInvoice.total_amount?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-6">
                       <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest flex items-center justify-center gap-2">
                         <svg className="w-3 h-3 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                         Authorized Signature
                       </p>
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Footer */}
              <div className="mt-10 print:mt-5 pt-6 print:pt-3 border-t border-surface-200/40 text-center">
                <p className="text-xs text-surface-400">Thank you for your business. For any queries regarding this invoice, please contact support.</p>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
