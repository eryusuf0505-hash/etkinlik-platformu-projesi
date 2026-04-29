'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/shared/components/Navbar';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('event'); // 'event', 'community', or 'manage'
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null); // null: loading, true: admin, false: not admin
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [communities, setCommunities] = useState([]);
  const router = useRouter();

  const [eventData, setEventData] = useState({ title: '', description: '', city: '', date: '', imageUrl: '', category: '', price: 0, bankAccount: '' });
  const [communityData, setCommunityData] = useState({ name: '', category: '', icon: '', description: '', memberCount: 1 });

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const res = await fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
          const user = await res.json();
          if (user.role === 'admin') {
            setIsAdmin(true);
            setCurrentUser(user);
            fetchData();
          } else {
            setIsAdmin(false);
          }
        } else {
          router.push('/login');
        }
      } catch (err) {
        setIsAdmin(false);
      }
    };
    
    const fetchData = async () => {
      try {
        const [evRes, commRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/communities')
        ]);
        if (evRes.ok) {
          const evData = await evRes.json();
          setEvents(evData.data || evData);
        }
        if (commRes.ok) {
          const commData = await commRes.json();
          setCommunities(commData.data || commData);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkAdmin();
  }, [router]);

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        title: eventData.title,
        description: eventData.description,
        city: eventData.city,
        date: new Date(eventData.date).toISOString(),
        imageUrl: eventData.imageUrl,
        category: eventData.category,
        price: Number(eventData.price),
        bankAccount: eventData.bankAccount
      };
      
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert('Etkinlik başarıyla oluşturuldu!');
        setEventData({ title: '', description: '', city: '', date: '', imageUrl: '', category: '', price: 0, bankAccount: '' });
      } else {
        const data = await res.json();
        alert(data.error || 'Etkinlik oluşturulamadı.');
      }
    } catch (err) {
      alert('Ağ hatası.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommunitySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(communityData)
      });
      
      if (res.ok) {
        alert('Topluluk başarıyla oluşturuldu!');
        setCommunityData({ name: '', category: '', icon: '', description: '', memberCount: 1 });
      } else {
        const data = await res.json();
        alert(data.error || 'Topluluk oluşturulamadı.');
      }
    } catch (err) {
      alert('Ağ hatası.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setEvents(prev => prev.filter(e => e._id !== id));
        alert('Etkinlik silindi.');
      } else {
        const data = await res.json();
        alert(data.error || 'Silme işlemi başarısız.');
      }
    } catch (err) {
      alert('Hata oluştu.');
    }
  };

  const handleDeleteCommunity = async (id) => {
    if (!window.confirm('Bu topluluğu silmek istediğinizden emin misiniz?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/communities/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCommunities(prev => prev.filter(c => c._id !== id));
        alert('Topluluk silindi.');
      } else {
        const data = await res.json();
        alert(data.error || 'Silme işlemi başarısız.');
      }
    } catch (err) {
      alert('Hata oluştu.');
    }
  };

  if (isAdmin === null) {
    return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white font-bold">Yükleniyor...</div>;
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white p-4 text-center">
        <h1 className="text-6xl mb-6">⛔</h1>
        <h2 className="text-2xl font-black mb-4">Erişim Engellendi</h2>
        <p className="text-gray-400 mb-8">Bu sayfayı görüntülemek için yönetici yetkisine sahip olmalısınız.</p>
        <button onClick={() => router.push('/')} className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold transition-all">Ana Sayfaya Dön</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">Yönetim Paneli</h1>
          <p className="text-gray-400 font-medium">Sistem içeriklerini buradan yönetebilirsiniz.</p>
        </div>

        <div className="flex justify-center gap-4 mb-10">
          <button 
            onClick={() => setActiveTab('event')}
            className={`px-8 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === 'event' ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            Yeni Etkinlik Ekle
          </button>
          <button 
            onClick={() => setActiveTab('community')}
            className={`px-8 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === 'community' ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            Yeni Topluluk Ekle
          </button>
          <button 
            onClick={() => setActiveTab('manage')}
            className={`px-8 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === 'manage' ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            İçerikleri Yönet
          </button>
        </div>

        <div className="glass p-10 rounded-[3rem]">
          {activeTab === 'event' ? (
            <form onSubmit={handleEventSubmit} className="space-y-6">
              <h2 className="text-2xl font-black text-white mb-6">Etkinlik Detayları</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Başlık</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50" value={eventData.title} onChange={e => setEventData({...eventData, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Kategori</label>
                  <input required type="text" placeholder="Örn: Konser, Teknoloji" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50" value={eventData.category} onChange={e => setEventData({...eventData, category: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Şehir</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50" value={eventData.city} onChange={e => setEventData({...eventData, city: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Tarih</label>
                  <input required type="date" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" value={eventData.date} onChange={e => setEventData({...eventData, date: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Bilet Fiyatı (TL)</label>
                  <input required type="number" placeholder="0" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50" value={eventData.price} onChange={e => setEventData({...eventData, price: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">IBAN / Hesap No</label>
                  <input required type="text" placeholder="TR00..." className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50" value={eventData.bankAccount} onChange={e => setEventData({...eventData, bankAccount: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Görsel URL</label>
                <input required type="url" placeholder="https://..." className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50" value={eventData.imageUrl} onChange={e => setEventData({...eventData, imageUrl: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Açıklama</label>
                <textarea required rows="4" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none" value={eventData.description} onChange={e => setEventData({...eventData, description: e.target.value})}></textarea>
              </div>

              <button type="submit" disabled={loading} className="w-full py-5 rounded-2xl bg-red-600 text-white font-black text-sm hover:bg-red-500 transition-all shadow-2xl shadow-red-600/40 disabled:opacity-50 active:scale-95">
                {loading ? 'Kaydediliyor...' : 'ETKİNLİĞİ OLUŞTUR'}
              </button>
            </form>
          ) : activeTab === 'community' ? (
            <form onSubmit={handleCommunitySubmit} className="space-y-6">
              <h2 className="text-2xl font-black text-white mb-6">Topluluk Detayları</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Topluluk Adı</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50" value={communityData.name} onChange={e => setCommunityData({...communityData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Kategori</label>
                  <input required type="text" placeholder="Örn: Teknoloji, Sanat" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50" value={communityData.category} onChange={e => setCommunityData({...communityData, category: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">İkon (Emoji vb.)</label>
                  <input required type="text" placeholder="🚀" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50" value={communityData.icon} onChange={e => setCommunityData({...communityData, icon: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Açıklama</label>
                <textarea required rows="4" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none" value={communityData.description} onChange={e => setCommunityData({...communityData, description: e.target.value})}></textarea>
              </div>

              <button type="submit" disabled={loading} className="w-full py-5 rounded-2xl bg-red-600 text-white font-black text-sm hover:bg-red-500 transition-all shadow-2xl shadow-red-600/40 disabled:opacity-50 active:scale-95">
                {loading ? 'Kaydediliyor...' : 'TOPLULUĞU OLUŞTUR'}
              </button>
            </form>
          ) : (
            <div className="space-y-12">
              <div>
                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-red-600 rounded-full" />
                  Etkinlikleri Yönet
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {events.filter(e => {
                    const organizerId = e.organizer?._id || e.organizer;
                    const currentUserId = currentUser?._id || currentUser?.id;
                    return organizerId?.toString() === currentUserId?.toString() || currentUser?.role === 'admin';
                  }).map(event => (
                    <div key={event._id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-800 overflow-hidden">
                          <img src={event.imageUrl} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{event.title}</p>
                          <p className="text-xs text-gray-500">{event.city} • {new Date(event.date).toLocaleDateString('tr-TR')}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteEvent(event._id)} className="p-3 text-gray-500 hover:text-red-500 transition-colors">🗑️</button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-red-600 rounded-full" />
                  Toplulukları Yönet
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {communities.filter(c => {
                    const ownerId = c.owner?._id || c.owner;
                    const currentUserId = currentUser?._id || currentUser?.id;
                    return ownerId?.toString() === currentUserId?.toString() || currentUser?.role === 'admin';
                  }).map(comm => (
                    <div key={comm._id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-xl">
                          {comm.icon}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{comm.name}</p>
                          <p className="text-xs text-gray-500">{comm.category}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteCommunity(comm._id)} className="p-3 text-gray-500 hover:text-red-500 transition-colors">🗑️</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
