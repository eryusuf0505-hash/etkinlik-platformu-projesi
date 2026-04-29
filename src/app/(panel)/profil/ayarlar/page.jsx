'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/shared/components/Navbar';
import ProfileSidebar from '@/shared/components/ProfileSidebar';

export default function SettingsPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch(e) {}
        }

        const res = await fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          <ProfileSidebar />

          <div className="flex-1">
            <h1 className="text-4xl font-black mb-10">Hesap Ayarları</h1>

            <div className="space-y-10">
              {/* Profile Settings */}
              <section className="glass p-10 rounded-[3rem] space-y-8">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <span className="w-2 h-6 bg-blue-600 rounded-full" />
                  Profil Bilgileri
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Tam İsim</label>
                    <input type="text" defaultValue={user?.name || ''} className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">E-posta</label>
                    <input type="email" defaultValue={user?.email || ''} className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm opacity-50 cursor-not-allowed" disabled />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Biyografi</label>
                    <textarea rows="4" className="w-full bg-white/5 border border-white/5 rounded-3xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" placeholder="Kendinden bahset..." defaultValue={user?.bio || ''} />
                  </div>
                </div>
                
                <button className="px-10 py-4 rounded-2xl bg-blue-600 text-white font-black text-sm hover:bg-blue-500 transition-all">
                  DEĞİŞİKLİKLERİ KAYDET
                </button>
              </section>

              {/* Security Settings */}
              <section className="glass p-10 rounded-[3rem] space-y-8">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <span className="w-2 h-6 bg-purple-600 rounded-full" />
                  Güvenlik
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <h4 className="font-bold">İki Faktörlü Doğrulama</h4>
                      <p className="text-xs text-gray-500">Hesabını daha güvenli hale getir.</p>
                    </div>
                    <div className="w-12 h-6 bg-gray-700 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <h4 className="font-bold">Şifre Değiştir</h4>
                      <p className="text-xs text-gray-500">Son güncelleme 3 ay önce.</p>
                    </div>
                    <button className="text-sm font-bold text-purple-400 hover:underline">Şimdi Güncelle</button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
