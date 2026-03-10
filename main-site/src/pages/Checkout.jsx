import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Upload, CreditCard, CheckCircle2, Loader2, Activity, User, Mail, Lock, Phone, ArrowRight, LogIn } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { getApiUrl, apiFetch } from '../config';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  
  // Auth state for non-logged in users
  const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'login'
  const [authData, setAuthData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [authProcessing, setAuthProcessing] = useState(false);
  const [authError, setAuthError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    city: '',
    whatsapp: '',
    email: '',
    orderNotes: ''
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(location.state?.initialCoupon || null);
  const [applying, setApplying] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user?.email) {
      setFormData(prev => ({ 
        ...prev, 
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        whatsapp: user.phone || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuthInputChange = (e) => {
    const { name, value } = e.target;
    setAuthData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthProcessing(true);
    setAuthError('');

    try {
      if (authMode === 'signup') {
        // 1. Firebase Auth Signup
        const userCredential = await createUserWithEmailAndPassword(auth, authData.email, authData.password);
        const fbUser = userCredential.user;

        // 2. Update Profile
        await updateProfile(fbUser, { displayName: authData.name });

        // 3. Register in Backend
        const regRes = await apiFetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            uid: fbUser.uid, 
            email: fbUser.email, 
            displayName: authData.name,
            phone: authData.phone
          })
        });
        const regData = await regRes.json();

        // 4. Mirror to Firestore
        await setDoc(doc(db, "users", fbUser.uid), {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: authData.name,
          phone: authData.phone,
          referenceNumber: regData.referenceNumber || 'PENDING',
          status: 'active',
          createdAt: serverTimestamp(),
          lastSignIn: serverTimestamp()
        });

      } else {
        // Firebase Login
        await signInWithEmailAndPassword(auth, authData.email, authData.password);
      }
    } catch (err) {
      console.error(err);
      setAuthError(err.message.includes('email-already-in-use') 
        ? 'Email already registered. Try logging in.' 
        : err.message.includes('user-not-found') || err.message.includes('wrong-password')
        ? 'Invalid email or password.'
        : 'Authentication failed. Please check your details.');
    } finally {
      setAuthProcessing(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplying(true);
    setCouponError('');
    try {
      const res = await fetch(`${getApiUrl()}/api/coupons/validate/${couponCode}?amount=${subtotal}`);
      const data = await res.json();
      if (data.ok) {
        setAppliedCoupon(data.coupon);
        setCouponCode('');
      } else {
        setCouponError(data.message);
      }
    } catch (err) {
      setCouponError('Failed to validate coupon');
    } finally {
      setApplying(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const handlePlaceOrder = async () => {
    if (!formData.firstName || !formData.whatsapp || !selectedFile) {
      alert("Please fill in all required fields and upload the payment screenshot.");
      return;
    }

    setOrderLoading(true);
    try {
      const fd = new FormData();
      fd.append('firstName', formData.firstName);
      fd.append('lastName', formData.lastName);
      fd.append('city', formData.city);
      fd.append('phone', formData.whatsapp);
      fd.append('email', formData.email);
      fd.append('notes', formData.orderNotes);
      fd.append('screenshot', selectedFile);
      fd.append('amount', total);
      fd.append('total', total);
      fd.append('items', JSON.stringify(cartItems));
      
      if (appliedCoupon) {
        fd.append('couponCode', appliedCoupon.code);
      }

      // If we have a main course (from first item)
      if (cartItems.length > 0) {
        fd.append('courseId', cartItems[0].id || cartItems[0]._id);
        fd.append('courseTitle', cartItems[0].title);
      }

      const res = await fetch(`${getApiUrl()}/api/orders`, {
        method: 'POST',
        body: fd
      });

      const data = await res.json();
      if (data.ok || data.success) {
        setOrderSuccess(true);
        clearCart();
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    } finally {
      setOrderLoading(false);
    }
  };

  const parsePrice = (priceVal) => {
    if (!priceVal) return 0;
    const str = String(priceVal).toLowerCase();
    if (str === 'free') return 0;
    const cleaned = str.replace(/[^0-9]/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + parsePrice(item.price), 0);
  const tax = 0;
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discount = (subtotal * appliedCoupon.value) / 100;
    } else {
      discount = appliedCoupon.value;
    }
  }

  const total = subtotal + tax - discount;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-brand mx-auto mb-4" size={40} />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Establishing Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans flex flex-col">
      <Header />
      
      <main className="flex-grow pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h1 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">
            Checkout
          </h1>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Column: Form or Auth */}
            <div className="w-full lg:w-[60%] shrink-0 space-y-6">
              
              {!user ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-brand/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand/10">
                      {authMode === 'signup' ? <User className="text-brand" size={32} /> : <LogIn className="text-brand" size={32} />}
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      {authMode === 'signup' ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      {authMode === 'signup' ? 'Join our community to proceed' : 'Sign in to access your details'}
                    </p>
                  </div>

                  {authError && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[11px] font-bold mb-6 border border-red-100 flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mt-1 shrink-0"></div>
                      <p>{authError}</p>
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {authMode === 'signup' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={16} />
                          <input 
                            type="text" name="name" required value={authData.name} onChange={handleAuthInputChange}
                            placeholder="Full Name"
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand/30 outline-none text-sm transition-all"
                          />
                        </div>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={16} />
                          <input 
                            type="tel" name="phone" required value={authData.phone} onChange={handleAuthInputChange}
                            placeholder="WhatsApp Number"
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand/30 outline-none text-sm transition-all"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={16} />
                      <input 
                        type="email" name="email" required value={authData.email} onChange={handleAuthInputChange}
                        placeholder="Email Address"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand/30 outline-none text-sm transition-all"
                      />
                    </div>

                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={16} />
                      <input 
                        type="password" name="password" required value={authData.password} onChange={handleAuthInputChange}
                        placeholder="Password (Min 6 chars)" minLength={6}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand/30 outline-none text-sm transition-all"
                      />
                    </div>

                    <button 
                      type="submit" disabled={authProcessing}
                      className="w-full py-4 bg-brand text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-brand/20 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {authProcessing ? <Loader2 className="animate-spin" size={16} /> : (
                        <>
                          {authMode === 'signup' ? 'Create Account & Continue' : 'Sign In & Continue'}
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {authMode === 'signup' ? 'Already have an account?' : "Don't have an account yet?"}
                      <button 
                        onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                        className="ml-2 text-brand hover:underline"
                      >
                        {authMode === 'signup' ? 'Log in' : 'Register now'}
                      </button>
                    </p>
                  </div>
                </div>
              ) : (
                <>
                {/* Logged in indicator */}
                <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-lg px-4 py-3 flex justify-between items-center text-sm mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
                  <div>
                    <span className="text-blue-900">Signed in as </span>
                    <span className="font-bold text-blue-900">{user.email}</span>
                  </div>
                  <button onClick={() => auth.signOut()} className="text-blue-700 font-bold hover:underline text-xs">
                    Sign out
                  </button>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500 delay-150">
                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] font-bold text-brand uppercase tracking-wider absolute -top-2 left-3 bg-[#F9FAFB] px-1">First name</label>
                    <input 
                      type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors bg-transparent"
                      placeholder="First Name"
                    />
                  </div>
                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] font-bold text-brand uppercase tracking-wider absolute -top-2 left-3 bg-[#F9FAFB] px-1">Last name</label>
                    <input 
                      type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors bg-transparent"
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] font-bold text-brand uppercase tracking-wider absolute -top-2 left-3 bg-[#F9FAFB] px-1">Town / City</label>
                    <input 
                      type="text" name="city" value={formData.city} onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors bg-transparent"
                      placeholder="Town / City"
                    />
                  </div>
                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] font-bold text-brand uppercase tracking-wider absolute -top-2 left-3 bg-[#F9FAFB] px-1">WhatsApp number</label>
                    <input 
                      type="text" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors bg-transparent"
                      placeholder="WhatsApp Number"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-1.5 relative mt-4">
                    <label className="text-[11px] font-bold text-brand uppercase tracking-wider absolute -top-2 left-3 bg-[#F9FAFB] px-1">Email address</label>
                    <input 
                      type="email" name="email" value={formData.email} disabled
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Upload Section */}
                <div className="mt-8 space-y-3 pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900">Upload payment screenshot</h3>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-sm font-bold text-brand hover:bg-slate-50 transition-colors">
                      <Upload size={16} />
                      <span>Choose file</span>
                      <input type="file" className="hidden" accept="image/jpeg,image/png" onChange={handleFileChange} />
                    </label>
                    <span className="text-xs text-slate-400">Max 5 MB • JPG/PNG</span>
                  </div>
                  {selectedFile && (
                    <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
                      <CheckCircle2 size={14} /> {selectedFile.name} attached
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-2">
                    Upload JazzCash / Easypaisa / Bank transfer receipt.
                  </p>
                </div>

                {/* Order Notes */}
                <div className="mt-6">
                  <textarea 
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                    placeholder="Order notes (optional)"
                    rows={4}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors bg-transparent resize-y"
                  />
                </div>

                 <div className="pt-4">
                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={orderLoading}
                    className="w-full py-4 bg-[#E31B23] hover:bg-[#c2171e] text-white text-[16px] font-black rounded-lg transition-colors shadow-lg shadow-brand/10 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {orderLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Processing...
                      </>
                    ) : (
                      'Place order'
                    )}
                  </Button>
                </div>
                </>
              )}

            </div>

            {/* Right Column: Order Details */}
            <div className="w-full lg:w-[40%] shrink-0">
              
              {/* Your Order Card */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-6 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Your order</h3>
                  
                  <div className="space-y-3 text-[14px]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="font-bold text-slate-900">Rs. {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Tax</span>
                      <span className="text-slate-500">Rs. {tax}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Discount</span>
                      <span className={`${discount > 0 ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                        {discount > 0 ? `- Rs. ${discount.toLocaleString()}` : `Rs. 0`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4 mt-2 border-t border-slate-100">
                      <span className="text-[15px] font-black text-slate-900">Total</span>
                      <span className="text-lg font-black text-slate-900">Rs. {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="px-6 pb-6 pt-2 border-t border-slate-50">
                  {appliedCoupon ? (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center justify-between animate-in zoom-in-95 duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                          <CheckCircle2 size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">{appliedCoupon.code}</p>
                          <p className="text-[9px] font-bold text-emerald-600 uppercase">{appliedCoupon.label}</p>
                        </div>
                      </div>
                      <button 
                        onClick={removeCoupon}
                        className="text-[10px] font-black text-emerald-700 hover:text-emerald-900 uppercase tracking-widest bg-white/50 px-3 py-1.5 rounded-lg border border-emerald-100/50 transition-all hover:bg-white"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="PROMO CODE" 
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-brand/20 transition-all uppercase tracking-widest placeholder:text-slate-300"
                        />
                        <button 
                          onClick={handleApplyCoupon}
                          disabled={applying || !couponCode.trim()}
                          className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand transition-all disabled:opacity-50 shadow-lg shadow-slate-900/10"
                        >
                          {applying ? '...' : 'Apply'}
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider flex items-center gap-1 animate-in shake duration-300 px-1">
                          <CheckCircle2 size={12} className="rotate-45" /> {couponError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 border-t items-center border-slate-100 p-6 space-y-4">
                  {cartItems.map((item) => {
                    const itemImage = item.image?.startsWith('http') 
                      ? item.image 
                      : `${getApiUrl().replace(/\/$/, '')}${item.image?.startsWith('/') ? '' : '/'}${item.image}`;
                    
                    return (
                      <div key={item.id || item._id} className="flex gap-4">
                        <div className="w-16 h-10 shrink-0 rounded bg-slate-200 overflow-hidden border border-slate-200">
                           <img src={itemImage} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-[12px] font-bold text-slate-900 leading-tight mb-1 line-clamp-2">{item.title}</h4>
                          <p className="text-[10px] text-slate-500">Online Training • Al-Haq Learning Hub</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Payment Methods Card */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm text-center overflow-hidden">
                <div className="bg-[#E31B23] text-white py-3 px-6 text-sm font-bold flex items-center justify-center gap-2">
                  <CreditCard size={18} />
                  Payment Methods
                </div>
                
                <div className="p-6">
                   <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 inline-block px-3 relative w-full header-lines">
                     <span className="bg-white relative z-10 px-3">SCAN QR CODE</span>
                     <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-200 z-0"></div>
                   </h4>

                   {/* Mock QR Code space */}
                   <div className="w-40 h-40 mx-auto border-4 border-slate-100 rounded-xl p-2 mb-6">
                     <div className="w-full h-full bg-slate-100 flex items-center justify-center rounded">
                       <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">QR CODE</span>
                     </div>
                   </div>

                   {/* Till ID */}
                   <div className="max-w-[280px] mx-auto border-2 border-[#F59E0B] rounded-xl pr-2 pl-2 pb-6 pt-5 mb-8 relative">
                     <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 flex items-center gap-1.5 text-[11px] font-bold text-[#F59E0B] tracking-wider">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></div>
                       TILL ID
                       <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></div>
                     </div>
                     <div className="text-[26px] font-black text-slate-900 tracking-[0.2em] mb-3 font-mono">
                       981425710
                     </div>
                     <div className="text-[10px] text-slate-500 flex items-center justify-center gap-2 font-medium">
                       Dial <span className="bg-slate-900 text-white font-mono px-1.5 py-0.5 rounded text-[10px]">*786*10#</span> • Enter TILL ID
                     </div>
                   </div>

                   <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 inline-block px-3 relative w-full header-lines opacity-70">
                     <span className="bg-white relative z-10 px-3">BANK TRANSFER</span>
                     <div className="absolute top-1/2 left-0 w-full h-[1px] border-b border-dashed border-slate-300 z-0"></div>
                   </h4>

                   {/* Bank Details */}
                   <div className="space-y-2 text-left text-sm max-w-[280px] mx-auto">
                     <div className="flex justify-between items-center py-2 border-b border-slate-100">
                       <span className="text-slate-500 text-[11px] font-bold tracking-wider uppercase">Account Title</span>
                       <span className="font-bold text-slate-900 text-xs">Al-Haq Learning Hub</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-slate-100">
                       <span className="text-slate-500 text-[11px] font-bold tracking-wider uppercase">Account No</span>
                       <span className="font-bold text-slate-900 text-xs">2119337597428</span>
                     </div>
                     <div className="bg-[#eff6ff] rounded-lg p-3 my-3">
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-blue-600 text-[11px] font-bold tracking-wider uppercase">IBAN</span>
                         <span className="text-blue-400 text-[9px] uppercase tracking-wider">International</span>
                       </div>
                       <div className="text-blue-900 font-mono text-xs font-bold break-all">
                         PK50UNIL0109000337597428
                       </div>
                     </div>
                     <div className="bg-[#1e40af] rounded-lg p-3 text-white text-center">
                       <div className="font-black text-[13px] tracking-wide mb-0.5">United Bank Limited</div>
                       <div className="text-[9px] text-blue-200 tracking-wider">UBL Pakistan</div>
                     </div>
                   </div>
                </div>

                <div className="bg-[#f8fafc] p-4 text-[10px] sm:text-[11px] text-blue-800 font-medium flex items-center justify-center gap-2 border-t border-slate-200 border-dashed">
                  <div className="w-4 h-4 rounded overflow-hidden mt-0.5 opacity-80 shrink-0"><Upload size={14} className="mt-[-2px] ml-0.5" /></div>
                  <div className="text-left leading-tight">
                    Upload payment screenshot above <br/>
                    Enrollment confirmed after verification
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Success Modal Overlay */}
      {orderSuccess && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-500">
           <div className="bg-white rounded-[40px] max-w-lg w-full p-10 text-center shadow-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-emerald-400 to-teal-500"></div>
              
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[35px] flex items-center justify-center mx-auto mb-8 border-2 border-emerald-100/50 shadow-inner">
                 <CheckCircle2 size={48} />
              </div>

              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Order Received!</h2>
              <p className="text-sm font-bold text-slate-500 leading-relaxed uppercase tracking-widest mb-10">
                  Your enrollment request has been submitted. Our team will verify the payment and authorize your access within <span className="text-brand">6-12 hours</span>.
              </p>

              <div className="space-y-4">
                <Link to="/" className="block w-full py-4 bg-brand text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-brand/20 hover:-translate-y-1 transition-all">
                  Return to Home
                </Link>
                <div className="flex items-center gap-2 justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Activity size={12} className="text-brand" /> Tracking: Pending Confirmation
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
