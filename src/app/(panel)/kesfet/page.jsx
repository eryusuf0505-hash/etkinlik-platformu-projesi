'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/shared/components/Navbar';
import EventCard from '@/features/events/components/EventCard';
import CheckoutModal from '@/features/events/components/CheckoutModal';
import apiClient from '@/shared/lib/apiClient';


export default function ExplorePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategories, setActiveCategories] = useState([]);
  const [filters, setFilters] = useState({
    city: '',
  });

  const categories = ['Konser', 'Seminer', 'Spor', 'Teknoloji', 'Sanat', 'Otomobil', 'Yaşam', 'Oyun'];

  const cities = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
  ].sort((a, b) => a.localeCompare(b, 'tr'));


  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.city) queryParams.append('city', filters.city);
        
        const data = await apiClient.get(`/api/events?${queryParams.toString()}`);
        let apiEvents = Array.isArray(data) ? data : (data.data || data.items || []);
        
        // Local category filtering if needed, but ideally backend should handle this
        if (activeCategories.length > 0) {
          apiEvents = apiEvents.filter(event => 
            activeCategories.includes(event.category?.name || event.category)
          );
        }
        
        setEvents(apiEvents);
      } catch (err) {
        console.error('Fetch events error:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filters, activeCategories]);

  const toggleCategory = (cat) => {
    setActiveCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleOpenCheckout = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">
          <aside className="w-full lg:w-72">
            <div className="sticky top-32 glass p-8 rounded-[2.5rem]">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-600 rounded-full" />
                Filtrele
              </h2>
              
              <div className="space-y-10">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Şehir</label>
                  <select 
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer [&>option]:bg-[#0f172a] [&>option]:text-white"
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                  >
                    <option value="">Tüm Şehirler</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Kategoriler</label>
                  <div className="space-y-4">
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center gap-4 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            checked={activeCategories.includes(cat)}
                            onChange={() => toggleCategory(cat)}
                            className="peer appearance-none w-6 h-6 rounded-lg border-2 border-white/10 bg-white/5 checked:bg-blue-600 checked:border-blue-600 transition-all" 
                          />
                          <div className="absolute opacity-0 peer-checked:opacity-100 text-white text-[10px] pointer-events-none">✓</div>
                        </div>
                        <span className={`font-medium transition-colors ${activeCategories.includes(cat) ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => {setFilters({city: ''}); setActiveCategories([]);}}
                className="w-full mt-12 py-4 rounded-2xl border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Filtreleri Temizle
              </button>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">Keşfet</h1>
                <p className="text-gray-400 font-medium">İlgi alanlarına göre en iyi etkinlikleri bul.</p>
              </div>
              <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-blue-400">
                {events.length} Etkinlik Listeleniyor
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[1, 2, 4, 6].map(i => <div key={i} className="aspect-[16/18] glass rounded-[2.5rem] animate-pulse" />)}
              </div>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {events.map(event => (
                  <div key={event._id} onClick={() => handleOpenCheckout(event)} className="cursor-pointer">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 glass rounded-[3rem] border-dashed border-2">
                <div className="text-6xl mb-6 opacity-20">🔍</div>
                <h3 className="text-xl font-bold mb-2">Aradığın Etkinlik Bulunamadı</h3>
                <p className="text-gray-400">Filtreleri sıfırlayarak daha fazla sonuç görebilirsin.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedEvent && (
        <CheckoutModal 
          event={selectedEvent} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}
