'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/shared/components/Navbar';
import apiClient from '@/shared/lib/apiClient';


export default function CommunitiesPage() {
  const [activeCategory, setActiveCategory] = useState('Hepsi');
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await apiClient.get('/api/auth/me');
        setJoinedCommunities(data.user?.joinedCommunities || []);
      } catch (err) {
        console.error('Me fetch error:', err);
      }
    };
    fetchMe();
  }, []);

  const handleJoin = async (comm) => {
    try {
      if (joinedCommunities.some(c => c._id === comm._id || c.name === comm.name)) {
        router.push('/mesajlar');
        return;
      }

      const data = await apiClient.post('/api/communities/join', { communityId: comm._id });
      setJoinedCommunities(prev => [...prev, comm]);
      alert('Topluluğa katıldınız! Şimdi sohbet edebilirsiniz.');
      router.push('/mesajlar');
    } catch (err) {
      if (err.status === 401) {
        alert('Topluluklara katılmak için giriş yapmalısınız.');
        router.push('/login');
      } else {
        alert(err.message || 'Bağlantı hatası.');
      }
    }
  };

  const categories = ['Hepsi', 'Otomobil', 'Teknoloji', 'Yaşam', 'Spor', 'Oyun', 'Sanat'];

  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (activeCategory !== 'Hepsi') queryParams.append('category', activeCategory);
        if (searchQuery) queryParams.append('search', searchQuery);

        const data = await apiClient.get(`/api/communities?${queryParams.toString()}`);
        const fetched = Array.isArray(data) ? data : (data.data || data.items || []);

        setCommunities(fetched);
      } catch (err) {
        console.error('Fetch communities error:', err);
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunities();
  }, [activeCategory, searchQuery]);

  const filteredCommunities = communities;

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <h1 className="text-5xl font-black tracking-tight mb-4 text-white">Toplulukları Keşfet</h1>
            <p className="text-xl text-gray-400 font-medium">Kendi dünyanı bul, benzer tutkulara sahip binlerce insanla bağ kur.</p>
          </div>
          
          <div className="w-full md:w-96">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Topluluk ara..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all pl-14"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-50 group-focus-within:opacity-100 transition-opacity">🔍</span>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex overflow-x-auto pb-8 gap-4 no-scrollbar mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-4 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/30' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCommunities.map((comm) => (
            <div key={comm.name} className="glass p-10 rounded-[3rem] hover:scale-[1.03] transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-600/10 to-transparent rounded-bl-full" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-black/20">
                  {comm.icon}
                </div>
                
                <div className="mb-6">
                  <span className="px-3 py-1 rounded-lg bg-purple-500/10 text-[10px] font-black text-purple-400 uppercase tracking-widest mb-3 inline-block border border-purple-500/20">
                    {comm.category}
                  </span>
                  <h2 className="text-2xl font-black text-white group-hover:text-purple-400 transition-colors">
                    {comm.name}
                  </h2>
                </div>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-10 line-clamp-2 font-medium">
                  {comm.description || comm.desc}
                </p>
                
                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-white">{(comm.memberCount !== undefined ? comm.memberCount : (comm.members?.length || 0)).toLocaleString()}</span>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Üye Sayısı</span>
                  </div>
                  
                  <button 
                    onClick={() => handleJoin(comm)}
                    className={`px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-xl shadow-white/5 ${
                      joinedCommunities.some(c => c.name === comm.name) 
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-black hover:bg-purple-600 hover:text-white'
                    }`}
                  >
                    {joinedCommunities.some(c => c.name === comm.name) ? 'SOHBETE GİT' : 'KATIL'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCommunities.length === 0 && (
          <div className="text-center py-32 glass rounded-[3rem] border-dashed border-2">
            <div className="text-6xl mb-6 opacity-20">🔎</div>
            <h3 className="text-2xl font-bold mb-2">Topluluk Bulunamadı</h3>
            <p className="text-gray-400">Arama kriterlerini değiştirerek tekrar dene.</p>
          </div>
        )}
      </main>
    </div>
  );
}
