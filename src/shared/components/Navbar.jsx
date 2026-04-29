'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import apiClient from '@/shared/lib/apiClient';


export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await apiClient.get('/api/auth/me');
        if (data.user) {
          setCurrentUser(data.user);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error('Navbar me fetch error:', err);
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    };
    
    const token = localStorage.getItem('token');
    if (token) {
      fetchMe();
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Clear everything for safety
    setIsLoggedIn(false);
    setCurrentUser(null);
    router.push('/');
    setTimeout(() => {
      window.location.reload(); // Hard reload to ensure all states are reset
    }, 100);
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0f172a]/70 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
                <span className="text-white text-xl font-black">E</span>
              </div>
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent hidden sm:block">
                ETKINLIK.CO
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              {[
                { name: 'Keşfet', path: '/kesfet' },
                { name: 'Topluluklar', path: '/topluluklar' },
                { name: 'Takvim', path: '/takvim' },
                { name: 'Mesajlar', path: '/mesajlar' },
              ].map((link) => (
                <Link 
                  key={link.path}
                  href={link.path} 
                  className={`text-sm font-bold transition-all hover:text-white ${
                    isActive(link.path) ? 'text-blue-400' : 'text-gray-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
              >
                <span className="text-xl">🔔</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f172a]" />
              </button>
              
              {showNotifications && (
                <div className="absolute top-full right-0 mt-4 w-80 glass rounded-[2rem] p-6 shadow-2xl animate-in fade-in slide-in-from-top-2">
                  <h4 className="text-sm font-black mb-4">Bildirimler</h4>
                  <div className="space-y-4">
                    <div className="p-3 bg-white/5 rounded-xl text-xs space-y-1">
                      <p className="font-bold">Yeni Etkinlik!</p>
                      <p className="text-gray-500">"Modern Sanat Sergisi" ilginizi çekebilir.</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl text-xs space-y-1">
                      <p className="font-bold">Bilet Onaylandı</p>
                      <p className="text-gray-500">Afterlife Istanbul biletiniz hazır.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link href="/login" className="px-6 py-2.5 rounded-2xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                  Giriş Yap
                </Link>
                <Link href="/register" className="px-6 py-2.5 rounded-2xl text-sm font-bold bg-white text-black hover:bg-gray-200 transition-all shadow-xl shadow-white/5">
                  Katıl
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                {currentUser?.role === 'admin' && (
                  <Link href="/admin" className="px-4 py-2 rounded-xl bg-red-600/20 text-red-400 font-bold text-xs border border-red-500/30 hover:bg-red-600 hover:text-white transition-all">
                    Admin Paneli
                  </Link>
                )}
                <Link href="/profil" className="flex items-center gap-3 group">
                  <div className="text-right hidden sm:block border-l border-white/10 pl-6 ml-2">
                    <p className="text-xs font-black text-white leading-none mb-1">{currentUser?.name || 'Hesabım'}</p>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{currentUser?.role === 'admin' ? 'YÖNETİCİ' : 'PRO Üye'}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-black shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Çıkış Yap"
                >
                  <span className="text-xl">🚪</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
