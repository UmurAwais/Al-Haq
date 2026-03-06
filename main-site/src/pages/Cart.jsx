import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, CheckCircle2 } from 'lucide-react';
import { getApiUrl } from '../config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const [coupon, setCoupon] = useState('');

  const parsePrice = (priceVal) => {
    if (!priceVal) return 0;
    const str = String(priceVal).toLowerCase();
    if (str === 'free') return 0;
    // Extract numbers from "Rs. 4000" or similar
    const cleaned = str.replace(/[^0-9]/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + parsePrice(item.price), 0);
  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans flex flex-col">
      <Header />
      
      <main className="grow pt-28 pb-16 lg:pt-16 lg:pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Success Banner */}
          {!isCartEmpty && (
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded text-sm p-4 mb-8 flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center gap-2 text-[#166534] font-medium mb-3 sm:mb-0">
                <CheckCircle2 size={20} className="text-[#22c55e]" />
                <span>Course has been added to your cart.</span>
              </div>
              <Link to="/" className="text-[#E31B23] font-bold hover:underline whitespace-nowrap">
                Continue browsing
              </Link>
            </div>
          )}

          {isCartEmpty ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white border border-slate-200 rounded-lg text-center shadow-sm">
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Your cart is currently empty.</h2>
              <p className="text-slate-500 mb-8 max-w-sm">
                Return to shop and add some courses to your cart to proceed with checkout.
              </p>
              <Link to="/">
                <Button className="px-8 py-3.5 bg-[#E31B23] hover:bg-[#c2171e] text-white text-[15px] font-bold rounded">
                  Return to shop
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Left Column: Cart Items & Coupon */}
              <div className="w-full lg:w-[65%] shrink-0 space-y-6">
                
                {/* Table Container */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto shadow-sm">
                  <table className="w-full text-left border-collapse min-w-[550px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-[11px] font-black text-slate-400 tracking-wider">
                        <th className="py-4 px-6 uppercase">Course</th>
                        <th className="py-4 px-4 uppercase text-center w-[120px]">Price</th>
                        <th className="py-4 px-4 uppercase text-center w-[100px]">Quantity</th>
                        <th className="py-4 px-6 uppercase text-right w-[120px]">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cartItems.map((item) => {
                        const itemImage = item.image?.startsWith('http') 
                          ? item.image 
                          : `${getApiUrl().replace(/\/$/, '')}${item.image?.startsWith('/') ? '' : '/'}${item.image}`;
                        const numericPrice = parsePrice(item.price);
                        
                        return (
                          <tr key={item.id || item._id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-5 px-6">
                              <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => removeFromCart(item.id || item._id)}
                                  className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
                                  title="Remove this item"
                                >
                                  <X size={16} strokeWidth={2} />
                                </button>
                                <div className="w-[84px] shrink-0 aspect-[16/10] rounded border border-slate-200 overflow-hidden bg-slate-100 hidden sm:block">
                                  <img src={itemImage || 'https://images.unsplash.com/photo-1544161515-4af6b1d462c2'} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <span className="font-bold text-[14px] text-slate-900 leading-snug">
                                  {item.title}
                                </span>
                              </div>
                            </td>
                            <td className="py-5 px-4 text-center font-bold text-[14px] text-slate-900">
                              {numericPrice === 0 ? 'Free' : `Rs. ${numericPrice.toLocaleString()}`}
                            </td>
                            <td className="py-5 px-4 text-center">
                              <div className="inline-block border border-slate-200 rounded bg-slate-50 px-3 py-1.5 w-16 text-center text-sm font-medium">
                                1
                              </div>
                            </td>
                            <td className="py-5 px-6 text-right font-bold text-[14px] text-slate-900">
                              {numericPrice === 0 ? 'Free' : `Rs. ${numericPrice.toLocaleString()}`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Coupon Block */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon code" 
                    className="flex-grow border border-slate-300 rounded-full px-4 py-3 text-[14px] outline-none focus:border-brand transition-colors"
                  />
                  <Button className="px-8 py-3 bg-[#E31B23] hover:bg-[#c2171e] text-white text-[15px] font-bold rounded transition-colors whitespace-nowrap">
                    Apply coupon
                  </Button>
                </div>

              </div>

              {/* Right Column: Cart Totals */}
              <div className="w-full lg:w-[35%] shrink-0">
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm mb-4">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Cart totals</h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-center py-4 border-b border-slate-100 text-[14px]">
                      <span className="text-slate-500 font-medium">Subtotal</span>
                      <span className="font-bold text-slate-900">Rs. {totalPrice.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-6">
                      <span className="text-slate-500 font-medium text-[15px]">Total</span>
                      <span className="text-2xl font-black text-slate-900 tracking-tight">Rs. {totalPrice.toLocaleString()}</span>
                    </div>

                    <Link to="/checkout" className="block w-full">
                      <Button className="w-full py-4 bg-[#E31B23] hover:bg-[#c2171e] text-white text-[15px] font-bold rounded transition-colors shadow-lg shadow-brand/10">
                        Proceed to Checkout
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="text-center">
                  <Link to="/" className="inline-flex items-center text-[13px] font-bold text-slate-500 hover:text-[#E31B23] transition-colors">
                    &larr; Continue browsing online courses
                  </Link>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
