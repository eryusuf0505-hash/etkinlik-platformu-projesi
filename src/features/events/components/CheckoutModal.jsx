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
                  <span className="text-xl"></span> Pay ile Öde
                </button>

                {/* Google Pay Style */}
                <button 
                  onClick={() => handlePayment('google_pay')}
                  className="w-full h-16 bg-gray-900 border border-white/10 text-white rounded-2xl flex items-center justify-center gap-3 font-bold transition-transform active:scale-95"
                >
                  <img src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24dp.svg" className="h-5 brightness-200" alt="Google" /> Pay
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
