import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Upload, 
  CreditCard, 
  CheckCircle2, 
  Loader2, 
  Activity, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  ArrowRight, 
  LogIn,
  MapPin,
  AlertCircle
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { getApiUrl, apiFetch } from '../config';
import { auth, db } from '../firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  
  // Auth state for non-logged in users
  const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'login'
  const [authData, setAuthData] = useState({
    password: '',
    confirmPassword: ''
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

  const handleAuthSubmit = async () => {
    if (!formData.email || !authData.password) {
      setAuthError('Email and Password are required.');
      return false;
    }

    if (authMode === 'signup' && authData.password !== authData.confirmPassword) {
      setAuthError('Passwords do not match.');
      return false;
    }

    setAuthProcessing(true);
    setAuthError('');

    try {
      if (authMode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, authData.password);
        const fbUser = userCredential.user;
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();

        await updateProfile(fbUser, { displayName: fullName });

        // Background registration
        apiFetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            uid: fbUser.uid, 
            email: fbUser.email, 
            displayName: fullName,
            phone: formData.whatsapp
          })
        }).then(async (regRes) => {
          const regData = await regRes.json();
          await setDoc(doc(db, "users", fbUser.uid), {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fullName,
            phone: formData.whatsapp,
            referenceNumber: regData.referenceNumber || 'PENDING',
            status: 'active',
            createdAt: serverTimestamp(),
            lastSignIn: serverTimestamp()
          });
        }).catch(err => console.warn('Background registration failed:', err));

        return true;
      } else {
        await signInWithEmailAndPassword(auth, formData.email, authData.password);
        return true;
      }
    } catch (err) {
      console.error(err);
      setAuthError(err.message.includes('email-already-in-use') 
        ? 'Email already registered. Try logging in.' 
        : err.message.includes('user-not-found') || err.message.includes('wrong-password') || err.message.includes('invalid-credential')
        ? 'Invalid email or password.'
        : 'Authentication failed. Please check your details.');
      return false;
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
      const response = await apiFetch(`/api/coupons/validate/${couponCode}?amount=${subtotal}`);
      const data = await response.json();
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
    if (!formData.firstName || !formData.whatsapp || !selectedFile || !formData.email) {
      alert("Please fill in all required fields and upload the payment screenshot.");
      return;
    }

    // Handle authentication if not logged in
    if (!user) {
      const authSuccess = await handleAuthSubmit();
      if (!authSuccess) return;
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

      const response = await apiFetch('/api/orders', {
        method: 'POST',
        body: fd
      });

      const data = await response.json();
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
  
  const discount = appliedCoupon ? (
    appliedCoupon.type === 'percent' 
      ? (subtotal * appliedCoupon.value) / 100 
      : Number(appliedCoupon.value)
  ) : 0;

  const total = Math.max(0, subtotal + tax - discount);

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
      
      <main className="grow pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h1 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">
            Checkout
          </h1>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            <div className="w-full lg:w-[60%] shrink-0 space-y-8">
              
              <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-10 shadow-sm animate-in fade-in slide-in-from-left-4 duration-500">
                {/* 1. Billing Form Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                  <div className="relative group">
                    <label className="text-[11px] font-bold text-brand uppercase tracking-wider absolute -top-2.5 left-4 bg-white px-1.5 z-10">First name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />
                      <input 
                        type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                        placeholder="First Name"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-brand outline-none text-sm font-medium transition-all bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="text-[11px] font-bold text-brand uppercase tracking-wider absolute -top-2.5 left-4 bg-white px-1.5 z-10">Last name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />
                      <input 
                        type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                        placeholder="Last Name"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-brand outline-none text-sm font-medium transition-all bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />
                      <input 
                        type="text" name="city" value={formData.city} onChange={handleInputChange}
                        placeholder="Town / City"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-brand outline-none text-sm font-medium transition-all bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />
                      <input 
                        type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange}
                        placeholder="WhatsApp number"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-brand outline-none text-sm font-medium transition-all bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="col-span-1 sm:col-span-2 relative group">
                    <label className="text-[11px] font-bold text-brand uppercase tracking-wider absolute -top-2.5 left-4 bg-white px-1.5 z-10">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />
                      <input 
                        type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!!user}
                        placeholder="Email address"
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-brand outline-none text-sm font-medium transition-all ${!!user ? 'bg-slate-50 text-slate-400' : 'bg-transparent'}`}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Account Section (Guest only) */}
                {!user && (
                  <div className="mt-12 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-base font-black text-slate-900 tracking-tight">
                        {authMode === 'signup' ? 'Create an account' : 'Sign in to your account'}
                      </h3>
                      <button 
                        type="button"
                        onClick={() => {
                          setAuthMode(authMode === 'signup' ? 'login' : 'signup');
                          setAuthError('');
                        }}
                        className="text-[12px] font-black text-brand hover:underline uppercase tracking-tight"
                      >
                        {authMode === 'signup' ? 'Already have an account?' : 'Need an account? Register'}
                      </button>
                    </div>

                    {authError && (
                      <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[11px] font-bold mb-6 border border-red-100 flex items-start gap-3">
                        <AlertCircle className="shrink-0" size={14} />
                        <p>{authError}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="relative group">
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />
                          <input 
                            type="password" name="password" value={authData.password} onChange={handleAuthInputChange}
                            placeholder="Password"
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-brand outline-none text-sm font-medium transition-all bg-transparent"
                          />
                        </div>
                      </div>

                      {authMode === 'signup' && (
                        <div className="relative group">
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />
                            <input 
                              type="password" name="confirmPassword" value={authData.confirmPassword} onChange={handleAuthInputChange}
                              placeholder="Confirm password"
                              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-brand outline-none text-sm font-medium transition-all bg-transparent"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    {authMode === 'signup' && (
                      <p className="text-[11px] text-slate-400 mt-4 font-medium">Password must be at least 6 characters.</p>
                    )}
                  </div>
                )}

                {user && (
                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-900">Logged in as {user.email}</p>
                      <button onClick={() => auth.signOut()} className="text-[11px] font-bold text-brand hover:underline uppercase tracking-wider">Switch Account</button>
                    </div>
                  </div>
                )}

                {/* 3. Upload Section */}
                <div className="mt-12 pt-8 border-t border-slate-100">
                  <h3 className="text-[16px] font-bold text-slate-900 mb-4">Upload payment screenshot</h3>
                  <div className="flex items-center gap-6">
                    <label className="cursor-pointer flex items-center gap-2 px-6 py-3 border border-dashed border-slate-300 rounded-xl hover:bg-slate-50 transition-all group">
                      <Upload size={20} className="text-brand" />
                      <span className="text-[15px] font-bold text-brand">Choose file</span>
                      <input type="file" className="hidden" accept="image/jpeg,image/png" onChange={handleFileChange} />
                    </label>
                    <span className="text-[15px] text-slate-400 font-medium">Max 5 MB • JPG/PNG</span>
                  </div>
                  <p className="text-[15px] text-slate-500 mt-4 font-medium">
                    Upload JazzCash / Easypaisa / Bank transfer receipt.
                  </p>

                  {selectedFile && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3 animate-in zoom-in-95 max-w-sm">
                      <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shadow-sm">
                        <CheckCircle2 size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[13px] font-black text-brand truncate uppercase tracking-tight">{selectedFile.name}</p>
                        <p className="text-[10px] font-bold text-brand uppercase opacity-60">Attached successfully</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Order Notes */}
                <div className="mt-10 space-y-4 pt-8 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Order notes (optional)</h3>
                  <textarea 
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                    placeholder="Notes about your order, e.g. special requirements for your learning journey."
                    rows={4}
                    className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-brand transition-colors bg-slate-50/30 resize-none font-medium"
                  />
                </div>

                <div className="mt-10">
                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={orderLoading || authProcessing}
                    className="w-full py-5 bg-[#E31B23] hover:bg-[#c2171e] text-white text-[16px] font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    {orderLoading || authProcessing ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Processing...
                      </>
                    ) : (
                      <>
                        Place order
                        <ArrowRight size={18} />
                      </>
                    )}
                  </Button>
                </div>
              </div>

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
                    const baseUrl = getApiUrl().replace(/\/$/, '');
                    const itemImage = item.image 
                      ? (item.image.startsWith('http') ? item.image : `${baseUrl}${item.image.startsWith('/') ? '' : '/'}${item.image}`)
                      : '/thumbnail.webp';
                    
                    return (
                      <div key={item.id || item._id} className="flex gap-4">
                        <div className="w-16 h-10 shrink-0 rounded bg-slate-200 overflow-hidden border border-slate-200">
                           <img 
                             src={itemImage} 
                             alt={item.title} 
                             className="w-full h-full object-cover" 
                             onError={(e) => {
                               e.target.src = '/thumbnail.webp';
                             }}
                           />
                        </div>
                        <div className="grow">
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
                <div className="bg-brand-accent text-white py-3 px-6 text-sm font-bold flex items-center justify-center gap-2">
                  <CreditCard size={18} />
                  Payment Methods
                </div>
                
                <div className="p-6">
                   <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 inline-block px-3 relative w-full header-lines">
                     <span className="bg-white relative z-10 px-3">SCAN QR CODE</span>
                     <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 z-0"></div>
                   </h4>

                   {/* Mock QR Code space */}
                   <div className="w-64 h-64 mx-auto border-4 border-slate-100 rounded-2xl p-2 mb-6 bg-white shadow-inner flex items-center justify-center overflow-hidden">
                     <img 
                       src="/payment%20code.jpeg" 
                       alt="Payment QR Code" 
                       className="w-full h-full object-contain mix-blend-multiply" 
                     />
                   </div>

                   {/* Till ID */}
                   <div className="max-w-70 mx-auto border-2 border-brand-accent rounded-xl pr-2 pl-2 pb-6 pt-5 mb-8 relative">
                     <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 flex items-center gap-1.5 text-[11px] font-bold text-[#F59E0B] tracking-wider">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></div>
                       TILL ID
                       <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></div>
                     </div>
                     <div className="text-[26px] font-black text-slate-900 tracking-[0.2em] mb-3 font-mono">
                       983119799
                     </div>
                     <div className="text-[10px] text-slate-500 flex items-center justify-center gap-2 font-medium">
                       Dial <span className="bg-slate-900 text-white font-mono px-1.5 py-0.5 rounded text-[10px]">*786*10#</span> • Enter TILL ID
                     </div>
                   </div>

                   <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 inline-block px-3 relative w-full header-lines opacity-70">
                     <span className="bg-white relative z-10 px-3">BANK TRANSFER</span>
                     <div className="absolute top-1/2 left-0 w-full h-px border-b border-dashed border-slate-300 z-0"></div>
                   </h4>

                   {/* Bank Details */}
                   <div className="space-y-2 text-left text-sm max-w-70 mx-auto">
                     <div className="flex justify-between items-center py-2 border-b border-slate-100">
                       <span className="text-slate-500 text-[11px] font-bold tracking-wider uppercase">Bank Name</span>
                       <span className="font-bold text-slate-900 text-xs">UBL</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-slate-100">
                       <span className="text-slate-500 text-[11px] font-bold tracking-wider uppercase">Account Name</span>
                       <span className="font-bold text-slate-900 text-xs">Al Haq Learning Hub</span>
                     </div>
                     
                     <div className="bg-[#f0f9ff] rounded-xl p-4 my-4 border border-blue-100 shadow-inner">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-blue-600 text-[10px] font-black tracking-widest uppercase">Account Number</span>
                         <div className="flex gap-1">
                           <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                           <div className="w-1 h-1 rounded-full bg-blue-300"></div>
                           <div className="w-1 h-1 rounded-full bg-blue-200"></div>
                         </div>
                       </div>
                       <div className="text-blue-950 font-mono text-[20px] font-black tracking-tighter text-center">
                         1062 3625 1933 2
                       </div>
                     </div>
                     
                     <div className="bg-[#00529b] rounded-xl p-3 text-white text-center shadow-md shadow-blue-200/50">
                       <div className="font-black text-[14px] tracking-wider mb-0.5 uppercase">UBL</div>
                       <div className="text-[9px] text-blue-100 font-bold tracking-widest">WHERE YOU COME FIRST</div>
                     </div>
                   </div>
                </div>

                <div className="bg-[#f8fafc] p-4 text-[10px] sm:text-[11px] text-blue-800 font-medium flex items-center justify-center gap-2 border-t border-slate-200 border-dashed">
                  <div className="w-4 h-4 rounded overflow-hidden mt-0.5 opacity-80 shrink-0"><Upload size={14} className="-mt-0.5 ml-0.5" /></div>
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
