'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', city: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/kesfet');
        router.refresh(); // Refresh to update Navbar
      } else {
        alert(data.error || 'Kayıt işlemi başarısız oldu.');
      }
    } catch (err) {
      console.error(err);
      alert('Bir ağ hatası oluştu. Lütfen bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0f172a] px-4 py-20 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-600/10 rounded-full blur-[120px]" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/20 group-hover:rotate-12 transition-transform">
              <span className="text-white text-2xl font-black">E</span>
            </div>
            <span className="text-3xl font-black tracking-tighter text-white">ETKINLIK.CO</span>
          </Link>
          <h2 className="text-4xl font-black text-white mb-3">Aramıza Katıl!</h2>
          <p className="text-gray-400 font-medium">Yeni deneyimler ve arkadaşlıklar seni bekliyor.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 glass p-10 rounded-[3rem]">
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Tam İsim</label>
            <input 
              type="text" 
              required
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="Ad Soyad"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">E-posta</label>
            <input 
              type="email" 
              required
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="ornek@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Şehir</label>
            <select 
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer [&>option]:bg-[#0f172a]"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
            >
              <option value="">Şehir Seçin</option>
              {[
                "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
              ].sort((a, b) => a.localeCompare(b, 'tr')).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Şifre</label>
            <input 
              type="password" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 mt-6 rounded-2xl bg-white text-black font-black text-sm hover:bg-purple-600 hover:text-white transition-all shadow-2xl shadow-white/5 disabled:opacity-50 active:scale-95"
          >
            {loading ? 'Kaydediliyor...' : 'KAYIT OL'}
          </button>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-400 font-medium">
              Zaten hesabın var mı? <Link href="/login" className="text-purple-400 hover:underline font-bold">Giriş Yap</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
