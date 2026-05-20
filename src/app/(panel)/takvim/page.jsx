'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/shared/components/Navbar';
import CheckoutModal from '@/features/events/components/CheckoutModal';
import apiClient from '@/shared/lib/apiClient';

export default function TakvimPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await apiClient.get('/api/events?limit=500');
        const apiEvents = Array.isArray(data) ? data : (data.data || data.items || []);
        setEvents(apiEvents);
      } catch (err) {
        console.error('Fetch events error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const getEventsForDate = (date) => {
    return events.filter(e => {
      const eDate = new Date(e.date);
      return isSameDay(eDate, date);
    });
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    // JS getDay() returns 0 for Sunday. Let's make Monday 0 for European calendars.
    let firstDay = getFirstDayOfMonth(year, month) - 1;
    if (firstDay === -1) firstDay = 6; 

    const days = [];
    const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-4" />);
    }

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isSelected = isSameDay(date, selectedDate);
      const isToday = isSameDay(date, new Date());
      const dayEvents = getEventsForDate(date);
      const hasEvents = dayEvents.length > 0;

      days.push(
        <button
          key={i}
          onClick={() => setSelectedDate(date)}
          className={`relative p-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all
            ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-black' : 'hover:bg-white/5 text-gray-300 font-medium'}
            ${isToday && !isSelected ? 'ring-2 ring-blue-500/50' : ''}
          `}
        >
          <span className="text-lg">{i}</span>
          {hasEvents && (
            <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'}`} />
          )}
        </button>
      );
    }

    return (
      <div className="glass p-8 rounded-[3rem]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-white">
            {monthNames[month]} {year}
          </h2>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">←</button>
            <button onClick={handleNextMonth} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">→</button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map(d => (
            <div key={d} className="text-center text-xs font-black text-gray-500 uppercase tracking-widest pb-4">
              {d}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>
      </div>
    );
  };

  const selectedEvents = getEventsForDate(selectedDate);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">Etkinlik Takvimi</h1>
          <p className="text-gray-400 font-medium">Hangi gün neler var, tek tıkla incele.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          <aside className="w-full lg:w-1/2">
            {renderCalendar()}
          </aside>

          <div className="w-full lg:w-1/2">
            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-red-600 rounded-full" />
              {selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>

            {loading ? (
              <div className="space-y-6">
                 {[1, 2].map(i => <div key={i} className="h-40 glass rounded-[2.5rem] animate-pulse" />)}
              </div>
            ) : selectedEvents.length > 0 ? (
              <div className="space-y-6">
                {selectedEvents.map(event => (
                  <div key={event._id} onClick={() => { setSelectedEvent(event); setIsModalOpen(true); }} className="cursor-pointer group">
                    <div className="glass p-4 pr-8 rounded-[2.5rem] flex items-center gap-6 hover:scale-[1.02] transition-all duration-300 hover:shadow-blue-500/10">
                      <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-800 shrink-0">
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 text-xs font-bold text-blue-400 mb-2 tracking-wide uppercase">
                          <span>{event.category?.name || event.category}</span>
                          <span className="opacity-30">|</span>
                          <span>{event.city}</span>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">{event.title}</h4>
                        <p className="text-sm text-gray-400 line-clamp-2 font-medium">{event.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
               <div className="flex flex-col items-center justify-center py-24 glass rounded-[3rem] border-dashed border-2">
                 <div className="text-6xl mb-6 opacity-20">📅</div>
                 <h3 className="text-xl font-bold mb-2">Bu tarihte etkinlik yok</h3>
                 <p className="text-gray-400">Takvimden başka bir gün seçebilirsin.</p>
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
