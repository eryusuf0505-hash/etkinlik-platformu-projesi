'use client';

import { useState } from 'react';

export default function CheckoutModal({ event, isOpen, onClose }) {
  const [step, setStep] = useState('selection'); // selection, card, success
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async (method) => {
    setLoading(true);
    // Simulate payment API call
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl glass rounded-[3rem] overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-400 hover:text-white z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-12">
          {step === 'selection' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-black mb-2">Ödeme Yap</h2>
                <p className="text-gray-400 font-medium">{event.title} için bilet alıyorsun.</p>
              </div>

              <div className="space-y-4">
                {/* Apple Pay Style */}
                <button 
                  onClick={() => handlePayment('apple_pay')}
                  className="w-full h-16 bg-white text-black rounded-2xl flex items-center justify-center gap-2 font-black transition-transform active:scale-95"
                >
                  <svg className="w-5 h-5 mb-0.5" viewBox="0 0 384 512" fill="currentColor">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                  Pay ile Öde
                </button>

                {/* Google Pay Style */}
                <button 
                  onClick={() => handlePayment('google_pay')}
                  className="w-full h-16 bg-gray-900 border border-white/10 text-white rounded-2xl flex items-center justify-center gap-3 font-bold transition-transform active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Google Pay
                </button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0f172a] px-4 text-gray-500 font-bold">Veya Kartla Öde</span></div>
                </div>

                <button 
                  onClick={() => setStep('card')}
                  className="w-full h-16 glass rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-white/10 transition-all"
                >
                  💳 Kredi / Banka Kartı
                </button>
              </div>
              
              <div className="text-center pt-4">
                <span className="text-2xl font-black text-blue-400">99.00 TRY</span>
              </div>
            </div>
          )}

          {step === 'card' && (
            <div className="space-y-8">
              <button onClick={() => setStep('selection')} className="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-2">
                ← Geri Dön
              </button>
              
              <div className="text-center">
                <h2 className="text-3xl font-black mb-2">Kart Bilgileri</h2>
              </div>

              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Kart Üzerindeki İsim" 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000" 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="AA / YY" className="bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                  <input type="text" placeholder="CVC" className="bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
              </div>

              <button 
                onClick={() => handlePayment('card')}
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black text-sm hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/40"
              >
                {loading ? 'İşlem Yapılıyor...' : '99.00 TRY ÖDE'}
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-8 py-10">
              <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center text-5xl mx-auto animate-bounce">
                ✓
              </div>
              <div>
                <h2 className="text-3xl font-black mb-2">Başarılı!</h2>
                <p className="text-gray-400 font-medium">Biletin onaylandı. Etkinlikte görüşmek üzere!</p>
              </div>
              <button 
                onClick={onClose}
                className="w-full py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all font-bold"
              >
                Kapat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
