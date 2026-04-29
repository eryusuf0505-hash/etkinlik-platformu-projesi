'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function ProfileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/');
          return;
        }

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
        } else if (res.status === 401) {
          setError('Oturum süresi doldu veya geçersiz. Lütfen tekrar giriş yapın.');
          localStorage.clear();
          setTimeout(() => router.push('/'), 1500);
        } else {
          const errorData = await res.json();
          setError(errorData.error || 'Veri alınamadı, lütfen tekrar deneyin.');
        }
      } catch (err) {
        console.error(err);
        setError('Bağlantı hatası oluştu. Lütfen tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const menuItems = [
    { name: 'Genel Bakış', path: '/profil', icon: '📊' },
    { name: 'Biletlerim', path: '/profil/biletlerim', icon: '🎟️' },
    { name: 'Topluluklarım', path: '/profil/topluluklar', icon: '👥' },
    { name: 'Ödemeler', path: '/profil/odemeler', icon: '💳' },
    { name: 'Ayarlar', path: '/profil/ayarlar', icon: '⚙️' },
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <aside className="w-full lg:w-72 space-y-2">
      <div className="glass p-8 rounded-[2.5rem] mb-6 text-center">
        {loading ? (
          <div className="w-24 h-24 mx-auto bg-white/5 rounded-[2rem] mb-4 animate-pulse" />
        ) : user?.profileImage ? (
          <img src={user.profileImage} alt={user.name} className="w-24 h-24 mx-auto rounded-[2rem] object-cover mb-4 shadow-xl" />
        ) : (
          <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[2rem] flex items-center justify-center text-3xl font-black mb-4 shadow-xl shadow-blue-500/20 text-white">
            {getInitials(user?.name)}
          </div>
        )}
        <h2 className="text-xl font-bold text-white">
          {loading && !user ? 'Yükleniyor...' : (user?.name || (error ? 'Hata' : 'Kullanıcı'))}
        </h2>
        {error && <p className="text-xs text-red-400 mt-2 font-medium">{error}</p>}
        {!loading && !error && (
          <p className="text-sm text-gray-500 font-medium">{user?.role === 'admin' ? 'Yönetici' : 'Pro Üye'}</p>
        )}
      </div>

      <nav className="glass p-4 rounded-[2.5rem] space-y-1">
        {menuItems.map((item) => (
          <Link 
            key={item.path}
            href={item.path}
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
              pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.name}
          </Link>
        ))}
        
        <div className="pt-4 mt-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <span>🚪</span> Çıkış Yap
          </button>
        </div>
      </nav>
    </aside>
  );
}
