'use client';

import Navbar from '@/shared/components/Navbar';
import ProfileSidebar from '@/shared/components/ProfileSidebar';
import { useState, useEffect } from 'react';
import apiClient from '@/shared/lib/apiClient';


export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await apiClient.get('/api/auth/me');
        setCurrentUser(data.user);
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const stats = [
    { name: 'Katıldığım Etkinlikler', value: currentUser?.stats?.eventCount || 0, icon: '📅' },
    { name: 'Aktif Biletler', value: currentUser?.stats?.ticketCount || 0, icon: '🎟️' },
    { name: 'Topluluklarım', value: currentUser?.stats?.communityCount || 0, icon: '👥' },
    { name: 'Favoriler', value: currentUser?.stats?.favoriteCount || 0, icon: '❤️' },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          <ProfileSidebar />

          <div className="flex-1 space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.name} className={`glass p-8 rounded-[2.5rem] hover:scale-105 transition-all duration-500 ${loading ? 'animate-pulse' : ''}`}>
                  <div className="text-3xl mb-4">{stat.icon}</div>
                  <div className="text-3xl font-black text-white mb-1">{loading ? '...' : stat.value}</div>
                  <div className="text-xs font-black text-gray-500 uppercase tracking-widest">{stat.name}</div>
                </div>
              ))}
            </div>

            {/* Recent Activity / Professional Chart Placeholder */}
            <div className="glass p-10 rounded-[3rem]">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black">Aktivite Grafiği</h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-lg bg-blue-600 text-[10px] font-bold">HAFTALIK</span>
                  <span className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-bold">AYLIK</span>
                </div>
              </div>
              
              <div className="h-64 w-full flex items-end gap-2 px-4">
                {[40, 70, 45, 90, 65, 85, 55, 75, 40, 95, 60, 80].map((h, i) => (
                  <div 
                    key={i} 
                    style={{ height: `${h}%` }}
                    className="flex-1 bg-gradient-to-t from-blue-600/40 to-blue-500 rounded-t-lg transition-all hover:to-white"
                  />
                ))}
              </div>
              <div className="flex justify-between mt-6 px-4 text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                <span>Ocak</span><span>Şubat</span><span>Mart</span><span>Nisan</span><span>Mayıs</span><span>Haziran</span>
                <span>Temmuz</span><span>Ağustos</span><span>Eylül</span><span>Ekim</span><span>Kasım</span><span>Aralık</span>
              </div>
            </div>

            {/* Upcoming Event Reminder Card */}
            <div className="p-10 rounded-[3rem] bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden group">
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <span className="px-4 py-1.5 rounded-xl bg-white/20 text-[10px] font-black uppercase tracking-wider mb-4 inline-block">SIRADAKİ ETKİNLİK</span>
                  <h3 className="text-3xl font-black text-white mb-2">Afterlife Istanbul 2024</h3>
                  <p className="text-white/70 font-medium">15 Ağustos • Klein Phönix, Istanbul</p>
                </div>
                <button className="px-10 py-5 rounded-2xl bg-white text-blue-600 font-black text-lg hover:shadow-2xl transition-all active:scale-95">
                  Bileti Görüntüle
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
