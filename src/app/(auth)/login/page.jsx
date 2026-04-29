'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [view, setView] = useState('login'); // login, forgot_password, reset_password
  const [formData, setFormData] = useState({ email: '', password: '', otp: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/kesfet');
        router.refresh();
      } else {
        alert(data.error || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.');
      }
    } catch (err) {
      console.error(err);
      alert('Bir ağ hatası oluştu. Lütfen bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const [otpCode, setOtpCode] = useState(null);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) return alert('Lütfen e-posta adresinizi girin.');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.mockOtp) {
          setOtpCode(data.mockOtp);
          alert(`Şifre sıfırlama kodunuz: ${data.mockOtp}\n\nBu kodu bir sonraki ekranda kullanın.`);
        }
        setView('reset_password');
      } else {
        alert(data.error || 'İşlem başarısız.');
      }
    } catch (err) {
      console.error(err);
      alert('Ağ hatası.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.otp || !formData.newPassword) return alert('Tüm alanları doldurun.');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otp, newPassword: formData.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setView('login');
      } else {
        alert(data.error || 'Şifre sıfırlama başarısız.');
      }
    } catch (err) {
      console.error(err);
      alert('Ağ hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0f172a] px-4 overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px]" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 group-hover:rotate-12 transition-transform">
              <span className="text-white text-2xl font-black">E</span>
            </div>
            <span className="text-3xl font-black tracking-tighter text-white">ETKINLIK.CO</span>
          </Link>
          <h2 className="text-4xl font-black text-white mb-3">
            {view === 'login' ? 'Hoş Geldin!' : view === 'forgot_password' ? 'Şifremi Unuttum' : 'Yeni Şifre Belirle'}
          </h2>
          <p className="text-gray-400 font-medium">
            {view === 'login' ? 'Platforma giriş yap ve eğlenceye katıl.' : view === 'forgot_password' ? 'E-posta adresini girerek şifreni sıfırla.' : 'Sana gönderdiğimiz kodu ve yeni şifreni gir.'}
          </p>
        </div>

        <div className="space-y-6 glass p-10 rounded-[3rem]">
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">E-posta</label>
                <input 
                  type="email" 
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="ornek@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Şifre</label>
                  <button type="button" onClick={() => setView('forgot_password')} className="text-xs font-bold text-blue-400 hover:underline">Şifremi Unuttum?</button>
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 mt-4 rounded-2xl bg-white text-black font-black text-sm hover:bg-blue-500 hover:text-white transition-all shadow-2xl shadow-white/5 disabled:opacity-50 active:scale-95"
              >
                {loading ? 'Giriş Yapılıyor...' : 'GİRİŞ YAP'}
              </button>

              <div className="text-center pt-4">
                <p className="text-sm text-gray-400 font-medium">
                  Hesabın yok mu? <Link href="/register" className="text-blue-400 hover:underline font-bold">Kayıt Ol</Link>
                </p>
              </div>
            </form>
          )}

          {view === 'forgot_password' && (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">E-posta</label>
                <input 
                  type="email" 
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="ornek@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 mt-4 rounded-2xl bg-white text-black font-black text-sm hover:bg-blue-500 hover:text-white transition-all shadow-2xl shadow-white/5 disabled:opacity-50 active:scale-95"
              >
                {loading ? 'Gönderiliyor...' : 'ŞİFRE SIFIRLAMA LİNKİ GÖNDER'}
              </button>
              <div className="text-center pt-4">
                <button type="button" onClick={() => setView('login')} className="text-sm text-blue-400 hover:underline font-bold">← Giriş Sayfasına Dön</button>
              </div>
            </form>
          )}

          {view === 'reset_password' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Doğrulama Kodu</label>
                {otpCode && (
                  <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-3 mb-2 text-xs font-bold text-blue-400 text-center">
                    KODUNUZ: {otpCode}
                  </div>
                )}
                <input 
                  type="text" 
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="6 Haneli Kod"
                  value={formData.otp}
                  onChange={(e) => setFormData({...formData, otp: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Yeni Şifre</label>
                <input 
                  type="password" 
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 mt-4 rounded-2xl bg-blue-600 text-white font-black text-sm hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/40 disabled:opacity-50 active:scale-95"
              >
                {loading ? 'Güncelleniyor...' : 'ŞİFREMİ GÜNCELLE'}
              </button>
              <div className="text-center pt-4">
                <button type="button" onClick={() => setView('login')} className="text-sm text-gray-400 hover:underline font-bold">İptal Et</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
